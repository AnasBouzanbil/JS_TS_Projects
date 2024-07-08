import PlayWithFriend from "./PlayWithFriend";
import Status from './GameStatus'
import './Style_Files/Style.css';
import { useContext, useEffect, useState } from "react";
import MyComponent from "./Result";
import { UserContext } from "../Context/main";
import { useNavigate } from "react-router-dom";
import { user } from "../Context/user";
import Loading from "./Loading";
import Alert from '@mui/material/Alert';




export default function Game({ socket }: { socket: any }) {
    let token  ='';
    const navigate = useNavigate();
    const [showTheResult, setShowTheResult] = useState(false);
    const [showTheGame, setShowTheGame] = useState(false);
    const UserInfo = useContext(UserContext);

    useEffect(() => {
        if (UserInfo === null || UserInfo.username === 'default' ) {
            <Alert variant="filled" severity="error">Login First please!</Alert>
            navigate('/');
        }
    }, []);

    const setToSetTheResult = () =>
    {
        setShowTheResult(true);
    }
    useEffect(() => {
        socket.emit('StartingGame', UserInfo);
        socket.on('GameStarted', (Token : any) => {
            token = Token;
            sessionStorage.setItem('GameToken', Token);
            setShowTheGame(true);
        });
        socket.on('NotAbleToPlay', (data : any) => {
            <Alert variant="filled" severity="error">Someting went Wrong .</Alert>
            navigate('/');
            return ;
        });

        const HandleBackButton = () => {
            navigate('/');
            socket.emit('PlayerLeaves', {token : token});
            sessionStorage.removeItem('GameToken');
        }
        const handleOut = (e:any) =>{
            if (e.key === "Escape"){
                socket.emit('PlayerLeaves', sessionStorage.getItem('GameToken')); 
                sessionStorage.removeItem('GameToken');
                navigate('/', {replace: true})
            }
        }
        window.addEventListener('popstate', HandleBackButton);
        window.addEventListener("keydown", handleOut)
        return () => {
            socket.emit('PlayerLeaves2', {token : sessionStorage.getItem('GameToken'), username : UserInfo.username});
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
                                        <div className="frameGame w-screen h-screen white-text ">
                                            <div className="flex  items-center justify-center status">
                                                <Status socket={socket} />
                                            </div>
                                            <div  className="  relative justify-center pt-12 gamecontainer">
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