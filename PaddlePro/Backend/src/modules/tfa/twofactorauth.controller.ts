import { Controller, UseGuards,Get, Res,Post,Put, Req, Body } from "@nestjs/common";
import { AuthGuard } from "src/auth/auth.guard";
import { twoFactorService } from "./twofactorauth.service";
import { PrismaClient } from "@prisma/client";
import { Response } from "express";
import { JwtService } from "@nestjs/jwt";

const prisma = new PrismaClient()

async function getSecret(username:string) {
    try{
    let user = await prisma.user.findFirst({
        where:{
            username: username
        }
    })
    return user.tfasecret
}catch(err){
    throw err
}
}
async function updateELe(username:string) {
    try{
    let user = await prisma.user.update({
        where:{
            username: username
        },
        data:{
            tfwactivated: true,
        }
    })
    return true
}catch(err){
    throw err
}
}

@UseGuards(AuthGuard)
@Controller("2fa")
export class twoFactorController{
    constructor (private readonly twoFactorService:twoFactorService, private jwtService:JwtService){}
    @Get("")
    async tfaroot(){
        return "succedded"
    }
    @Get("enable")
    async enabletfa(@Req() req:Request){
        return this.twoFactorService.enableTwoFactorAuth(req)
    }
    @Post("verify")
    async verify(@Req() req:Request, @Body() loginData:any, @Res() resp:Response) {
        try{
        let secret = await getSecret(req['user']['username'])
        const { token } = loginData;
        const isTokenValid = await this.twoFactorService.verify(token, secret);
        if (isTokenValid) {

            await updateELe(req['user']['username'])
            const { exp, ...userWithoutExp } = req['user'];
            const newClaims = {
                ...userWithoutExp,
                eligible : true,
            }
            const newToken = await this.jwtService.signAsync(newClaims)
            resp.status(200).send({"access_token":newToken})
        } else {
            resp.status(400).send({"error":"user is not authenticated !!"})
        }
        }catch(err){
            resp.status(400).send({"error":"user is not authenticated !"})
        }
    }
    @Post("disable")
    async disabletfa(@Req() req:Request, @Res() resp:Response) {
        const ret = await this.twoFactorService.disabletfa(req);
        if (ret.error){
            resp.status(400).send(ret)}
        else{resp.status(200).send(ret)}
    }
}