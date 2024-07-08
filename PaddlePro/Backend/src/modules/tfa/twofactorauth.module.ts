import { Module } from "@nestjs/common";
import { twoFactorService } from "./twofactorauth.service";
import { twoFactorController } from "./twofactorauth.controller";

@Module({
    controllers:[twoFactorController],
    providers:[twoFactorService]
})

export class twoFactorModule{};