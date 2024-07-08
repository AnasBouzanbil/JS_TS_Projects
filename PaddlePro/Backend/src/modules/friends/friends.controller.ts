import { Controller, UseGuards, Get, Param, Req, Res, HttpStatus, Put, Post, Delete } from "@nestjs/common";
import { UserService } from "../users/users.service";
import { AuthGuard,Elegible } from "src/auth/auth.guard";
import { FriendService } from "./friends.service";
import { map } from "../gateway/events.gateway";
import { Socket } from 'socket.io'
import { Response } from "express";

export async function emittoback(username: string, map: any, friend: string, message: string) {
    try {
        const socket: Socket = map.get(username);
        const friendSocket: Socket = map.get(friend)
        if (socket && friendSocket)
            socket.to(friendSocket.id).emit("RealTimeActions", { message: message })
    }
    catch (e) {

    }
}

@UseGuards(AuthGuard)
@UseGuards(Elegible)
@Controller("friends")
export class FriendController {
    constructor(private readonly FriendService: FriendService) { }
    @Get("")
    async testingFriends(@Req() req: Request) {
        return await this.FriendService.gettingFriends(req)
    }

    @Get("add/:username")
    async addFriend(@Req() req: Request, @Param("username") username: string, @Res() resp: Response) {
        const ret = await this.FriendService.addFriend(req, username)
        if (ret['message']) {
            const message = `${req['user']['username']} has sent you a friend request`
            await emittoback(req['user']['username'], map, username, message)
            resp.status(200).send(ret)
        }
        else { resp.status(400).send(ret) }
    }

    @Post("accept/:username")
    async acceptFriend(@Req() req: Request, @Param("username") username: string, @Res() res: any) {
        const ret = await this.FriendService.acceptFriend(req, username)
        if (ret.error) {
            res.status(HttpStatus.BAD_REQUEST).send(ret)
        }
        else {
            const message = `${req['user']['username']} has accepted your friend request`
            await emittoback(req['user']['username'], map, username, message);
            res.status(HttpStatus.OK).send(ret)
        }
    }

    @Delete("reject/:username")
    async rejectFriend(@Req() req: Request, @Param("username") username: string, @Res() res: any) {
        const ret = await this.FriendService.rejectFriend(req, username)
        if (ret.error) {
            res.status(HttpStatus.BAD_REQUEST).send(ret)
        }
        else {
            const message = `${req['user']['username']} has rejected you.`
            await emittoback(req['user']['username'], map, username, message);
            res.status(HttpStatus.OK).send(ret)
        }
    }

    @Delete("remove/:username")
    async removeFriend(@Req() req: Request, @Param("username") username: string, @Res() res: Response) {
        const ret = await this.FriendService.removeFriend(req, username)
        if (ret.error) {
            res.status(HttpStatus.BAD_REQUEST).send(ret)
        }
        else {
            const message = `${req['user']['username']} has removed you`
            await emittoback(req['user']['username'], map, username, message);
            res.status(HttpStatus.OK).send(ret)
        }
    }
    @Post("block/:username")
    async blockFriend(@Req() req: Request, @Param("username") username: string, @Param("roomId") roomId: string, @Res() resp:Response) {
        const ret = await this.FriendService.blockFriend(req, username)
        if (ret.error){resp.status(400).send(ret)}
        else{resp.status(200).send(ret)}
    }
    @Post("unblock/:username")
    async unblock(@Req() req: Request, @Param("username") username: string, @Res() resp:Response) {
        const ret = await this.FriendService.unblockFriend(req, username)
        if (ret.error){resp.status(400).send(ret)}
        else{resp.status(200).send(ret)}
    }

}