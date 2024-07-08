import { Module } from "@nestjs/common";
import { MessagesController } from "./message.controller";
import {MessagesService} from './message.service'

@Module({
    controllers: [MessagesController],
    providers: [MessagesService]
})

export class MessagesModule{}