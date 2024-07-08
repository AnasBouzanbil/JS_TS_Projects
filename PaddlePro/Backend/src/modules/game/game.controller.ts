import {Controller, Req, Get, Res, Param, Post, Body, Delete, Put, UseGuards} from '@nestjs/common'
import { Response } from 'express';
import { GameService } from './game.service';
import  {AuthGuard, Elegible}  from '../../auth/auth.guard';
import { map } from '../gateway/events.gateway';
import { emittoback } from '../friends/friends.controller';

// export class CreateGame{
//     receipient:string
// }
// export class UpdateGame{
//     playerOscore: number
//     playerTscore: number
// }

@UseGuards(AuthGuard)
@UseGuards(Elegible)
@Controller("game") // /game/last
export class GameController{
    constructor(private readonly gameService:GameService){}
    @Get("Userlast/:username")
    async getUserLastGames(@Req() req: Request, @Res() resp: Response, @Param("username") username:string){
        const ret = await this.gameService.getUserLastGames(req, username)
        if (ret.error){resp.status(403).send(ret)}
        else{resp.status(200).send(ret)}
    }
    @Get("last")
    async getLastGames(@Req() req: Request, @Res() resp: Response){
        const ret = await this.gameService.getLastGames(req)
        if (ret.error){resp.status(403).send(ret)}
        else{resp.status(200).send(ret)}
    }
    @Get(":id")
    async getGameDetail(@Req() req: Request, @Res() resp: Response, @Param("id") gameId:string){
        const ret = await this.gameService.getGameDetails(req, gameId)
        if (ret.error){resp.status(403).send(ret)}
        else{resp.status(403).send(ret)}
    }
    @Post("create")
    async createGame(@Req() req: Request, @Res() resp: Response, @Body() body:any){
        const ret = await this.gameService.createGame(req, body)
        if(ret.error){resp.status(403).send(ret)}
        else{
            const msg = `${req['user']['username']} has invited you to a game`
            await emittoback(req['user']['username'], map,body['receipient'],msg) ;resp.status(200).send(ret)
        }
    }
    @Delete("delete/:id/:status")
    async deleteGameNotif(@Req() req: Request, @Res() resp: Response, @Param("id") notifId:string, @Param("status") status:string){
        const ret = await this.gameService.deleteGameNotif(req, notifId);
        if (ret.error){resp.status(403).send(ret)}
        else{
            if (status === "deny"){
                const msg = `${req['user']['username']} has declined your invitation`
                await emittoback(req['user']['username'], map,ret.success['senderUsername'],msg) ;
            }
            resp.status(201).send(ret)}
    }
    // @Get("achievements/:id")
    // async getUserAchievements(@Req() req: Request, @Res() resp: Response, @Param("id") userId:string){
    //     const ret = await this.gameService.getUserAchievements(req, userId)
    //     if (ret.error){resp.status(403).send(ret)}
    //     else{resp.status(200).send(ret)}
    // }
    // @Get('level/:id')
    // async getLevel(@Req() req: Request, @Res() resp: Response, @Param("id") userId:string){
    //     const ret = await this.gameService.getLevel(req, userId)
    //     if (ret.error){resp.status(403).send(ret)}
    //     else{resp.status(200).send(ret)}
    // }
}