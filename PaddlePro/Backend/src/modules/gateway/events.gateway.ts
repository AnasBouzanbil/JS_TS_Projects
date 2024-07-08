import { SubscribeMessage, MessageBody, ConnectedSocket, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io'
import { PrismaClient } from "@prisma/client";
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from "src/auth/constants";
import { ExceptionsHandler } from "@nestjs/core/exceptions/exceptions-handler";
import { stat } from "fs";
import { BadRequestException } from '@nestjs/common';


async function getUser(client: Socket, jwtService:JwtService) {
  try{
  const token = client.handshake.headers.authorization.replace('Bearer ', '');

  const payload = await jwtService.verifyAsync(
    token,
    {
      secret: jwtConstants.secret
    }
  );
  return payload.username
  }catch(err){
    throw err
  }
}

const prisma = new PrismaClient()

interface Message {
  roomId: string
  content: string
  sender: string
  receiver: string
}

async function getUserNotifications(username: string) {
  try {
    const notifs = await prisma.notifications.findMany({
      where: {
        reciepientUsername: username,
      },
    })
    return { "notifs": notifs }
  } catch (err) {
    return { "error": "couldn't fetch the user notifications" }
  }
}

export async function createNotification(req: Request, content: string, username: string) {
  try {
    const notification = await prisma.notifications.create({
      data: {
        content: content,
        reciepientUsername: username,
        senderUsername: req['user']['username'],
        type: "friend"
      }
    })
    return notification
  }
  catch (err) {
    throw err
  }
}
export async function destroyNotification(id: number) {
  try {
    const notification = await prisma.notifications.delete({
      where: {
        id: id
      }
    })
    return notification
  }
  catch (err) {
    throw err
  }
}

async function save_message(sender: string, message: any) {
  try {
    if (message['content'].length === 0){
      throw new ExceptionsHandler()
    }
    const check = await prisma.blocked.findFirst({
      where: { username: message['receiver']},
      select: { members: true }
    })
    if (check !== null &&  check.members.find((user) => user.username == sender) != undefined) {
      throw new BadRequestException()
    }
    const newMessage = await prisma.userMessage.create({
      data: {
        reciepient: {connect:{username: message['receiver']}},
        content: message['content'],
        sender: { connect: { username: sender } }, 
        Direct: { connect: { id: parseInt(message['roomId']) } }, 
        created_on: new Date(),
      }
    });
    return newMessage;
  } catch (error) {
    throw error;
  }
}

async function save_group_message(sender:string, message: any) {
  try {
    const newMessage = await prisma.groupMessages.create({
      data: {
        content: message['content'], 
        sender: { connect: { username: sender } },
        Group: { connect: { id: parseInt(message['roomId']) } }
      }
    });
    return newMessage;
  } catch (error) {
    throw error;
  }
}

async function updateLastSeen(username: string, status: boolean) {
  try {
    const isExist = await prisma.user.findFirst(({
      where:{
        username: username
      }
    }))
    if (isExist === null || isExist === undefined){return}
    const user = await prisma.user.update({
      where: {
        username: username
      },
      data: {
        onlineStatus: status,
        ...(status === false && { lastOnline: { set: new Date() } })
      }
    })
  } catch (err) {
    throw err
  }

}

async function updateSeenNotifs(username: string, dateTime: Date) {
  try {
    const notifs = await prisma.notifications.findMany({
      where: {
        reciepientUsername: username,
        created_on: {
          lt: dateTime
        }
      }
    })
    const newnotifs = await prisma.notifications.updateMany({
      where: {
        id: {
          in: notifs.map(notification => notification.id)
        }
      },
      data: {
        seen: true
      }
    })

  } catch (err) {
    throw err
  }

}

async function updateSeenMessage(username:string, directId:string, dateTime:Date){
  try {
    const messages = await prisma.userMessage.updateMany({
      where: {
        directId: parseInt(directId),
        reciepient_name:username
      },
      data:{
        seen: true,
      }
    })

  } catch (err) {
    throw err
  }
}

async function checkIsExist(message: any, username: string) {
  if (message.type === "dm") {
    try {
      const dm = await prisma.direct.findFirst({
        where: {
          id: parseInt(message.roomId),
          members: {
            some: {
              username: username
            }
          }
        }
      })
      if (dm == null) { throw new BadRequestException("You are not a member") }
      return true
    } catch (err) {
      throw err
    }
  }
  else {
    try {
      const gp = await prisma.group.findFirst({
        where: {
          id: parseInt(message.roomId),
          members: {
            some: {
              username: username
            }
          }
        }
      })
      if (gp == null) { throw new BadRequestException("You are not a member") }
      (`gp --- ${gp.id}`)
      return true
    } catch (err) {
      throw err
    }
  }
}

async function checkIsMutedGroup(roomId:any, username:string) {
  try{
    const group = await prisma.group.findFirst({
      where:{
        id: parseInt(roomId),
      },select:{
        muted: true
      }
    })
    if (group.muted.find((user)=>user.username === username) !== undefined){throw new BadRequestException("The User is muted")}
    return true
  }catch(err){
    throw err
  }
}

export const map = new Map();


@WebSocketGateway({
  cors: {
    origin: "*"
  }
})
export class NotificationsGateway {
  constructor(private readonly jwtService: JwtService) { }

  @WebSocketServer()
  server: Server;

  // WebSocket event handler
  @SubscribeMessage("connection")
  async handleConnection(@ConnectedSocket() client: Socket) {
    try {
      const token = client.handshake.headers.authorization.replace('Bearer ', '');
      if (token === "null"){throw new BadRequestException()}
      const payload = await this.jwtService.verifyAsync(
        token,
        {
          secret: jwtConstants.secret
        }
        );
        map.set(payload.username, client)
    } catch (err) {
    }
  }
  @SubscribeMessage("Online")
  async handleOnline(@ConnectedSocket() client: Socket) {
    
    try {
      const token = client.handshake.headers.authorization.replace('Bearer ', '');
      if (token === "null"){throw new BadRequestException()}
      const payload = await this.jwtService.verifyAsync(
        token,
        {
          secret: jwtConstants.secret
        }
      );
      updateLastSeen(payload.username, true)
      this.server.emit("Online", { username: payload.username })
    } catch (err) {
    }
  }

  @SubscribeMessage("disconnect")
  async handleDisconnect(@ConnectedSocket() client: Socket) {
    try {
      const token = client.handshake.headers.authorization.replace('Bearer ', '');
      if (token === "null"){throw new BadRequestException()}
      const payload = await this.jwtService.verifyAsync(
        token,
        {
          secret: jwtConstants.secret
        }
      );
      if (client.id === map.get(payload.username).id){map.delete(payload.username)}
      if (payload !== undefined && payload !== null){updateLastSeen(payload.username, false)}
      this.server.emit("Offline", { username: payload.username })
    } catch (err) {
    }
  }

  @SubscribeMessage("Notifications")
  async handleNotification(@ConnectedSocket() client: Socket, @MessageBody() message: string) {
    
    try {
      const token = client.handshake.headers.authorization.replace('Bearer ', '');
      if (token === "null"){throw new BadRequestException()}
      const payload = await this.jwtService.verifyAsync(
        token,
        {
          secret: jwtConstants.secret
        })
      const notifs = await getUserNotifications(payload.username)
      
      client.emit("Notifications", notifs)
      await updateSeenNotifs(payload.username, new Date())
    } catch (err) {
      client.emit('Notifications', { error: "you can not do this donnnnald" });
    }
  }
  @SubscribeMessage("Writting")
  async handleIsWritting(@ConnectedSocket() client: Socket, @MessageBody() message: any) {
    try {
      client.to(message.roomId.toString()).emit("Writting", { message: message })
    } catch (err) {
      client.to(message.roomId.toString()).emit("Writting", { error: "Error fetching who is writting" })
    }
  }
  @SubscribeMessage("Messages")
  async handleMessages(@ConnectedSocket() client: Socket, @MessageBody() message: any) {
    try {
      const token = client.handshake.headers.authorization.replace('Bearer ', '');
      if (token === "null"){throw new BadRequestException()}
      const payload = await this.jwtService.verifyAsync(
        token,
        {
          secret: jwtConstants.secret
        }
      );
      let msg = await save_message(payload.username, message)
      const receiverSocket = map.get(message['receiver'])
      if (receiverSocket){
        client.to(receiverSocket.id).emit("newMessages", {sender:payload.username})
      }
      client.to(message.roomId.toString()).emit("Messages", { message: message })
    } catch (err) {
      client.emit('Messages', { error: "you can not send a message" });
    }
  }
  @SubscribeMessage("MessagesNotif")
  async handleSeenMessages(@ConnectedSocket() client: Socket, @MessageBody() message: any) {
    try {
      const token = client.handshake.headers.authorization.replace('Bearer ', '');
      if (token === "null"){throw new BadRequestException()}
      const payload = await this.jwtService.verifyAsync(
        token,
        {
          secret: jwtConstants.secret
        }
      );
      client.emit('SeenMessages', { success: "messages seen have been updated" });
    } catch (err) {
      client.emit('SeenMessages', { error: "error update the seen in Usermessages" });
    }
  }
  @SubscribeMessage("joinRoom")
  async handleJoinRoom(@ConnectedSocket() client: Socket, @MessageBody() message: any) {
    try {
      const username = await getUser(client, this.jwtService);
      const isExist = await checkIsExist(message, username)
      client.join(message.roomId.toString())
      let updated = await updateSeenMessage(username, message.roomId.toString(),new Date())
      client.emit('joinRoom', {message:message})
    } catch (err) {
      client.emit('joinRoom', { error: "you can not join this room" });
    }
  }
  @SubscribeMessage("seenRightAway")
  async seenRightAway(@ConnectedSocket() client: Socket, @MessageBody() message: any) {
    try {
      const username = await getUser(client, this.jwtService);
      const isExist = await checkIsExist(message, username)
      let updated = await updateSeenMessage(username, message.roomId.toString(),new Date())
      client.emit('seenRightAway', {"success":"Seen messages setted"})
    } catch (err) {
      client.emit('seenRightAway', {"error":"error setting messages seen"});
    }
  }
  @SubscribeMessage("leaveRoom")
  async handleLeaveRoom(@ConnectedSocket() client: Socket, @MessageBody() room: any) {

    try {
      client.leave(room)
      client.emit('leaveRoom', room)
    } catch (err) {
      client.emit('leaveRoom', { error: "you can not join this donnnnald" });
    }
  }
  @SubscribeMessage("GroupMessages")
  async handleGroupMessages(@ConnectedSocket() client: Socket, @MessageBody() message: any) {
    let isAuth = false;
    try {
      const token = client.handshake.headers.authorization.replace('Bearer ', '');
      if (token === "null"){throw new BadRequestException()}
      const payload = await this.jwtService.verifyAsync(
        token,
        {
          secret: jwtConstants.secret
        }
      );
      isAuth = true
      if (message['sender'] !== payload.username) { throw new ExceptionsHandler() }
      const isExist = await checkIsExist(message, payload.username)
      const isBanned = await checkIsMutedGroup(message.roomId, payload.username)
      let msg = await save_group_message(payload.username,message)
      client.to(message.roomId.toString()).emit("GroupMessages", { message: message })
    } catch (err) {
      if (isAuth === false){
        client.emit('GroupMessages', { error: "You are not authenticated user" });  
      }
      client.emit('GroupMessages', { error: err });
    }
  }
}
