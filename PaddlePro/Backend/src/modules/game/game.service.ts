import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { group } from "console";
// import { CreateGame, UpdateGame } from "./game.controller";
import { QueryRunnerProviderAlreadyReleasedError } from "typeorm";


const prisma = new PrismaClient()

@Injectable()
export class GameService {
    async getLevel(req: Request, userId: string) {
        try {
            const user = await prisma.user.findFirst({
                where: {
                    username: userId
                },
                select: {
                    level: true
                }
            })
            return { "level": user.level }
        } catch (err) {
            return { "error": "couldn't fetch the user level" }
        }
    }
    async getGameDetails(req: Request, gameId: string) {
        try {
            const game = await prisma.game.findFirst({
                where: {
                    id: gameId,
                },
                select: {
                    id: true,
                    playerOScore: true,
                    playerOUsername: true,
                    playerTUsername: true,
                    playerTScore: true
                }
            })
            return { "game": game }
        } catch (err) {
            return { "error": "couldn't fetch the game details" }
        }
    }
    async getUserAchievements(req: Request, userId: string) {
        try {
            const achivment = await prisma.user.findFirst({
                where: {
                    username: userId
                },
                select: {
                    achievement : true
                }
            })
            return { "achievement": achivment }
        } catch (err) {
            return { "error": "couldn't fetch the user achievements" }
        
        }
    }
    async deleteGameNotif(req: Request, notifId: string) {
        try {
            const notif = await prisma.notifications.delete({
                where: {
                    id: parseInt(notifId),
                },
                select:{
                    senderUsername: true
                }
            })
            return { "success": notif }
        } catch (err) {
            return { "error": "there has been an error deleting this game notif" }
        }
    }
    async createGame(req: Request, body: any) {
        if (body['receipient'] === undefined){
            throw new BadRequestException('missing receipient field') 
        }
        try {
            const user = await prisma.user.findFirst({
                where:{
                    username: req['user']['username']
                },
                select:{
                    id:true
                }
            })
            const friend = await prisma.user.findFirstOrThrow({
                where:{
                    username: body['receipient']
                },
                select:{
                    id:true,
                    username:true
                }
            })
            const check = await prisma.notifications.findFirst({
                where:{
                    OR:[
                        {senderUsername:req['user']['username'], reciepientUsername:body['receipient']},
                        {senderUsername:body['receipient'], reciepientUsername:req['user']['username']},
                    ],
                }
            })
            if (check !== null){
                throw new BadRequestException("already game invite is pending with this user")
            }
            const notif = await prisma.notifications.create({
                data: {
                    reciepient:{connect:{
                        id:friend.id
                    }},
                    content: `${req['user']['username']} has sent you a game invite`,
                    sender: {connect:{
                        id:user.id
                    }},
                    type:"game"
                }
            })
            return { "success": notif}
        } catch (err) {
            return { "error": "couldn't create a game notification" }
        }
    }
    async getUserLastGames(req:Request, username:string){
        try
        {
            const games = await prisma.game.findMany({
                where:{
                    OR:[
                        {playerOUsername: username},
                        {playerTUsername: username}
                    ]
                },
                select:{
                    id:true,
                    playerOScore:true,
                    playerTScore:true,
                    playerO:{
                        select:{
                            image:true,
                            username:true
                        }
                    },
                    playerT:{
                        select:{
                            image:true,
                            username:true
                        }
                    },
                }
            })
            return {"games":games}
        }catch(err){
            return {"error":"couldn't retrieve the user games"}
        }
    }
    async getLastGames(req:Request){
        try{
            const games = await prisma.game.findMany({
                take: 10,
                orderBy:{
                    created_on: 'desc'
                },
                select:{
                    id:true,
                    playerOScore:true,
                    playerTScore:true,
                    playerO:{
                        select:{
                            image:true,
                            username:true
                        }
                    },
                    playerT:{
                        select:{
                            image:true,
                            username:true
                        }
                    },
                }
            })
            return {"games":games}
        }catch(err){
            return {"error":"couldn't retrieve last games"}
        }
    }
}