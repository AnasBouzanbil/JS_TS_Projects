import {Module} from '@nestjs/common'
import { FriendController } from './friends.controller'
import { FriendService } from './friends.service'
import { UserService } from '../users/users.service'

@Module({
    providers: [FriendService,UserService],
    controllers: [FriendController],
})
export class FriendModule{}