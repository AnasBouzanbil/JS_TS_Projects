import { Module } from "@nestjs/common";
import { groupService } from "./groups.service";
import { groupController } from "./groups.controller";

@Module({
    providers: [groupService],
    controllers: [groupController]
})

export class groupModule{};