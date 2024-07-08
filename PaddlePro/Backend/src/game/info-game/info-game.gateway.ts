
import { SubscribeMessage, WebSocketGateway, WebSocketServer, MessageBody, ConnectedSocket, OnGatewayConnection } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import {GameService} from '../game-service/game-service.service';
import { subscribe } from 'diagnostics_channel';




@WebSocketGateway({
  cors:{
    origin: "*"
  }
})
export class InfoGameGateway {
  waitingQueue: any[] = [];
  constructor(private gameService: GameService) {}
  @WebSocketServer()
  server: Server;
  
  async handleDisconnect(client: Socket) {
    this.gameService.Handle_diconnect(client.id);
  }
  @SubscribeMessage('StartingGame')
   handleStartingGame(@MessageBody() data: any, @ConnectedSocket() client: Socket): void {
    this.gameService.handleNewGameConnection(client, data, this.server);
  }
  @SubscribeMessage('PlayerLeavesinInviate')
  handlePlayerLeavesinInviate(@MessageBody() data: any, @ConnectedSocket() client: Socket): void {
    this.gameService.HandlePlayerLeavesinInviate(data, client.id);
  }
  @SubscribeMessage('getGameResult')
  handleGetGameResult(@ConnectedSocket() client: Socket, @MessageBody() data: any): void {
    this.gameService.HandleFinalResult(client, data);
  }
  @SubscribeMessage('PaddleMovesUp')
   handlePaddleMovesUp(@MessageBody() data: any, @ConnectedSocket() client: Socket): void {
    this.gameService.MovePaddleUp(data, client.id);
  }
  @SubscribeMessage('PaddleMovesDown')
   handlePaddleMovesDown(@MessageBody() data: any, @ConnectedSocket() client: Socket): void { 
    this.gameService.MovePaddleDown(data ,client.id);
    }

    @SubscribeMessage('PlayerLeaves')
    handlePlayerLeaves(@MessageBody() data: any, @ConnectedSocket() client: Socket): void {
      this.gameService.HandlePlayerLeaves(data, client.id);
    }
    @SubscribeMessage('PlayerLeaves2')
    handlePlayerLeaves2(@MessageBody() data: any, @ConnectedSocket() client: Socket): void {
      this.gameService.HandlePlayerLeaves2(data, client.id);
    }
    @SubscribeMessage('RemoveData')
    handleRemoveData(@MessageBody() data: any): void {
      this.gameService.HandleRemoveData(data);
    }
    @SubscribeMessage('MoveBall')
    handleMoveBall(@MessageBody() data: any, @ConnectedSocket() client: Socket): void {
      this.gameService.Handleupdatetheball(data, client.id);
    }
    @SubscribeMessage('inviteFriendToGame')
    handleInviteFriendToGame(@MessageBody() data: any, @ConnectedSocket() client: Socket): void {
      this.gameService.HandleInviteFriendToGame(data, client);
    }
    @SubscribeMessage('AcceptGameInvite')
    handleAcceptGameInvite(@MessageBody() data: any, @ConnectedSocket() client: Socket): void {
      this.gameService.HandleInvitaitonAccepted(data, client, this.server);
    }
    @SubscribeMessage('NoAccept')
    handleNoAccept(@MessageBody() data: any, @ConnectedSocket() client :Socket) {
      this.gameService.handleNoAccept(data, client);
    }
}  








