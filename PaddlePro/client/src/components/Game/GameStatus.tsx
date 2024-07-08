import { useState, useEffect, useContext} from "react";
import { Avatar, Button } from "@mui/material";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { UserContext } from "../Context/main";
import { useNavigate } from "react-router-dom";

const  Status = ({socket} : {socket : any}) =>
{
	const [Playeronepic, setPlayerOnepic] = useState("https://cdn.discordapp.com/attachments/1174104847616843796/1216153189972312084/IMG_6237.jpg?ex=65ff59eb&is=65ece4eb&hm=3e581a9d4c64656530de6389da9ecf0ac8996251b1619f6a1c9ce17ae8710bd2&");
	const [PlayerTwopic, setPlayerTwopic] = useState("https://cdn.discordapp.com/attachments/1174104847616843796/1216153189972312084/IMG_6237.jpg?ex=65ff59eb&is=65ece4eb&hm=3e581a9d4c64656530de6389da9ecf0ac8996251b1619f6a1c9ce17ae8710bd2&");
	const [level, SetLevel] = useState(1);
	const [PlayerOneScore , setPlayerOneScore] = useState(0);
	const [PlayerTwoScore , setPlayerTwoScore] = useState(0);
    const UserInfo = useContext(UserContext);
    const navigate = useNavigate();
	useEffect(()=>{
        if (UserInfo === null || UserInfo.username === 'default' || sessionStorage.getItem('GameToken') === null) {
            navigate('/');
            return;
        }
        socket.on('UsersPic', (data : any) => {
            console.log("i got the data : " + data);
            setPlayerTwopic(data.two);
            setPlayerOnepic(data.one);
        } );
		socket.on('GameStatus', (data : any) => {
			setPlayerOneScore(data.one);
			setPlayerTwoScore(data.two);
			SetLevel(data.level);

		});
        return ()=>{
            socket.off('GameStatus');
        }
	},[]);
    return (
        <>
       
        <div className="flex white-text   justify-center items-center container1">
            <div className="flex flex-row items-center  justify-center ml-24 container2" id="container2">
                        <div className="flex flex-row items-center justify-center   container3" id="container3">
                                <div className="flex flex-row  items-center avatarsccore1" id="avatarsccore1">
                                    <Avatar
                                        alt="PlyerImage"
                                        src={PlayerTwopic}
                                        sx={{ 
                                            width: { xs: 40, sm: 55, md: 100, lg: 105, xl: 100 }, 
                                              height: { xs: 40, sm: 55, md: 100, lg: 105, xl: 100 } 
                                        }}
                                    />
                                    
                                     <div className="text-4xl font-bold  playersccoretext1" id="playersccoretext1"> {PlayerTwoScore}</div>
                                </div>
                                <div className="flex flex-col  justify-center middle " id="middle">
                                        <div className="justify-center items-center ml-2 level" id="level">
                                                Level {level}
                                        </div>
                                </div>
                                <div className="flex flex-row items-center avatarsccore2" id="avatarsccore2">
                                    <div className="text-4xl font-bold transition playersccoretext2" id="playersccoretext2"> {PlayerOneScore}</div>
                                    <Avatar
                                        alt="PlyerImage"
                                        src={Playeronepic}
                                        sx={{ 
                                            width: { xs: 40, sm: 55, md: 100, lg: 105, xl: 100 }, 
                                            height: { xs: 40, sm: 55, md: 100, lg: 105, xl: 100 } 
                                        }}
                                    />
                                </div>
                        </div>
                     
            </div>
            <div className="flex flex-row items-center justify-center exit  pt-7">
                     <ExitToAppIcon fontSize="large"  onClick={() => {socket.emit('PlayerLeaves', sessionStorage.getItem('GameToken')); navigate('/', {replace: true})
                 sessionStorage.removeItem('GameToken');
                 ;}} sx={ 
                  {cursor: 'pointer',
                    width : { xs: 5 , sm: 10, md: 15, lg: 20, xl: 25},
                    height : { xs: 5 , sm: 10, md: 15, lg: 20, xl: 25},
                }
                  }/>
        </div>
            <script src="/socket.io/socket.io.js"></script>
        </div>
         </>
    );
    }
    
    
    export default Status;