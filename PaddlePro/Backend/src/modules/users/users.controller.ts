import { Controller, Get, Param,Post, Body, UseGuards, Req, Put,UploadedFile,UseInterceptors, Res,Headers } from "@nestjs/common"
import { UserService } from "./users.service"
import { AuthGuard, Elegible } from "src/auth/auth.guard"
import {FileInterceptor} from '@nestjs/platform-express'
import {extname, join} from 'path'
import { readFile } from 'fs/promises';
import { Response } from 'express';
import * as mime from 'mime-types';
import * as path from 'path'

@Controller("users")
export class UsersController{
  constructor(private readonly UserService: UserService){}
  @UseGuards(AuthGuard)
  @Get("whoami")
  getCUser(@Req() req:Request) : any{
      return this.UserService.getCurrentUser(req)
  }
  @UseGuards(AuthGuard)
  @UseGuards(Elegible)
  @Post("update_img")
  @UseInterceptors(FileInterceptor('file', {
    dest: './uploads'
  }))
  async uploadFile(@Req()req: Request,@UploadedFile() file: Express.Multer.File, @Res()resp:Response) {
    const ret = await this.UserService.updateUserImage(req,file)
    if (ret.image){resp.status(201).send(ret)}
    else{resp.status(400).send(ret)}
  }
  @UseGuards(AuthGuard)
  @UseGuards(Elegible)
  @Get("getInfo/:username")
  getUser(@Req() req: Request, @Param() params:any) : any{
      return this.UserService.getUserProfileInfo(req,params.username)
  }
  @UseGuards(AuthGuard)
  @UseGuards(Elegible)
  @Get("check/:username")
  async checkUsername(@Req() req: Request, @Param("username") username:any, @Res() resp:Response){
      const ret = await this.UserService.checkUsername(req,username)
      if (ret.error){resp.status(403).send(ret)}
      else{resp.status(200).send(ret)}
  }
  @UseGuards(AuthGuard)
  @UseGuards(Elegible)
  @Put("update/:thing")
  async updateUser(@Req() req:Request, @Body() body:Body, @Param() params:any, @Res() resp:Response){
    let Updated = await this.UserService.updateUserWra(req, body,params.thing)
    if (Updated['error'] !== undefined){resp.status(400).send(Updated)}
    else{resp.status(200).send(Updated)}
  }
  @UseGuards(AuthGuard)
  @UseGuards(Elegible)
  @Get("search/:kw")
  filterUser(@Param() params:any) : any{
    return this.UserService.searchUser(params.kw);
  }
  @Get("images/:imagename")
  async serveImage(@Param('imagename') imagename: string, @Res() res: Response, @Headers() headers:any) {
    // Construct the path to the image file
    const imagePath = join(path.resolve(process.cwd()), 'uploads', imagename);
    const iMime = mime.lookup(imagePath)
    try{
      const image = await readFile(imagePath);
      res.set('Content-Type', iMime);
      res.send(image)
    }catch (error) {
      res.status(404).send('Not found');
    }
  }
  @Post("/change_ftime")
  async update_ftime(@Req() req:Request, @Res() response:Response){
    const ret = await this.UserService.update_ftime(req)
    if (ret.error){response.status(400).send(ret)}
    else{response.status(200).send(ret)}
  }
}