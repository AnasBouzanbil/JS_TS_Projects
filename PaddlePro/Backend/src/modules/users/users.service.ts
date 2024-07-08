import { Injectable, Req,ForbiddenException, UnauthorizedException, UploadedFile, BadRequestException} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import {JwtService} from '@nestjs/jwt'
import * as fs from 'fs'
import {extname} from 'path'
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';
import { map } from '../gateway/events.gateway';

const prisma = new PrismaClient()

function extractTokenFromHeader(request: Request): string | undefined {
  const [type, token] = request.headers['authorization']?.split(' ') ?? [];
  return type === 'Bearer' ? token : undefined;
}

async function get_user_data(req: Request, username:string) : Promise<any> {
  try{
    let ret:any;
    ret = await prisma.user.findFirst({
      where: {
        "username":username
      },
      select: {
        // id: true,
        username: true,
        real_name: true,
        achievement: true,
        level: true,
        bio: true,
        image: true,
        ftime: true,
        tfwactivated: true,
        win: true,
        lose: true,
        inGame:true
      }})
    if (ret == null)
      return {"error":"No user with the provided username"}
    ret['eligible'] = req['user']['eligible']
    const newus = await prisma.user.update({
      where:{
        username:username
      },
      data:{
        ftime: false
      }
    })
    return ret
  }catch(err){
    return {"error":"No user with the provided username"}
  }
  }
  


@Injectable()
export class UserService{ 
  constructor(private jwtService: JwtService){}
    async getUserProfileInfo(req: Request, username:string): Promise<any[]>{
        let user_info = await get_user_data(req,username)
        return user_info
      }
    // async createNewUser(real_name: string, username: string) {
    // const newUser = prisma.user.create({
    //   data:
    //   {
    //     real_name: real_name,
    //     username: username,
    //     apiToken: '',
    //   }
    // })
    // return newUser;
    // }
    async getUserAccessToken(username:string)
    {
      let ret:any;
      ret = await prisma.user.findFirst({
        where: {
          username:username,
        },
        select: {
          jwtToken: true
      }})
      return ret
    }
    async updateUser(user:any, body: Body,thing:String) {
      let data:any = {}
      if (thing === "bio"){data.bio = body['bio']}
      else {
        if (! /^[a-zA-Z0-9]+$/.test(body['username']) || body['username'].length > 15 || body['username'].length < 1){throw new BadRequestException("Couldnt't update the username")}
        data.username = body['username']
      }
      const newUser = await prisma.user.update({
        where: {
          username: user['username'],
        },
        data: data,
        select: {
          id: true,
          username: true,
          real_name: true,
          bio: true,
          image: true,
          onlineStatus: true,
      }})
      if (thing === "username" && body['username'] !== undefined)
      {
        const payload = {id:newUser.id, username:newUser.username,eligible:true}; 
        const token = await this.jwtService.signAsync(payload);
        const socket = map.get(user['username']);
        
        map.delete(user['username']);
        
        map.set(newUser.username, socket);
        
        return token;
      }
      return "";
      }
    async getCurrentUser(req: Request){
        try {
          const user = await this.getUserProfileInfo(req, req['user']['username'])
          return user
        } catch(error) {
          throw new UnauthorizedException()
        }
    }
    async updateUserWra(req: Request, body:Body, thing: String){
      try{
        if (thing !== "bio" && thing !== "username"){throw new BadRequestException()}
        let user = await this.getCurrentUser(req)
        let updateUser = await this.updateUser(user,body,thing)
        return updateUser
      }
      catch(err)
      {
        return {error: "Could not update user"}
      }
      
    }
    async updateUserImage(req: Request,@UploadedFile() file: Express.Multer.File)
    {
      let currentUser:any;
      try{
        currentUser = await this.getCurrentUser(req)
      }catch(err)
      {
        return {status:'error', message: 'User is not permitted to do this action'};
      }
      const fileExtension = extname(file.originalname);
      const newFileName = `${file.filename}${fileExtension}`;
      const newPath = `./uploads/${newFileName}`;
      try {
        fs.renameSync(file.path, newPath);
        const newUser = await prisma.user.update({
          where: {
            username: currentUser['username'],
          },
          data: {
            image: `http://127.0.0.1:4000/users/images/${newFileName}`,
          },
          select: {
            id: true,
            username: true,
            real_name: true,
            bio: true,
            image: true,
            onlineStatus: true
        }})
        return {status:'success',image:newUser.image};
      } catch (error) {
        return {status:'error', message: 'There has been an error uploading your image'};
      }
    }
    async searchUser(kw:string): Promise<any>{
      const users = await prisma.user.findMany({
        where:{
          username:{
            mode: 'insensitive',
            contains: kw
          }
        },
        select:{
            username: true,
            image: true
        }
      })
      return users
    }
    async checkUsername(req:Request, username:string){
      try{
        if (! /^[a-zA-Z0-9]+$/.test(username)){
          throw new BadRequestException("Check the characters")
        }
        const user = await prisma.user.findFirst({
          where:{
            username: username
          }
        })
        if (user !== null && user.username!==req['user']['username']){throw new BadRequestException("User already exist")}
        return {"success":"the username is valid"}
    }catch(err){
      return {"error":err.message}
    }
    }
  async update_ftime(req:Request){
    try{
      const newuser = await prisma.user.update({
        where:{
          username:req['user']['username']
        },
        data:{
          ftime: false
        }
      })
     return {success:"changed"}
    }catch(err){
      return {error:"unchanged"}
    }
  }
}