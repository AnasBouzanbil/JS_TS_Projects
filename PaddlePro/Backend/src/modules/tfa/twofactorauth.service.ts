import { Injectable } from "@nestjs/common";
import * as speakeasy from 'speakeasy';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

function generateSecret(): string {
    const secret = speakeasy.generateSecret({ length: 20 });
    return secret.base32;
}

function generateQRCodeURL(name: string, secret: string): string {
    let ret = speakeasy.otpauthURL({
        secret: secret,
        label: name,
        issuer: 'PaddlePro',
    });
    return ret
}

function verifyTOTP(token: string, secret: string): boolean {
    let ret = speakeasy.totp.verify({
        secret: secret,
        encoding: 'base32',
        token: token,
        window: 1,
    });
    return ret 
}
async function setSecretForUser(username:string, secret:string) {
    try{
        let user = await prisma.user.update({
            where:{
                username: username
            },
            data:{
                tfasecret:  secret,
            }
        })
    }catch(err){
        throw err
    }
    
}

@Injectable()
export class twoFactorService{
async enableTwoFactorAuth(req:Request) {
    try{
    const secret = generateSecret();
    const qrCodeURL = generateQRCodeURL(req['user']['username'], secret);
    const to_parse = new URL(qrCodeURL)
    await setSecretForUser(req['user']['username'], to_parse.searchParams.get('secret'))
    return { qrCodeURL };
    }
    catch(err){
        return {"error":"couldnt set user secret"}
    }
}
async verify(token:string, secret:string){
    return verifyTOTP(token, secret)
}
async disabletfa(req:Request){
    try{
    const user = await prisma.user.update({
        where:{username:req['user']['username']},
        data:{
            tfwactivated: false
        }
    })
    return {"success":"2fa has been disabled"}
    }catch(err){return {"error":"there has been an error disabling 2fa"}}
}

}