import PlayWithFriend from "./PlayWithFriend";
import Status from './GameStatus'
import './Style_Files/Style.css';
import { useContext, useEffect, useState } from "react";
import MyComponent from "./Result";
import { UserContext } from "../Context/main";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";

export default function GameWithInvi({ socket }: { socket: any }) {

    const navigate = useNavigate();
    const [showTheResult, setShowTheResult] = useState(false);
    const [showTheGame, setShowTheGame] = useState(false);
    const UserInfo = useContext(UserContext);

    useEffect(() => {
        if (UserInfo === null || UserInfo.username === 'default' ) {
            
            navigate('/');
        }
        return () => {console.log('CleanUp')}
    }, []);

    const setToSetTheResult = () =>
    {
        setShowTheResult(true);
    }
    useEffect(() => {
        socket.on('GameStarted', (Token : any) => {

            sessionStorage.setItem('GameToken', Token);
            setShowTheGame(true);
        });
        socket.on('NotAbleToPlay', (data : any) => {
            sessionStorage.removeItem('GameToken');
            navigate('/');
        });
        socket.on('leaveNow',() =>{
           sessionStorage.removeItem('GameToken');
            navigate('/');
        }
        )
        const HandleBackButton = (e : any) => {
            if (showTheGame === false)
            {
                socket.emit('PlayerLeavesinInviate', {token : sessionStorage.getItem('GameToken'), username : UserInfo.username});
                navigate('/');
            }
            else {
                socket.emit('PlayerLeaves', {token : sessionStorage.getItem('GameToken'), username : UserInfo.username});
                navigate('/');
            }
            sessionStorage.removeItem('GameToken');
        }
        window.addEventListener('popstate', HandleBackButton);
        
        
        return () => {
            if (showTheGame === false)
                socket.emit('PlayerLeavesinInviate', {token : sessionStorage.getItem('GameToken'), username : UserInfo.username});
            else
                socket.emit('PlayerLeaves', {token : sessionStorage.getItem('GameToken'), username : UserInfo.username});
            socket.off('GameStarted');
            socket.off('NotAbleToPlay');
        }

    }, []);


    return (
                <>
                {
                    showTheGame === false ? (<Loading />)
                :
                    (showTheResult === false ? 
                    (
                        <div className="frameGame  w-screen h-screen white-text ">
                              <div className="flex  items-center justify-center status">
                                    <Status socket={socket} />
                                 </div>

                                <div  className="  relative justify-center pt-12">
                                    <PlayWithFriend socket={socket} funTosetResultShow={setToSetTheResult} />
                                </div>
                        </div>
                  ) 
                  : 
                  <MyComponent socket={socket} />
                   )
             } 
                 
                </>
            )
}