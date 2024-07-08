
import React, { useState, useEffect, useRef } from "react";
import './Style_Files/Style.css';
import { useNavigate } from "react-router-dom";




function movingTheBall(Ball : any)
{
	Ball.x += Ball.velocityX;
	Ball.y += Ball.velocityY;
	if (Ball.y + Ball.radius > Ball.canvas.height || Ball.y - Ball.radius < 0)
	Ball.velocityY = -Ball.velocityY;
}


function Ai_player(Ball : any, player : any)
{
	let computerLevel = 0.1;
	player.y += (Ball.y - (player.y + player.height / 2)) * computerLevel;
	
}


function collision(ball : any, player : any)
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

class GamePong{
	canvas : HTMLCanvasElement;
	navigate : any;
	ctx : CanvasRenderingContext2D | null;
	userOne : any;
	userTwo : any;
	ball : any;
	GameInfo : any;
	ketpress : {[key: string]: boolean} = {};
	constructor(canvas : HTMLCanvasElement , navigate : any)
	{
		this.navigate = navigate;
		this.canvas = canvas;
		this.ctx = canvas.getContext('2d');
		if (this.ctx === undefined)
		return;
	this.userOne={
		x:  this.canvas.width - 20,
		y:  this.canvas.height / 2 - 50,
		width: 10,
		height: 100,
		color: "white",
		score: 0,
		canvas: this.canvas
	}
	this.GameInfo = {
		MatchNumber : 0,
		
	}
	this.userTwo={
		x: 10,
		y: this.canvas.height / 2 - 50,
		width: 10,
		height: 100,
		color: "white",
		score: 0,
		canvas: this.canvas
	}
	this.ball = {
		x: this.canvas.width / 2,
		y: this.canvas.height / 2,
		radius: 10,
		speed: 3,
		velocityX: 3,
		velocityY: 3,
			color: "white",
			canvas: this.canvas
		}
	}
	
	drawRect(x : number, y : number, w : number, h : number, color : string)
	{
		if (this.ctx === undefined || this.ctx === null)
		return;
	this.ctx.fillStyle = color;
	this.ctx.fillRect(x, y, w, h);
	}

	drawBall(x : number, y : number, r : number, color : string)
	{
		if (this.ctx === undefined || this.ctx === null)
			return;
		this.ctx.fillStyle = color;
		this.ctx.beginPath();
		this.ctx.arc(x, y, r, 0, Math.PI * 2, false);
		this.ctx.closePath();
		this.ctx.fill();
	}
	drawNet()
	{
		if (this.ctx == undefined || this.ctx == null)
			return;
		this.ctx.fillStyle = "white";
		for (let i = 0; i < this.canvas.height; i+=15)
		{
			this.ctx.fillRect(this.canvas.width / 2 - 1, i, 2, 10);
		}
	}
	drawText(text : string, x : number, y : number)
	{
		if (this.ctx == undefined || this.ctx == null)
			return;
		this.ctx.fillStyle = "#FFF";
		this.ctx.font = "75px  Arial";
		this.ctx.fillText(text, x, y);
	}

	drawing(){
		this.drawNet();
		this.drawRect(this.userOne.x, this.userOne.y, this.userOne.width, this.userOne.height, this.userOne.color);
		this.drawRect(this.userTwo.x, this.userTwo.y, this.userTwo.width, this.userTwo.height, this.userTwo.color);
		this.drawText(this.userTwo.score, this.canvas.width / 4, this.canvas.height / 5);
		this.drawText(this.userOne.score, 3 * this.canvas.width / 4, this.canvas.height / 5);
		this.drawBall(this.ball.x, this.ball.y, this.ball.radius, this.ball.color);
	}


	resetBall()
	{

		this.ball.x = this.canvas.width / 2;
		this.ball.y = this.canvas.height / 2;
		this.ball.speed = 3;
		this.ball.velocityX = 3;
		this.ball.velocityY = 3;
	}
	updating()
	{
		movingTheBall(this.ball);
		Ai_player(this.ball, this.userTwo);
		var player = ((this.ball.x < this.canvas.width / 2) ? this.userTwo : this.userOne)
    if(collision(this.ball,player)){

			let collidePoint = (this.ball.y - (player.y + player.height/2));
			collidePoint = collidePoint / (player.height/2);
			let angleRad = (Math.PI/4) * collidePoint;
			let direction = (this.ball.x + this.ball.radius < this.canvas.width/2) ? 1 : -1;
			this.ball.velocityX = direction * this.ball.speed * Math.cos(angleRad);
			this.ball.velocityY = direction * this.ball.speed * Math.sin(angleRad);
			this.ball.speed += 1;
	}
		if (this.ball.x - this.ball.radius < 0)
		{
			this.userOne.score++;
			this.resetBall();
		}
		else if (this.ball.x + this.ball.radius > this.canvas.width)
		{
			this.userTwo.score++;
			this.resetBall();
		}
		if (this.ketpress['w'])
			this.userOne.y -= 8;
		if (this.ketpress['s'])
			this.userOne.y += 8;
		if (this.userOne.y < 0)
			this.userOne.y = 0;
		if (this.userOne.y > (this.canvas.height - this.userOne.height))
			this.userOne.y = this.canvas.height - this.userOne.height;

	}
	render()
	{
		if (this.ctx == undefined || this.ctx == null)
			return;
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
		this.drawing();
		this.updating();
		this.doucumentEvent();
		requestAnimationFrame(this.render.bind(this));
	}
	async doucumentEvent(){
		document.addEventListener('keydown', async  (event) => {
			this.ketpress[event.key] = true;
		});
		document.addEventListener('keyup', async  (event) => {
			this.ketpress[event.key] = false;
		});
	
		// this.ctx?.canvas.addEventListener('mousemove', (event) => {
		// 	let rect = this.canvas.getBoundingClientRect();
		// 	this.userOne.y = event.clientY - rect.top - this.userOne.height / 2;
		// });
	
	}


}







function PlayWithAi(){
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const navigate = useNavigate();
	var game = null;
	useEffect(() => {
		const canvas = canvasRef.current;
		if (canvas === null)
			return;
		game = new GamePong(canvas, navigate);
		game.render();
		const checkifout = (e:any) =>{
			if (e.key === "Escape"){
				navigate("/")
			}
		}
		window.addEventListener('keydown', checkifout)
		return (
			console.log("The game is finished")
		)
	}, []);


	return (
		<div className="botcontainer">
			<div className="botframe">
				<canvas ref={canvasRef} width={800} height={600}  className="gamewithai" />
			</div>
		</div>
	);

}


export default PlayWithAi;