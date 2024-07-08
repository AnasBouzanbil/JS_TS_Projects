import { Controller, Delete, Get, Param, Res,Req,UseGuards } from "@nestjs/common";
import { MessagesService } from "./message.service";
import { Response } from "express";
import { AuthGuard, Elegible } from "src/auth/auth.guard";

@UseGuards(AuthGuard)
@UseGuards(Elegible)
@Controller("messages")
export class MessagesController
{
    constructor(private readonly MessagesService:MessagesService){}
    @Get("room/:roomid")
    async getMessages(@Req() req:Request,@Param() params: any, @Res() resp: Response) {
        const messages = await this.MessagesService.getMessages(req, parseInt(params.roomid))
        if (messages.error){resp.status(403).send(messages)}
        else{resp.status(200).send(messages)}
        
    }
    @Delete("message/:messageid")
    async deleteMessage(@Param() params:any, @Res() resp: Response)
    {
        const ret = await this.MessagesService.deleteMessage(parseInt(params.messageid))
        if (ret.error){resp.status(403).send(ret)}
        else{resp.status(200).send(ret)}
        return 
    }
}