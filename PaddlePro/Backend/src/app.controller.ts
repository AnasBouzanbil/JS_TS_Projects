import { Controller, Get, Req, Post, ParamData, Param, Query,Res,UseGuards } from '@nestjs/common';
import { AppService,AlreadyExistException } from './app.service';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import {UserService} from './modules/users/users.service'
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

const prisma = new PrismaClient()

function getJwt(payload:string) {
  
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService,private jwtService: JwtService, private readonly userService: UserService) {}

  @Get()
  async getHello(@Req() Request: Request): Promise<any> {
    return this.appService.getHello(Request)
  }
  @Get("/auth/callback")
  async auth(@Req() Request: Request, @Query() query:any, @Res() response:Response){
    let resp:any;
    try{
      resp = await this.appService.getUserToken(Request, query)
      const payload = {id:resp.id, username:resp.username,eligible:!resp.tfwactivated};
      const jwttoken = await this.jwtService.signAsync(payload);
      const ftime = resp.ftime
      let data = {jwtToken:jwttoken}
      let newuser = await prisma.user.update({
        where: {
          username: resp['username'],
        },
        data: data,
        select: {
          id: true,
          username: true,
          real_name: true,
          bio: true,
          image: true,
          onlineStatus: true,
          tfwactivated: true,
      }})
      response.send({acces_token: jwttoken, isactivated:newuser.tfwactivated,iseligible:!resp.tfwactivated })
    }catch(err)
    {
      if (err instanceof AlreadyExistException){
        const user = await this.userService.getUserAccessToken(`${err.message}`)
        response.send({acces_token:user['jwtToken'], ftime:false})
      }
      else
      {
        response.status(401).send("Unauthorized")
      }
    }
  }
}

// @methode => to specify the method allowed 
// @httpCode(code) => decorator for specifying the return type of the req