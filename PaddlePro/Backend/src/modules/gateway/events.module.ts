import { Module } from '@nestjs/common';
import {NotificationsGateway} from './events.gateway'

@Module({
  controllers: [],
  providers: [NotificationsGateway],
})
export class NotificationsGatewayModule {}