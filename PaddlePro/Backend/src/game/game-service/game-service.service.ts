import { Injectable } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway, WebSocketServer, MessageBody } from '@nestjs/websockets';
import { Prisma, PrismaClient } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { get } from 'http';
import { userInfo } from 'os';
import { Server } from 'socket.io'; 

var prisma = new PrismaClient();

class GameObj{
	canvas : any;
	id : string = '';
	istherePlayerOne : boolean = false;
	istherePlayerTwo : boolean = false;
	userOne : any;
	userTwo : any;
	ball : any;
	GameInfo : any;
	Guests : any[] = []; 
	isthereGuest : boolean = false;
	server : Server;
	interval : any = undefined;
	RoomPrivate : boolean = false;
	playerone : boolean = false;
	color : any;
	playertwo : boolean = false;
	constructor(server : Server, canvasheight : number, canvaswidth : number , id : string, useroneInfo : any, usertwoInfo : any)
	{
		this.id = id;
		this.canvas = {
			height : canvasheight,
			width : canvaswidth
		}
		this.userOne={
			x : this.canvas.width - 20,
			y : this.canvas.height / 2 - 50,
			width : 10,
			height : 100,
			sccore : 0,
			PLayerOneComesToUpdate : false,
			keypress: {},
			exited : false,
			socket : useroneInfo.socket,
			pic : useroneInfo.image,
			username : useroneInfo.username
		};
		this.userTwo={
			x : 10,
			y : this.canvas.height / 2 - 50,
			width : 10,
			height : 100,
			keypress: {}, 
			sccore : 0,
			exited : false,
			PLayerOneComesToUpdate : false,
			socket : usertwoInfo.socket,
			pic : usertwoInfo.image,
			username : usertwoInfo.username
		};
		this.ball = { 
			x :  this.canvas.width / 2,
			y : this.canvas.height / 2,   
			velocityX : 3,
			velocityY : 0,
			XvelOriginal : 3,
			YvelOriginal : 0,
			speed : 2,
			radius : 10,
			canvas : {height : 0, width : 0}
		}
		this.GameInfo = {
			one : 0,
			two : 0,
			level : 0,
			WhiWon : ''
		};
		this.server = server;
	}
	collisionDetect(ball : any, player : any)
	{
		player.top = player.y;
		player.bottom = player.y + player.height; 
		player.left = player.x;
		player.right = player.x + player.width;
		ball.top = ball.y - ball.radius;
		ball.bottom = ball.y + ball.radius; 
		ball.right = ball.x + ball.radius;
		ball.left = ball.x - ball.radius;
		return ball.right > player.left && ball.bottom > player.top && ball.left < player.right && ball.top < player.bottom;
	}
	resetBall()
	{
		this.ball.x = this.canvas.width / 2;
		this.ball.y = this.canvas.height / 2;
		this.GameInfo.level = this.GameInfo.level + 1;
		this.ball.speed = 3;
		this.server.to(this.id).emit('GameStatus', {one : this.userOne.sccore, two : this.userTwo.sccore, level : this.GameInfo.level, usernameOne : this.userOne.username, usernameTwo : this.userTwo.username});
	}
	addNewGuest = (socket : any) => {
		socket.join(this.id);
	}
	removeGuest = (socket : any) => {
		socket.leave(this.id);
	}



	updateBallPosition() {
		this.ball.x += this.ball.velocityX;
		this.ball.y += this.ball.velocityY;
	}
	checkBallCollisionWithCanvas() {
		if (this.ball.y + this.ball.radius > this.canvas.height || this.ball.y - this.ball.radius < 0)
			this.ball.velocityY = -this.ball.velocityY;
	}
	updatePlayerBasedOnBallPosition() {
		return (this.ball.x < this.canvas.width / 2) ? this.userTwo : this.userOne;
	}
	updateBallVelocityOnCollision(player) {
			let collidePoint = (this.ball.y - (player.y + player.height/2));
			collidePoint = collidePoint / (player.height/2);
			let angleRad = (Math.PI/4) * collidePoint;
			let direction = (this.ball.x + this.ball.radius < this.canvas.width/2) ? 1 : -1;
			this.ball.velocityX = direction * this.ball.speed * Math.cos(angleRad);
			this.ball.velocityY = direction * this.ball.speed * Math.sin(angleRad);
			this.ball.speed += 0.5;
			if (this.ball.speed > 7)
				this.ball.speed = 7;
	}
	updateScoreAndResetBall(player, score) {
		this.GameInfo[score] += 1;
		player.sccore += 1;
		this.ball.velocityX = this.ball.XvelOriginal + 0.3;
		this.ball.velocityY = this.ball.YvelOriginal + 0.3;
		this.resetBall();
	}
	updatePlayerPosition(player, direction) {
		player.y += direction * 5;
		player.y = Math.max(0, Math.min(player. y, this.canvas.height - player.height));
	}



	emitGameData() {
		this.server.to(this.id).emit('data', {
			userOneY: this.userOne.y,
			userTwoY: this.userTwo.y,
			ballX: this.ball.x,
			ballY: this.ball.y,
			Level: this.GameInfo.level,
		});
		this.server.to(this.id).emit('UsersPic',
			{one: this.userOne.pic, two: this.userTwo.pic}
		);
	}

	async checkGameEnd() {
		if (this.GameInfo.level == 5) {
			clearInterval(this.interval);
			await this.updatethedb();
			this.server.to(this.id).emit('EndGame');
		}
	}
	handlePlayermoves(Player : any)
	{
		if (Player.keypress['ArrowUp'])
		Player.y -= 8;
		if (Player.keypress['ArrowDown'])
			Player.y += 8;
		if (Player.y < 0)
			Player.y = 0;
		if (Player.y > (this.canvas.height - Player.height))
			Player.y = this.canvas.height - Player.height;
	
	}
	updateTheBall() { 
		this.updateBallPosition();
		this.checkBallCollisionWithCanvas();
		let player = this.updatePlayerBasedOnBallPosition();

		if (this.collisionDetect(this.ball, player)) {
			this.updateBallVelocityOnCollision(player);
		}

		if (this.ball.x - this.ball.radius < 0) {
			this.updateScoreAndResetBall(this.userOne, 'one');
		}
		if (this.ball.x + this.ball.radius > this.canvas.width) {
			this.updateScoreAndResetBall(this.userTwo, 'two');
		}
		this.handlePlayermoves(this.userOne);
		this.handlePlayermoves(this.userTwo);
		this.emitGameData();
		this.checkGameEnd();
	}
	async gameloop()
	{
		this.interval = setInterval(() => {
			this.updateTheBall();
		}, 16 );
	}
	Handleupdatetheball(sockerid : any)
	{
		if (this.userOne.socket.id == sockerid)
		{
			this.userOne.PLayerOneComesToUpdate = true;
		}
		if (this.userTwo.socket.id == sockerid)
		{
			this.userTwo.PLayerOneComesToUpdate = true;
		}
		if (this.userOne.PLayerOneComesToUpdate == true && this.userTwo.PLayerOneComesToUpdate == true)
		{
			this.updateTheBall();
			this.userOne.PLayerOneComesToUpdate = false;
			this.userTwo.PLayerOneComesToUpdate = false;
		}

	}
	async updateachivment(username : string, achievement : string)
	{
		await prisma.user.update({
			where : {
				username : username
			},
			data : {
				achievement : {
					set : achievement
				}
			}
		});
	}
	async checkWichAchivment(uusername : string, loser : string)
	{
		var random = Math.random() * (0.5 - 0.3) + 0.3;
		const achivment = await prisma.user.update({
				where : {
					username : uusername
				},
				data : {
					level : {
						increment : random,
					},
					win : {
						increment : 1
					},
					inGame:false
				},
				select : {
					win:true
				}
		});
		await prisma.user.update({
			where : {
				username : loser
			},
			data : {
				level : {
					increment : 0.01,
				},
				lose :
				{
					increment : 1
				},
				inGame: false
			}
		});
		const matches  : any  = achivment.win;
		if (matches == 5)
		{
			this.updateachivment(uusername, 'Silver');
		}
		else if (matches == 10)
		{
			this.updateachivment(uusername, 'Gold');
		}
		else if (matches == 15)
		{
			this.updateachivment(uusername, 'Platinum');
		}
		else if (matches == 20)
		{
			this.updateachivment(uusername, 'Diamond');
		}
	}
	
	async updatethedb()
	{
		await prisma.game.update({
			where : {
				id : this.id
			},
			data : {
				playerOScore : this.GameInfo.one,
				playerTScore : this.GameInfo.two,
			}
		});
		if (this.userOne.sccore > this.userTwo.sccore)
		{
			try {
				await this.checkWichAchivment(this.userOne.username , this.userTwo.username);
			}
			catch (error) {
				console.log(error);
			}
		}
		else  if (this.userOne.sccore < this.userTwo.sccore)
		{
			try {
				await this.checkWichAchivment(this.userTwo.username , this.userOne.username);
			}
			catch (error) {
				console.log(error);
			}
		}
	}
	async handleKeyDown(data : any, socket : any) {
		if (this.userOne.socket.id == socket)
			this.userOne.keypress[data.id] = true;
		if (this.userTwo.socket.id == socket)
			this.userTwo.keypress[data.id] = true;
	}
	async handleKeyUp(data : any, socket : any) {
		if (this.userOne.socket.id == socket)
			this.userOne.keypress[data.id] = false;
		if (this.userTwo.socket.id == socket)
			this.userTwo.keypress[data.id] = false;
	}


	handleExitUnexpectedly = async (socket : any) => {	
		if (this.userOne.socket.id == socket)
		{
			console.log('User One Exited');
			this.GameInfo.one = 0;
			this.GameInfo.two = 5;
			this.userOne.sccore = 0;
			this.userTwo.sccore = 5;
		}
		if (this.userTwo.socket.id == socket)
		{
			console.log('User Two Exited');
			this.GameInfo.two = 0;
			this.GameInfo.one = 5;
			this.userOne.sccore = 5;
			this.userTwo.sccore = 0;
		}
		await this.updatethedb();
		clearInterval(this.interval);
		this.server.to(this.id).emit('EndGame');
	}
	istherePlayer = (username : string) => {
		if (this.userOne.username == username || this.userTwo.username == username)
			return true;
		return false;
	}
	leaversFromRoom(){
		this.userOne.socket.leave(this.id);
		this.userTwo.socket.leave(this.id);
	}
}



@Injectable()
export class GameService {
	playerOneScore: number = 0;
	playerTwoScore: number = 0;
	Level : number  = 0;
	PaddleOne : number = 0;
	PaddleTwo : number = 0;
	games: Map<any, GameObj> = new Map();
	GamesQueue : any[] = [];
	InvitationQueue : any[] = [];
	trackingIndex : number = 0;
	prisma = new PrismaClient();

	checkIfuserinInvitationQueue(client : string) : number{
		for (let i = 0; i < this.InvitationQueue.length; i++) {
			if (this.InvitationQueue[i].senderSocket.id == client)
			{
				this.InvitationQueue.splice(i, 1);
				return 0;
			}
		}
		return 1;
	}

	CheckifuserinGamesQueue(client : string) : number {
		for (let i = 0; i < this.GamesQueue.length; i++) {
			if (this.GamesQueue[i].socket.id == client)
			{
				this.GamesQueue.splice(i, 1);
				return 0;
			}
		}
		return 1;
	}
	checkifTheUserIsInGameandRemoveit(client : string) : number {
		for (let [key, value] of this.games) {
			if (value.userOne.socket.id == client || value.userTwo.socket.id == client)
			{
				value.handleExitUnexpectedly(client);
				this.games.delete(key);
				return 0;
			}
		}
		return 1;
	}
	Handle_diconnect(client : string) {
		if (this.checkIfuserinInvitationQueue(client) == 0)
		{
			console.log('User was in the invitation queue');
			return;

		}
		if (this.CheckifuserinGamesQueue(client) == 0)
		{
			console.log('User was in the queue');
			return;

		}
		if (this.checkifTheUserIsInGameandRemoveit(client) == 0)
			{
				console.log('User was in the game');
				return;
	
			}
}
	checkifTheUserIsInGame(username : string, usernameTwo : string) {
		for (let [key, value] of this.games) {
			if (value.istherePlayer(username) == true || value.istherePlayer(usernameTwo) == true)
			{
				return true;
			}
		}
		return false;
	}
	HandleInviteFriendToGame(data : any, client : any) {
		if (this.checkifTheUserIsInGame(data.sender, data.receiver) == true)
		{
			client.emit('NotAbleToPlay', {message : 'You are already in a game, SOmething went wrong'});
			return;
		}
		this.InvitationQueue.push({sender : data.sender, receiver : data.receiver, senderSocket : client});
	}
	HandlePlayerLeavesinInviate(data : any, client : any) {
		for (let i = 0; i < this.InvitationQueue.length; i++) {
			if (this.InvitationQueue[i].sender == data.username)
			{
				this.InvitationQueue.splice(i, 1);
				return;
			}
		}
	}
	async handleNoAccept(data : any , client : any)
	{
		for (let i = 0; i < this.InvitationQueue.length; i++) {
			if (this.InvitationQueue[i].sender == data.sender && this.InvitationQueue[i].receiver == data.receiver) {	
				this.InvitationQueue[i].senderSocket.emit('leaveNow');
				this.InvitationQueue.splice(i, 1);
				return;
			}
		}		
	}
	async HandleInvitaitonAccepted(data : any, client : any, server : any) {
		for (let i = 0; i < this.InvitationQueue.length; i++) {
			if (this.InvitationQueue[i].sender == data.sender && this.InvitationQueue[i].receiver == data.receiver) {
				let userOneData: any = await this.GetUserInfo(data.sender);
				let userTwoData  : any = await this.GetUserInfo(data.recipient);
				userOneData.socket = this.InvitationQueue[i].senderSocket;
				userTwoData.socket = client;
				
				this.startGame(server, userOneData, userTwoData);
				this.InvitationQueue.splice(i, 1);
				return;
			}
		}
		client.emit('NotAbleToPlay', {message : 'Something went wrong, Please try again'});
	}
	async GetUserInfo(username : string)  {
		const user = await this.prisma.user.findFirst({
			where: {
				username: username
			},
			select:{
				username: true,
				image: true
			}
		});
		if (user == null)
			return null;
		return user;
	}
	CheckUserInQueue(username : string) {
		for (let i = 0; i < this.GamesQueue.length; i++)
		{
			if (this.GamesQueue[i].username == username)
			{
				this.GamesQueue.splice(i, 1);
	 			return true;
	 		}
		}
		return false;
	}
	checkuserIfInQueueWIthSocket(socket : any) {
		for (let i = 0; i < this.GamesQueue.length; i++)
		{
			if (this.GamesQueue[i].socket == socket)
			{
				this.GamesQueue.splice(i, 1);
	 			return true;
	 		}
		}
		return false;
	}
	HandlePlayerLeaves2(data : any, client : any) {
 		if (this.CheckUserInQueue(data.username) == true)
			return;
		if (this.games.has(data.token))
		{
			this.games.get(data.token).handleExitUnexpectedly(client);
 			this.games.delete(data);
 		}
	}
	async HandleRemoveData(token : any) {
		if (this.games.has(token))
		{
			this.games.delete(token);
		}
	}
	async HandlePlayerLeaves(data : any, client : any) {
	    if (this.games.has(data))
	    {
		   this.games.get(data).handleExitUnexpectedly(client);
			this.games.delete(data);
		}
   }
   async setGameOnline(username : string)
   {
	   await prisma.user.update({
		   where : {
			   username : username
		   },
		   data : {
			   inGame : true
		   }
	   });
   }
   async getIdAndCreateGame(useroneData : any, usertwoData : any) {
		var token : any;
		token = await prisma.game.create({
			data : {
				playerOScore : 0,
				playerTScore : 0,
				playerOUsername : useroneData.username,
				playerTUsername : usertwoData.username,
				PlayerOImage : useroneData.image,
				PlayerTImage : usertwoData.image
			},
			select : {
				id : true
			}
		});
		return token;
	}

	async startGame(server: Server, useroneData: any, usertwoData: any) {
		var token  : any;
		if (useroneData.username == usertwoData.username || useroneData.socket.id == usertwoData.socket.id)
		{
			useroneData.socket.emit('NotAbleToPlay');
			return ;
		}
		try {
			token = await this.getIdAndCreateGame(useroneData, usertwoData);
			await this.setGameOnline(useroneData.username);
			await this.setGameOnline(usertwoData.username);
		}
		catch (error) {
			useroneData.socket.emit('NotAbleToPlay');
			usertwoData.socket.emit('NotAbleToPlay');
		}
		useroneData.socket.join(token.id);
		usertwoData.socket.join(token.id);
		server.to(token.id).emit('GameStarted', token.id);
		const game = new GameObj(server, 500, 800,  token.id, useroneData, usertwoData);
		this.games.set(token.id, game);
		this.games.get(token.id).gameloop();
	}
	async MovePaddleUp(data : any, socket : any) {
		if (!this.games.has(data.token))
			return;
		await this.games.get(data.token).handleKeyUp(data, socket);
	}

	async MovePaddleDown(data : any, client : any) {
		if (!this.games.has(data.token)) 
			return;
		await this.games.get(data.token).handleKeyDown(data, client);
	}
	async Handleupdatetheball(data : any, client : any) {
		if (!this.games.has(data))
			return;
		this.games.get(data).Handleupdatetheball(client);
	}
	async HandleExitUnexpectedly(client : any) {
		for (let [key, value] of this.games) {
			if (value.userOne.socket.id == client || value.userTwo.socket.id == client)
			{
				value.handleExitUnexpectedly(client);
			}
		}
 
	}
	async HandleFinalResult(client : any, token : any) {
		try {
			if (token.token == undefined)
				return;
			const gameresult  =  await this.prisma.game.findFirst({
				where : {
					id : token.token
			 	},
				select:{
					playerOScore : true,
					playerTScore : true,
					playerOUsername : true,
					playerTUsername : true,
					PlayerOImage : true,
					PlayerTImage : true,
				}
			});
			if (!gameresult)
				return;
			client.emit('GameResult', gameresult);
		} catch (error) {
			console.log(error);
			client.emit('GameResult', {message : 'Sorry, Something went wrong!'});
		}
	}

	checksIfTheUserIsInGame(username : string) {
		for (let [key, value] of this.games) {
			if (value.istherePlayer(username) == true)
	 		{
				return true;
			}
		}
		return false;
	}
	checksIfTheUserIsInQueue(username : string) {
		for (let i = 0; i < this.GamesQueue.length; i++)
		{
			if (this.GamesQueue[i].username == username)
			{
				return true;
			}
		}
		return false;
	}
	async handleNewGameConnection(socket : any, Userinfo : any, server : Server) {
		if (this.checksIfTheUserIsInGame(Userinfo.username) == true || this.checksIfTheUserIsInQueue(Userinfo.username) == true)
		{
			socket.emit('NotAbleToPlay', {message : 'You are already in a game or in the queue'});
			return;
		}
		this.GamesQueue.push({username : Userinfo.username, socket : socket, image : Userinfo.image});
		if (this.GamesQueue.length >= 2)
		{
			const playerOne = this.GamesQueue.shift();
			const playerTwo = this.GamesQueue.shift();
			this.startGame(server, playerOne, playerTwo);
		}
	}
}
