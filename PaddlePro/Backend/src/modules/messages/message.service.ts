import { Injectable } from "@nestjs/common";
import { ExceptionsHandler } from "@nestjs/core/exceptions/exceptions-handler";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

@Injectable()
export class MessagesService{
    async getMessages(req: Request, roomId:number)
    {
        const user = req['user']
        try
        {
            let isExist = false;
            const direct = await prisma.direct.findFirst({
                where:{
                    id: roomId
                },
                select:{
                    members: true,
                }
            })
            direct.members.forEach((member)=>{
                if (member.username === user['username'])
                {
                    isExist = true;
                }
            })
            if (!isExist)
            {
                throw new ExceptionsHandler()
            }
            const messages = await prisma.userMessage.findMany({
                where:{
                    directId: roomId
                },
                select:{
                    id: true,
                    sender_name: true,
                    reciepient_name: true,
                    content:true,
                    created_on: true,
                    seen: true
                },
                orderBy:{
                    id: 'asc'
                }
            })
            return {"messages":messages}
        }catch(err)
        {
            return {"error":"Couldn't fetch the old messages"}
        }
    }
    async deleteMessage(messageid:number)
    {
        try{
            const message = await prisma.userMessage.delete({
                where:{
                    id: messageid
                }
            })
            return {"success":"message deleted successfully"}
        }catch(err){
            return {"error":"there has been an error deleting the message"}
        }
    }
}