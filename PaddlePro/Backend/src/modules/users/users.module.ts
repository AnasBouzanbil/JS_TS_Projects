import {Module} from '@nestjs/common'
import {UsersController} from './users.controller'
import {AppService} from '../../app.service'
import {UserService} from './users.service'
import { Repository } from 'typeorm';


@Module({
    providers: [UserService],
    controllers: [UsersController],
})
export class UserModule{}