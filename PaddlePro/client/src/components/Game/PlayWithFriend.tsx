
import React, { useState, useEffect, useRef } from "react";
import './Style_Files/Style.css';
import { useNavigate} from "react-router-dom";
import { Button } from "react-bootstrap";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';


class GamePong{
	canvas : HTMLCanvasElement;
	navigate : any;
	ctx : CanvasRenderingContext2D | null;
	userOne : any;
	userTwo : any;
	ball : any;
	timeout : any;
	Token : string | undefined;
    socket : any;
	color : string;
	constructor(canvas : HTMLCanvasElement, navigate : any, socket : any)
	{
		this.color = "blue";
        this.socket = socket;
		this.navigate = navigate;
		this.canvas = canvas;
		this.ctx = canvas.getContext('2d');
		if (this.ctx == undefined)
			return;
		this.userOne = {
			x:  this.canvas.width - 20,
			y:  this.canvas.height / 2 - 50,
			width: 10,
			height: 100,
			color: "white",
			score: 0,
			canvas: this.canvas
		}
		this.userTwo = {
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
			velocityX: 1,
			velocityY: 1,
			color: "#fff",
			canvas: this.canvas
		}
	}
	
	drawRect(x : number, y : number, w : number, h : number, color : string)
	{
		if (this.ctx == undefined || this.ctx == null)
		return;
		this.ctx.fillStyle = color;
		this.ctx.fillRect(x, y, w, h);
	}
	drawBall(x : number, y : number, r : number, color : string)
	{
		if (this.ctx == undefined || this.ctx == null)
		return;
		this.ctx.fillStyle = color;
		this.ctx.beginPath();
		this.ctx.arc(x, y, r, 0, Math.PI * 2, false);
		this.ctx.closePath();
		this.ctx.fill();
	}
	drawNet()
	{
		if (this.ctx === undefined || this.ctx === null)
			return;
		this.ctx.fillStyle = "white";
		for (let i = 0; i < this.canvas.height; i+=15)
			this.ctx.fillRect(this.canvas.width / 2 - 1, i, 2, 10);
	}
	drawing(){
		this.drawNet();
		this.drawRect(this.userOne.x, this.userOne.y, this.userOne.width, this.userOne.height, this.userOne.color);
		this.drawRect(this.userTwo.x, this.userTwo.y, this.userTwo.width, this.userTwo.height, this.userTwo.color);
		this.drawBall(this.ball.x, this.ball.y, this.ball.radius, this.ball.color);
	}
	SetToken = (Token : string) => {
		this.Token = Token;
	}
	async movepaddleUp()
	{
		if (this.userOne.y > 0)
			this.userOne.y -= 10;
		else 
			this.userOne.y = 0;
		
	}
	async movepaddleDown()
	{
		if (this.userOne.y < this.canvas.height - this.userOne.height)
			this.userOne.y += 10;
		else 
			this.userOne.y = this.canvas.height - this.userOne.height;
	}
	async render(data : any) {

			if (this.ctx === undefined || this.ctx === null)
				return;
			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
			this.ctx.fillStyle = this.color;
			this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
			this.drawing();
			this.userOne.y = data.userOneY;
			this.userTwo.y = data.userTwoY;
			this.ball.x = data.ballX;
			this.ball.y = data.ballY;
			this.color = data.color;
	
		;
		
	}
}


function PlayWithFriend({ socket , funTosetResultShow} : {socket : any, funTosetResultShow : any}) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const navigate = useNavigate();
	const tok : string  = sessionStorage.getItem('GameToken') ?? '';
	const [color , setColor] = useState("#24A8AF");
	const chnageColor = () => {
	if (color === "#24A8AF"){
		setColor("#960018");
	}
	else{
		setColor("#24A8AF");
	}
	}
	useEffect(() => {
		const canvas = canvasRef.current;
		if (canvas == null)
			return;
		const game = new GamePong(canvas , navigate , socket);
		game.SetToken(tok);
		socket.on('data',  async (data : any) => {
			console.log(`inside on ${color}`)
			await game.render(data);
			game.color = color;
			// socket.emit('MoveBall', tok);
		});

		socket.on('EndGame', () => {
			socket.emit('RemoveData', tok);
			funTosetResultShow();
		});


		const handlekeydown = (event : KeyboardEvent) => {
			socket.emit('PaddleMovesDown', {id : event.key, token : tok});
		}

		const handlekeyup = (event : KeyboardEvent) => {
			socket.emit('PaddleMovesUp', {id : event.key, token : tok});
		}

		document.addEventListener('keydown', handlekeydown);
		document.addEventListener('keyup', handlekeyup);

		return () => {
			document.removeEventListener('keydown', handlekeydown);
			document.removeEventListener('keyup', handlekeyup);
			// socket.emit('PlayerLeaves', tok);
			// socket.emit('RemoveData', tok);
		}
	}, [color]);


	return (
		<div className="flex flex-col items-center justify-center gamecontainer   " style={{width:"100%"}}>
   				 <canvas
        			ref={canvasRef}
        			width={800}
        			height={500}
        			className="bg-blue-600 rounded-lg canva"
   				 ></canvas>
				 <Button variant="primary" 
				 style={{width: "200px", height: "50px", marginTop: "20px", backgroundColor: "#24A8AF", borderRadius: "10px"}}

				 onClick={chnageColor}>
				 Change Table Colour</Button>
		</div>

	
	);
}

export default PlayWithFriend;