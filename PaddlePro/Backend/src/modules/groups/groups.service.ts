import { Injectable, BadRequestException, Body, HttpException } from "@nestjs/common";
import { ExceptionsHandler } from "@nestjs/core/exceptions/exceptions-handler";
import { PrismaClient } from "@prisma/client";
import { extname } from "path";
import * as fs from 'fs'

const prisma = new PrismaClient()

function check_types(type: string) {
    if (type !== "Public" && type !== "Private" && type !== "Protected") {
        throw new BadRequestException("The type is not valid")
    }
}

@Injectable()
export class groupService {
    async getUserGroups(req: Request) {
        try {
            const user = await prisma.user.findFirst({
                where: {
                    username: req['user']['username']
                },
                select: {
                    groups: {
                        select: {
                            id: true,
                            name: true,
                            image: true,
                            desc: true,
                            type: true,
                            admins: true,
                            owner: true,
                            banned: true,
                            muted: true,
                        }
                    }
                }
            })

            if (user === null) {
                return
            }

            const isAdminOfGroups = user.groups.map(group => {
                return {
                    id: group.id,
                    name: group.name,
                    image: group.image,
                    desc: group.desc,
                    type: group.type,
                    isAdmin: group.admins.some(user => user.username === req['user']['username']),
                    isOwner: group.owner.username === req['user']['username'],
                    isBanned: group.banned.some((u) => u.username === req['user']['username']),
                    isMuted: group.muted.some((u) => u.username === req['user']['username']),

                };
            });
            return isAdminOfGroups
        }
        catch (err) {
            return { "error": "unable to fetch user groups" }
        }
    }
    async updateGroup(req: Request, groupId: string, body: Body) {
        if (! /^[a-zA-Z0-9]+$/.test(body['name'])) {
            return { "error": "Name must have only alnum chars" }
        }
        try {
            check_types(body['type'])
            const group = await prisma.group.update({
                where: {
                    id: parseInt(groupId),
                    admins: { some: { username: req['user']['username'] } }
                },
                data: {
                    name: body['name'],
                    desc: body['desc'],
                    type: body['type'],
                    passcode: body['passcode']
                }
            })
            return { "success": "group updated successfully" }
        } catch (err) {
            return { "error": "couldn't update the group details" }
        }
    }
    async updateGroupImage(req: Request, groupId: string, file: Express.Multer.File) {
        try {
            const currentUser = req['user']
            const fileExtension = extname(file.originalname);
            const newFileName = `${file.filename}${fileExtension}`;
            const newPath = `./uploads/${newFileName}`;
            fs.renameSync(file.path, newPath);
            const newGrp = await prisma.group.update({
                where: {
                    id: parseInt(groupId),
                    admins: {
                        some: {
                            username: currentUser['username']
                        }
                    }
                },
                data: {
                    image: `http://127.0.0.1:4000/users/images/${newFileName}`,
                },
                select: {
                    id: true,
                    image: true
                }
            })
            return { "success": newGrp }
        } catch (err) {
            return { "error": "couldnt update the group image" }
        }
    }
    async acceptPrivateGroup(req: Request, groupName: string, notifid: string) {
        try {
            const check = await prisma.group.findFirst({
                where: {
                    name: groupName
                },
                select: {
                    id: true,
                    members: true,
                    banned: true
                }
            })
            if (check === null || check.members.find((user) => user.username === req['user']['username']) !== undefined) {
                throw new ExceptionsHandler()
            }
            if (check.banned.find((user) => user.username === req['user']['username']) !== undefined) {
                throw new ExceptionsHandler()
            }
            const group = await prisma.group.update({
                where: {
                    id: check.id,
                },
                data: {
                    members: {
                        connect: { username: req['user']['username'] }
                    }
                }
            })
            const notif = await prisma.notifications.delete({
                where: {
                    id: parseInt(notifid)
                }
            })
            return { "success": "User has been added to the group" }
        }
        catch (err) {
            return { "error": "There has been an error adding the user to the group" }
        }
    }
    async denyPrivateGroup(req: Request, notifId: string) {
        try {
            const check = await prisma.notifications.delete({
                where: {
                    id: parseInt(notifId),
                    reciepientUsername: req['user']['username']
                },
            })
            if (check === null || check === undefined) {
                throw new ExceptionsHandler()
            }
            return { "success": "User has rejected joining the group" }
        }
        catch (err) {
            return { "error": "There has been an error rejecting the group" }
        }
    }
    async sendPrivateGroup(req: Request, reciepient: string, groupName: string) {
        try {
            const check = await prisma.group.findFirst({
                where: {
                    name: groupName
                },
                select: {
                    id: true,
                    members: true
                }
            })
            if (check === null) {
                throw new ExceptionsHandler()
            }
            if (check.members.find((user) => user.username === reciepient) !== undefined) {
                throw new ExceptionsHandler()
            }
            const isAlready = await prisma.notifications.findFirst({
                where: {
                    senderUsername: req['user']['username'],
                    reciepientUsername: reciepient,
                    type: "GroupJoin"
                }
            })
            if (isAlready !== null) { throw new BadRequestException("A request is already sent") }
            const notif = await prisma.notifications.create({
                data: {
                    senderUsername: req['user']['username'],
                    reciepientUsername: reciepient,
                    content: `${req['user']['username']} has sent you a request to join private channel ${groupName}`,
                    type: "GroupJoin"
                }
            })
            const invite = await prisma.invites.create({
                data: {
                    reciepients: {
                        connect: { username: reciepient },
                    },
                    group: {
                        connect: { name: groupName }
                    }
                }
            })
            return { "success": "User has been requested" }
        }
        catch (err) {
            return { "error": "There has been an error adding the user to the group" }
        }
    }
    async addUserToGroup(req: Request, groupId: string, passcode: string) {
        const groupIdd = parseInt(groupId)
        try {
            const check = await prisma.group.findFirst({
                where: {
                    id: groupIdd,
                },
                select: {
                    name: true,
                    members: true,
                    passcode: true,
                    type: true,
                    banned: true,
                }
            })
            if (check === null) {
                throw new ExceptionsHandler()
            }
            if (check.banned.find((user) => user.username === req['user']['username']) !== undefined) {
                throw new ExceptionsHandler()
            }
            if (check.members.find((user) => user.username === req['user']['username']) !== undefined) {
                throw new ExceptionsHandler()
            }
            if (check.type == "Private") {
                throw new ExceptionsHandler()
            }
            if (check.type == "Protected" && check.passcode !== passcode) {
                throw new ExceptionsHandler()
            }
            const group = await prisma.group.update({
                where: {
                    id: groupIdd,
                },
                data: {
                    members: {
                        connect: { username: req['user']['username'] }
                    }
                }
            })
            return { "success": "User has been added to the group" }
        }
        catch (err) {
            return { "error": "There has been an error adding the user to the group" }
        }
    }

    async createGroup(req: Request, body: Body, file: Express.Multer.File) {
        try {
            if (body['name'] === "") { return { "error": "Group name must be filled" } }
            if (body['type'] !== 'Private' && body['type'] !== 'Public' && body['type'] !== 'Protected') {
                return { "error": "Group type is not valid" }
            }
            if (body['type'] == "Protected" && (body['passcode'] == "" || body['passcode'] == undefined)) {
                return { "error": "Passcode must be set" }
            }
            if (! /^[a-zA-Z0-9]+$/.test(body['name'])) {
                return { "error": "Name must have only alnum chars" }
            }
            const isExist = await prisma.group.findFirst({
                where: {
                    name: body['name']
                }
            })
            if (isExist !== null) {
                return { "error": "Their is already a group with that name" }
            }
            const fileExtension = extname(file.originalname);
            const newFileName = `${file.filename}${fileExtension}`;
            const newPath = `./uploads/${newFileName}`;
            fs.renameSync(file.path, newPath);
            const group = await prisma.group.create({
                data: {
                    owner: {
                        connect: { username: req['user']['username'] }
                    },
                    name: body['name'],
                    passcode: body['passcode'],
                    admins: {
                        connect: { username: req['user']['username'] }
                    },
                    members: {
                        connect: { username: req['user']['username'] }
                    },
                    type: body['type'],
                    image: `http://127.0.0.1:4000/users/images/${newFileName}`,
                    desc: body['desc']
                }
            })
            return { "success": group }
        } catch (err) {
            return { "error": "Their was an error creating this group" }

        }
    }
    async removeUserFromGroup(req: Request, groupId: string): Promise<{ "error": string } | { "success": string }> {
        const groupIdd = parseInt(groupId)
        try {
            const check = await prisma.group.findFirst({
                where: {
                    id: groupIdd
                },
                select: {
                    members: true,
                    owner: true
                }
            })
            if (check === null || check.members.find((user) => user.username === req['user']['username']) === undefined) {
                throw new ExceptionsHandler()
            }
            if (check.owner.username === req['user']['username']) {
                try {
                    const group = await prisma.group.delete({
                        where: {
                            id: groupIdd,
                        }
                    })
                    return { "success": "User has been removed from the group" }
                } catch (err) {
                    return { "error": "There has been an error removing the user to the group" }
                }
                return
            }
            const group = await prisma.group.update({
                where: {
                    id: groupIdd,
                },
                data: {
                    members: {
                        disconnect: { username: req['user']['username'] }
                    },
                    admins: {
                        disconnect: { username: req['user']['username'] }
                    }
                }
            })
            return { "success": "User has been removed from the group" }
        }
        catch (err) {
            return { "error": "There has been an error removing the user to the group" }
        }
    }
    async searchGroup(kw: string): Promise<any> {
        const users = await prisma.group.findMany({
            where: {
                name: {
                    mode: 'insensitive',
                    contains: kw
                }
            },
            select: {
                id: true,
                name: true,
                type: true,
                image: true
            }
        })
        return users
    }
    async getMemebersOfGroup(req: Request, groupid: string) {
        const groupIdd = parseInt(groupid)
        try {
            const check = await prisma.group.findFirst({
                where: {
                    id: groupIdd
                },
                select: {
                    members: {
                        select: {
                            username: true,
                            image: true,
                        }
                    },
                    admins: {
                        select: {
                            username: true
                        }
                    },
                    owner: {
                        select: {
                            username: true
                        }
                    },
                    banned: {
                        select: {
                            username: true,
                            image: true,
                        },
                    },
                    muted: {
                        select: {
                            username: true
                        },
                    },
                }

            })
            if (check === null) {
                throw new ExceptionsHandler()
            }
            return check
        }
        catch (err) {
            return { "error": "There has been an error fetching the members of the group" }
        }
    }
    async getB(username:string, tocheck:string){
        try{
        let checks = await prisma.blocked.findFirst({
            where:{
                username:username
            },
            select:{
                members:true
            }
        })
        const ret = checks.members.find((member)=>member.username===tocheck)
        if (ret){
            return true
        }
        else{
            return false
        }
        
    }catch(err){
        return false
    }
    }
    async getMessagesOfGroup(req: Request, groupId: string) {
        try {
            let messages = await prisma.groupMessages.findMany({
                where: {
                    groupId: parseInt(groupId),
                },
                select: {
                    id: true,
                    content: true,
                    sender_name: true,
                    created_on: true
                }
            })
            let newMessages = await Promise.all(messages.map(async (message)=>{
                let ret = await this.getB(req['user']['username'],message.sender_name)
                if (ret === true){
                    message.content = ""
                }
            }))
            return messages
        } catch (err) {
            return { "error": "Couldn't fetch messages" }
        }
    }
    async setUserAdmin(req: Request, groupid: string, username: string) {
        try {
            const group = await prisma.group.findFirst({
                where: {
                    id: parseInt(groupid),
                    userId: req['user']['id'],
                },
                select: {
                    owner: true,
                    members: true,
                    admins: true,
                }
            })
            if (group === undefined || group.admins.find((member) => member.username === username) !== undefined || group.members.find((member) => member.username === username) === undefined) { throw new ExceptionsHandler() }
            const newgrp = await prisma.group.update({
                where: {
                    id: parseInt(groupid)
                },
                data: {
                    admins: {
                        connect: { username: username }
                    }
                }
            })
            return { "success": "User has been added to admins" }
        } catch (err) {
            return { "error": "There has been an error adding this user to admin" }
        }

    }
    async removeAdminship(req: Request, groupid: string, username: string) {
        try {
            const group = await prisma.group.findFirst({
                where: {
                    id: parseInt(groupid),
                    userId: req['user']['id'],
                },
                select: {
                    owner: true,
                    members: true,
                    admins: true,
                }
            })
            if (group === undefined || group.admins.find((member) => member.username === username) === undefined) { throw new ExceptionsHandler() }
            const newgrp = await prisma.group.update({
                where: {
                    id: parseInt(groupid)
                },
                data: {
                    admins: {
                        disconnect: { username: username }
                    }
                }
            })
            return { "success": "User has been removed from admins" }
        } catch (err) {
            return { "error": "There has been an error removing this user from admin" }
        }
    }
    async removeUserFromGroupByAdmin(req: Request, groupId: string, username: string) {
        try {
            const group = await prisma.group.findFirst({
                where: {
                    id: parseInt(groupId),
                    admins: {
                        some: {
                            username: req['user']['username']
                        }
                    }
                },
                select: {
                    owner: true,
                    members: true,
                    admins: true,
                }
            })
            if (group === undefined || group.members.find((member) => member.username === username) === undefined) { throw new ExceptionsHandler() }
            const newgrp = await prisma.group.update({
                where: {
                    id: parseInt(groupId),
                },
                data: {
                    members: {
                        disconnect: { username: username }
                    },
                    admins: { disconnect: { username: username } }
                }
            })
            return { "success": "User has been removed from the group" }
        } catch (err) {
            return { "error": "There has been an error removing this user from this group" }
        }
    }
    async banUser(req: Request, groupid: string, username: string) {
        try {
            const check = await prisma.group.findFirst({
                where: {
                    id: parseInt(groupid)
                },
                select: {
                    owner: true
                }
            })
            if (check === null || check.owner.fusername === username) { throw new BadRequestException() }
            const group = await prisma.group.update({
                where: {
                    id: parseInt(groupid),
                    admins: { some: { username: req['user']['username'] } }
                },
                data: {
                    banned: { connect: { username: username } },
                    members: { disconnect: { username: username } },
                    admins: { disconnect: { username: username } }
                }
            })
            return { "success": "user have been banned" }
        } catch (err) {
            return { "error": "there has been an error banning the user" }
        }
    }
    async unbanUser(req: Request, groupid: string, username: string) {
        try {
            const group = await prisma.group.update({
                where: {
                    id: parseInt(groupid),
                    admins: { some: { username: req['user']['username'] } }
                },
                data: {
                    banned: { disconnect: { username: username } }
                }
            })
            return { "success": "user have been banned" }
        } catch (err) {
            return { "error": "there has been an error banning the user" }
        }
    }
    async muteUser(req: Request, groupid: string, username: string) {
        try {
            const check = await prisma.group.findFirst({
                where: {
                    id: parseInt(groupid)
                },
                select: {
                    owner: true
                }
            })
            if (check === null || check.owner.fusername === username) { throw new BadRequestException() }
            const group = await prisma.group.update({
                where: {
                    id: parseInt(groupid),
                    admins: { some: { username: req['user']['username'] } }
                },
                data: {
                    muted: { connect: { username: username } }
                }
            })
            return { "success": "user have been muted" }
        } catch (err) {
            return { "error": "there has been an error muting the user" }
        }
    }
    async unmuteUser(req: Request, groupid: string, username: string) {
        try {
            const check = await prisma.group.findFirst({
                where: {
                    id: parseInt(groupid)
                },
                select: {
                    owner: true
                }
            })
            if (!check || check.owner.fusername === username) { throw new BadRequestException() }
            const group = await prisma.group.update({
                where: {
                    id: parseInt(groupid),
                    admins: { some: { username: req['user']['username'] } }
                },
                data: {
                    muted: { disconnect: { username: username } }
                }
            })
            return { "success": "user have been unmuted" }
        } catch (err) {
            return { "error": "there has been an error unmuted the user" }
        }
    }
    async checkGroupName(req: Request, tocheck: string) {
        try {
            if (! /^[a-zA-Z0-9]+$/.test(tocheck)) {
                throw new BadRequestException("Check the characters")
            }
            const grp = await prisma.group.findFirst({
                where: {
                    name: tocheck
                }
            })
            if (grp != null) {
                throw new BadRequestException("Group name already exist")
            }
            return { "success": "group name is valid" }
        } catch (err) {
            return { "error": err.message }
        }
    }
}