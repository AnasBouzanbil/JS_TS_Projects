import { Controller, Get, Res, Post, Req, Param, Delete, Body, UploadedFile, UseInterceptors, Put } from "@nestjs/common";
import { groupService } from "./groups.service";
import { AuthGuard, Elegible } from "src/auth/auth.guard";
import { UseGuards } from "@nestjs/common";
import { Response } from "express";
import * as mime from 'mime-types';
import * as path from 'path'
import { join } from "path";
import { readFile } from 'fs/promises';
import { FileInterceptor } from "@nestjs/platform-express";
import { map } from "../gateway/events.gateway";
import { emittoback } from "../friends/friends.controller";


@UseGuards(AuthGuard)
@UseGuards(Elegible)
@Controller("groups")
export class groupController {
    constructor(private readonly groupService: groupService) {  }
    @Get("")
    async getUserGroups(@Req() req: Request, @Res() resp: Response) {
        const ret = await this.groupService.getUserGroups(req)
        if (ret['error']){resp.status(403).send(ret)}
        else{resp.status(200).send(ret)}
    }

    @Put(":groupId")
    async updateGroup(@Req() req: Request, @Body() body: Body, @Param("groupId") groupId: string, @Res() resp:Response) {
        const ret = await this.groupService.updateGroup(req, groupId, body)
        if (ret.error){resp.status(403).send(ret)}
        else{resp.status(200).send(ret)}
    }
    @Get("/check/:tocheck")
    async checkGroupName(@Req() req: Request, @Param("tocheck") tocheck: string, @Res() resp:Response){
        const ret = await this.groupService.checkGroupName(req, tocheck)
        if (ret.error){resp.status(403).send(ret)}
        else{resp.status(200).send(ret)}
    }
    @Put(":groupId/update_image")
    @UseInterceptors(FileInterceptor('file', {
        dest: './uploads'
      }))
    async updateGroupImage(@Req() req: Request,@Param("groupId") groupId: string, @UploadedFile() file:Express.Multer.File,@Res() resp:Response) {
        const ret = await this.groupService.updateGroupImage(req, groupId, file)
        if (ret.error){resp.status(403).send(ret)}
        else{resp.status(200).send(ret)}
    }
    @Get("/members/:groupid")
    async getMemebersOfGroup(@Req() req: Request, @Param('groupid') groupid: string, @Res() resp: Response) {
        const ret = await this.groupService.getMemebersOfGroup(req, groupid);
        if (ret['error']) { resp.status(400).send(ret) }
        else { resp.status(200).send(ret) }
    }
    @Get("messages/:groupid")
    async getMessagesOfGroup(@Req() req: Request, @Param('groupid') groupid: string, @Res() resp: Response) {
        const ret = await this.groupService.getMessagesOfGroup(req, groupid)
        if (ret['error'] !== undefined) { resp.status(403).send(ret) }
        else { resp.status(200).send(ret) }
    }

    @Post("add/:groupid/:passcode")
    async addUserToGroup(@Req() req: Request, @Param('groupid') groupId: string, @Param('passcode') passcode: string,@Res() resp: Response) {
        const ret = await this.groupService.addUserToGroup(req, groupId, passcode)
        if (ret.error){resp.status(400).send(ret)}
        else{resp.status(201).send(ret)} 
    }

    @Delete("delete/:groupid") /**/
    async removeUserFromGroup(@Req() req: Request, @Param("groupid") groupId: any, @Res() resp:Response) {
        const ret = await this.groupService.removeUserFromGroup(req, groupId)
        if (ret['error']){resp.status(400).send(ret)}
        else{resp.status(200).send(ret)} 
    }
    @Delete("delete/:groupid/:username") /**/
    async removeUserFromGroupByAdmin(@Req() req: Request, @Param("groupid") groupId: any, @Param("username") username: any, @Res() resp: Response) {
        const ret = await this.groupService.removeUserFromGroupByAdmin(req, groupId, username)
        if (ret.error) {
            ; resp.status(400).send(ret)
        }
        else {
            const message = `The admin has kicked you`
            await emittoback(req['user']['username'], map,username,message);
             resp.status(204).send(ret) }
    }
    @Post("send/:receipient/:groupname")
    async sendPrivateGroup(@Req() req: Request, @Param('receipient') receipient: string, @Param('groupname') groupname: string, @Res() resp:Response) {
        const ret = await this.groupService.sendPrivateGroup(req, receipient, groupname)
        if (ret.error){resp.status(400).send(ret)}
        else{const message = `The admin has requested you to join private channel ${groupname}`
        await emittoback(req['user']['username'], map,receipient,message);
         resp.status(204).send(ret) } 
    }
    @Post("accept/:groupname/:notifid")
    async acceptPrivateGroup(@Req() req: Request, @Param('groupname') groupname: string,@Param('notifid') notifid: string ,@Res() resp: Response) {
        const ret = await this.groupService.acceptPrivateGroup(req, groupname,notifid)
        if (ret.error) { resp.status(403).send(ret) }
        else { resp.status(200).send(ret) }
    }
    @Post("deny/:notifId")
    async denyPrivateGroup(@Req() req: Request, @Param('notifId') notifId: string, @Res() resp: Response) {
        const ret = await this.groupService.denyPrivateGroup(req, notifId)
        if (ret.error) { resp.status(403).send(ret) }
        else { resp.status(200).send(ret) }
    }
    @Post("create")
    @UseInterceptors(FileInterceptor('file', {
        dest: './uploads'
    }))
    async createGroup(@Req() req: Request, @Body() body: any, @Res() resp: Response, @UploadedFile() file: any) {
        const ret = await this.groupService.createGroup(req, body, file)
        if (ret.error) { resp.status(400).send(ret) }
        else { resp.status(201).send(ret) }
    }
    @Get("search/:kw")
    async getGroups(@Req() req: Request, @Param('kw') kw: string) {
        return this.groupService.searchGroup(kw)
    }
    // @Post(":groupid/block/:username")
    // async BlockUser(@Req() req: Request, @Param('groupid') groupid: string, @Param('username') username: string, @Res() resp: Response) {
    //     const ret = await this.groupService.blockUserFromGroup(req, groupid, username)
    //     if (ret.error !== undefined) { resp.status(400).send(ret) }
    //     else { const message = `The admin has promoted you`
    //     await emittoback(req['user']['username'], map,username,message);
    //     resp.status(200).send(ret) }
    // }
    @Post(":groupid/promote/:username")
    async promoteUser(@Req() req: Request, @Param('groupid') groupid: string, @Param('username') username: string, @Res() resp: Response) {
        const ret = await this.groupService.setUserAdmin(req, groupid, username)
        if (ret.error !== undefined) { resp.status(400).send(ret) }
        else { const message = `The admin has promoted you`
        await emittoback(req['user']['username'], map,username,message);
        resp.status(200).send(ret) }
    }
    @Post(":groupid/demote/:username")
    async demoteUser(@Req() req: Request, @Param('groupid') groupid: string, @Param('username') username: string, @Res() resp: Response) {
        const ret = await this.groupService.removeAdminship(req, groupid, username)
        if (ret.error !== undefined) { resp.status(400).send(ret) }
        else {const message = `The admin has demoted you`
        await emittoback(req['user']['username'], map,username,message); resp.status(200).send(ret) }
    }
    @Get("images/:imagename")
    async serveImage(@Param('imagename') imagename: string, @Res() res: Response) {
        // Construct the path to the image file
        const imagePath = join(path.resolve(process.cwd()), 'uploads', imagename);
        const iMime = mime.lookup(imagePath)
        try {
            const image = await readFile(imagePath);
            res.set('Content-Type', iMime);
            res.send(image)
        } catch (error) {
            res.status(404).send('Not found');
        }
    }
    @Post(":groupid/ban/:username")
    async banUser(@Req() req: Request, @Param('groupid') groupid: string, @Param('username') username: string, @Res() resp: Response) {
        const ret = await this.groupService.banUser(req, groupid, username);
        if (ret.error) { resp.status(400).send(ret) }
        else {const message = `The admin has banned you`
        await emittoback(req['user']['username'], map,username,message); resp.status(200).send(ret) }
    }
    @Post(":groupid/unban/:username")
    async unbanUser(@Req() req: Request, @Param('groupid') groupid: string, @Param('username') username: string, @Res() resp: Response) {
        const ret = await this.groupService.unbanUser(req, groupid, username);
        if (ret.error) { resp.status(400).send(ret) }
        else {const message = `The admin has unbanned you`
        await emittoback(req['user']['username'], map,username,message); resp.status(200).send(ret) }
    }
    @Post(":groupid/mute/:username")
    async muteUser(@Req() req: Request, @Param('groupid') groupid: string, @Param('username') username: string, @Res() resp: Response) {
        const ret = await this.groupService.muteUser(req, groupid, username);
        if (ret.error) { resp.status(400).send(ret) }
        else {const message = `The admin has muted you`
        await emittoback(req['user']['username'], map,username,message); resp.status(200).send(ret) }
    }
    @Post(":groupid/unmute/:username")
    async unmuteUser(@Req() req: Request, @Param('groupid') groupid: string, @Param('username') username: string, @Res() resp: Response) {
        const ret = await this.groupService.unmuteUser(req, groupid, username);
        if (ret.error) { resp.status(400).send(ret) }
        else {const message = `The admin has unmuted you`
        await emittoback(req['user']['username'], map,username,message); resp.status(200).send(ret) }
    }

}