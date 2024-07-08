import { Injectable, Req, ForbiddenException, UnauthorizedException, UploadedFile, BadRequestException } from '@nestjs/common';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';
import { PrismaClient } from '@prisma/client';
import { UserService } from '../users/users.service';
import { createNotification, destroyNotification } from '../gateway/events.gateway'
import { Or } from 'typeorm';

function getRoomId(req: Request, directs: any, friendUsername: string) {
    let id: any;
    directs.forEach((direct: any) => {
        if (direct.direct.members.some((obj: any) => obj.username === req['user']['username']) === true &&
            direct.direct.members.some((obj: any) => obj.username === friendUsername) === true) {
            id = direct.direct.id;
        }
    });
    return id;
}

async function getBlooked(req: Request, directs: any, friendUsername: string){
    const u = await prisma.blocked.findFirst({
        where:{
            username:req['user']['username']
        },
        select:{
            members:{
                select:{
                    username:true
                }
            }
        }
    })
    if (u == null){return false}
    const blockeds = u.members;
    const blocked = blockeds.find((user:any)=>user.username === friendUsername)
    if (blocked !== undefined){return true}
    else{return false}
}

function getUnseenNums(req:Request, messages:any, friend:string){
    const ret = messages.filter((message:any)=> message.seen == false && message.sender_name==friend)
    return ret.length
}

const prisma = new PrismaClient()

@Injectable()
export class FriendService {
    constructor(private readonly UserService: UserService) { }
    async addFriend(req: Request, username: string): Promise<any> {
        try {
            if (req['user']['username'] === username) {
                throw new ExceptionsHandler()
            }
            const existingFriendship = await prisma.friendship.findFirst({
                where: {
                    OR: [
                        { sender: req["user"]["username"], reciever: username },
                        { reciever: username, sender: req["user"]["username"] }
                    ]
                }
            });

            if (existingFriendship) {
                return { Failure: "Friendship already exists." };
            }
            await prisma.friendship.create({
                data: {
                    sender: req["user"]["username"],
                    reciever: username
                }
            });
            const content = `${req['user']['username']} has requested to be your friend`
            createNotification(req, content, username)
            return { message: "Friendship added successfully." };
        } catch (err) {
            return { error: "Error adding friend." };
        }
    }
    async removeFriend(req: Request, username: string) {
        try {
            const friendship = await prisma.friendship.findFirst({
                where: {
                    OR: [
                        { sender: req['user']['username'], reciever: username },
                        { sender: username, reciever: req['user']['username'] }
                    ]
                },
                select: {
                    id: true
                }
            });

            if (!friendship) {
                return { message: "Friendship does not exist." };
            }
            const relation = await prisma.friendship.delete({
                where: {
                    id: friendship.id
                }
            })
            try {
            const notif = await prisma.notifications.findFirst({
                where: {
                    OR: [
                        { senderUsername: req['user']['username'], reciepientUsername: username },
                        { senderUsername: username, reciepientUsername: req['user']['username'] }
                    ]
                }
            })
            if (notif !== null){
                const deleted = await destroyNotification(notif.id)
            }
            }catch(e) {
            }
            const dm = await prisma.direct.findFirst({
                where:{
                    members: {
                        some: { username: req['user']['username'] }
                    },
                    AND: {
                        members: {
                            some: { username: username }
                        }
                    }
                },
                select:{
                    id: true,
                }
            })
            const deletedm = await prisma.direct.delete({
                where:{
                    id: dm.id
                }
            })
            return { message: "Friendship deleted successfully." };
        }
        catch (err) {
            return { error: "Error deleting friendship." };
        }
    }
    async gettingFriends(req: Request) {
        const user = await prisma.user.findFirst({
            where: { username: req["user"]["username"] },
            include: {
                friendshipsA: {
                    select: {
                        userB: {
                            select: {
                                username: true,
                                image: true,
                                onlineStatus: true,
                                inGame:true
                            }
                        },
                        status: true,
                        sender: true,
                        reciever: true,
                    },
                },
                friendshipsB: {
                    select: {
                        userA: {
                            select: {
                                username: true,
                                image: true,
                                onlineStatus:true,
                                inGame:true
                            }
                        },
                        status: true,
                        sender: true,
                        reciever: true,
                    },
                },
                direct: {
                    select: {
                        id: true,
                        direct: {
                            select:
                            {
                                id: true,
                                members: true,
                            }
                        }
                    }
                },
                messageReceipient:{
                    select:{
                        sender_name:true,
                        reciepient_name: true,
                        seen: true
                    }
                },
                blocked:{
                    select:{
                        members:{
                            select:{
                                username:true
                            }
                        }
                    }
                }
            },
        });
    
        let friends = [];
        let groupFriends = [];
    
        const getBlockedStatus = async (username) => {
            return await getBlooked(req, user.direct, username);
        };
        let blockedMembers = []
        try {
            const friendshipAPromises = user.friendshipsA.map(async (friendship) => ({
                user: friendship.userB.username,
                onlineStatus: friendship.userB.onlineStatus,
                inGame: friendship.userB.inGame,
                image: friendship.userB.image,
                status: friendship.status,
                sender: friendship.sender,
                receiver: friendship.reciever,
                roomId: friendship.status === "accepted" ? getRoomId(req, user.direct, friendship.userB.username) : null,
                blocked: friendship.status === "accepted" ? await getBlockedStatus(friendship.userB.username) : false,
                unseenNum: getUnseenNums(req,user.messageReceipient,friendship.userB.username)
            }));
    
            const friendshipBPromises = user.friendshipsB.map(async (friendship) => ({
                user: friendship.userA.username,
                onlineStatus: friendship.userA.onlineStatus,
                inGame: friendship.userA.inGame,
                image: friendship.userA.image,
                status: friendship.status,
                sender: friendship.sender,
                receiver: friendship.reciever,
                roomId: friendship.status === "accepted" ? getRoomId(req, user.direct, friendship.userA.username) : null,
                blocked: friendship.status === "accepted" ? await getBlockedStatus(friendship.userA.username) : false,
                unseenNum: getUnseenNums(req,user.messageReceipient,friendship.userA.username)
            }));
    
            const [friendshipsA, friendshipsB] = await Promise.all([
                Promise.all(friendshipAPromises),
                Promise.all(friendshipBPromises)
            ]);
    
            friends = friendshipsA.concat(friendshipsB);
            user.blocked.forEach((bl)=>{
                bl.members.forEach((member)=>{
                    blockedMembers.push(member.username)
                })
            })
        } catch (err) {
            console.error(err);
        }
    
        return { friends: friends,blocked:blockedMembers };
    }
    
    async acceptFriend(req: Request, username: string) {
        try {
            if (req['user']['username'] === username) {
                throw new BadRequestException()
            }

            const existingFriendship = await prisma.friendship.findFirst({
                where: {
                    reciever: req["user"]["username"],
                    sender: username,
                },
            });
            if (existingFriendship.status === "accepted") { return { error: "Already friends" } }
            const newone = await prisma.friendship.update({
                where: {
                    id: existingFriendship.id,
                },
                data: {
                    status: "accepted",
                }
            })
            const notif = await prisma.notifications.findFirst({
                where: {
                    reciepientUsername: req["user"]["username"],
                    senderUsername: username
                }
            })
            const des = await destroyNotification(notif.id)
            const room = await prisma.direct.create({
                data: {
                    members: {
                        create: [
                            {
                                username: req['user']['username']
                            },
                            {
                                username: username
                            }
                        ]
                    },
                }
            })
            return { room: room.id }
        }
        catch (err) {
            return { error: "There has been an error accepting users" }
        }
    }
    async rejectFriend(req: Request, username: string) {
        try {
            if (req['user']['username'] === username) {
                throw new ExceptionsHandler()
            }
            const existingFriendship = await prisma.friendship.findFirst({
                where: {
                    OR:[
                        {reciever: req["user"]["username"],sender: username},
                        {reciever: username,sender: req["user"]["username"]}
                    ]
                },
            });
            if (existingFriendship !== undefined) {
                const newthing = await prisma.friendship.delete({
                    where: {
                        id: existingFriendship.id,
                    }
                })
            }
            const notif = await prisma.notifications.findFirst({
                where: {
                    OR:[
                        {reciepientUsername: req["user"]["username"],senderUsername: username},
                        {reciepientUsername: username,senderUsername: req["user"]["username"]},
                    ]
                }
            })
            const des = await destroyNotification(notif.id)
            return { message: "The user has been rejected" }
        }
        catch (err) {
            return { error: "There has been an error rejecting users" }
        }
    }
    async blockFriend(req: Request, username: string) {
        try {
            if (req['user']['username'] === username){throw new BadRequestException("this is it")}
            const user = await prisma.directUser.findFirst({
                where: { username: username },
                select: { id: true, username:true }
            })
            const isexist = await prisma.blocked.findFirst({
                where:{
                    user:{
                        username:req['user']['username']
                    }
                }
            })
            if (isexist !== null){
                const up = await prisma.blocked.update({
                    where:{
                        id:isexist.id
                    },
                    data:{
                        members:{connect:{username:username}}
                    }
                })
            }
            else{
            const up = await prisma.blocked.create({
                data:{
                    user:{connect:{username:req['user']['username']}},
                    members:{connect:{username:username}}
                }
            })
        }
            return {"success":"The user has been blocked"}
        }catch(err){
            return {"error":"Their has been an error blocking the user"}
        }
    }
    async unblockFriend(req: Request, username: string) {
        try {
            if (req['user']['username'] == username){throw new BadRequestException()}
            const user = await prisma.user.findFirst({
                where: { username: username },
                select: { id: true }
            })
            const isexist = await prisma.blocked.findFirst({
                where:{
                    user:{
                        username:req['user']['username']
                    }
                },
                select:{
                    id:true,
                    username:true,
                    members:true
                }
            })
            const up = await prisma.blocked.update({
                where: {
                    id:isexist.id
                },
                data: {
                    members: {
                        disconnect: { id: user.id }
                    }
                }
            })
            return {"success":"The user has been unblocked"}
        }catch(err){
            return {"error":"Their has been an error unblocking the user"}
        }
    }
}