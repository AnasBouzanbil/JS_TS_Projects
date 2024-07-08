
import React, { useEffect, useRef } from "react";
import './Style_Files/Style.css';
import { useNavigate, useLocation} from "react-router-dom";
import Status from './GameStatus'
import MyComponent from "./Result";
import Loading, { Loading2 } from "./Loading";

class GamePong{
	canvas : HTMLCanvasElement;
	navigate : any;
	ctx : CanvasRenderingContext2D | null;
	userOne : any;
	userTwo : any;
	ball : any;
    socket : any;
	constructor(canvas : HTMLCanvasElement, navigate : any, socket : any)
	{
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
	render() {
		this.socket.on('DataForGuest',(data : any) =>
		{
			if (this.ctx == undefined || this.ctx == null)
				return;
			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
			this.ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
			this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
			this.drawing();
			this.userOne.y =data.userOneY;
			this.userTwo.y = data.userTwoY;
			this.ball.x = data.ballX;
			this.ball.y = data.ballY;
				
		});
		this.socket.on('EndGame', () => {
			this.navigate('/');
		});
		
	}
}


function WatchGame( {socket} : {socket : any}) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const navigate = useNavigate();
	useEffect(() => {
		const canvas = canvasRef.current;
		if (canvas == null)
			return;
		const game = new GamePong(canvas , navigate, socket )
        game.render();
	}, []);
	return (
		<div className="flex items-center justify-center border-spacing-0 h-full w-full start-8 ">
			<canvas ref={canvasRef} width={800} height={600}  className="gameCanvas" />
		</div>
	);
}






function LiveGame({ socket }: { socket: any }) {
	const [isthereaGame, setIsthereaGame] = React.useState(true);
	const navigate = useNavigate();
	const [showTheResult, setShowTheResult] = React.useState(true);
	var timeoutId: any = null;

	useEffect(() => {
		socket.emit('IsThereaGame');
		socket.on('GameIsLive', (data: any) => {
			timeoutId = setTimeout(() => {
				setIsthereaGame(false);
			}, 2000);
		});
		socket.on('EndGame', () => {
			setShowTheResult(false);
		});
		socket.on('GameIsNotLive', (data: any) => {
			timeoutId = setTimeout(() => {
				navigate('/');
			}, 2000);
		});
		return () => {
			clearTimeout(timeoutId);
		}
	}, []);

	return (
		<>
			{isthereaGame ? (
				<Loading2 />
			) : showTheResult ? (
				<div className="flex flex-col bg-black w-screen h-screen white-text" id="firstPage">
					<div className="p-10 top-9 bottom-9 text-white" id="statusFrame">
						<Status socket={socket} />
					</div>
					
					<div id="GameWItchChat" className="flex flex-col top-100 left-10 w-full h-full justify-center ">
						<div id="GameFrame" className="bg-slate-200  relative justify-center">
							<WatchGame socket={socket} />
						</div>
					</div>
				</div>
			) : (
				<MyComponent socket={socket} />
			)}
		</>
	)
}
export default LiveGame;