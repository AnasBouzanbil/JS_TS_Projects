import {
  Avatar,
  Box,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect } from "react";
import SendIcon from "@mui/icons-material/Send";
import { UserContext } from "../Context/main";
import Message from "./Message";
import { FriendsState, Message as MessageInterface } from "../Context/user";


import data from '@emoji-mart/data'
import { init } from 'emoji-mart'

import Picker from '@emoji-mart/react'
import { ArrowBack, Settings } from "@mui/icons-material";
import ChatBarSettings from "./ChatBar/ChatBarSettings";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";


const checkWhiteSpace = (str: string) : boolean => {
  return !str.replace(/\s/g, '').length;
}

interface ChatListProps {
  selected: string;
  setSelected: React.Dispatch<React.SetStateAction<string>>;
  socket: any;
  setFriendsState: React.Dispatch<React.SetStateAction<FriendsState[]>>;
  friendsState: FriendsState;
}

export default function ChatBar({ socket, selected, setSelected, friendsState,setFriendsState }: ChatListProps) {
  const AuthUser = useContext(UserContext);
  const [messages, setMessages] = React.useState<MessageInterface[]>(AuthUser.messages);
  const user = friendsState.AcceptedFriends.find((element) => element.user === selected);
  const parentDiv = React.useRef<HTMLDivElement>(null);
  const [isPickerVisible, setIsPickerVisible] = React.useState(false);
  const textFieldRef = React.useRef<HTMLInputElement>(null);
  const [messageText, setMessageText] = React.useState("");
  let lastDiv = React.useRef<HTMLDivElement>(null);

  function App() {
    return (
      <Picker data={data} onEmojiSelect={(e: any) => {
        setIsPickerVisible(false)
        //console.log(e.native)
        setMessageText(messageText + e.native)
        //console.log(messageText)
        textFieldRef.current?.focus();
      }} />
    )
  }

  const fetchMessages = async () => {
    if (user === undefined) {
      return;
    }
    const url = `http://localhost:4000/messages/room/${user.roomId}`;

    const response = await fetch(url,
      {
        headers: {
          "Authorization": `Bearer ${AuthUser.access_token}`
        }
      });
    if (!response.ok) {
      //console.log("error:", response);
      return;
    }

    const data = await response.json();
    setMessages(data.messages);
    AuthUser.messages = data.messages;
  }

  useEffect(() => {
    if (user === undefined) {
      return;
    }
    socket.emit("joinRoom", {roomId: user.roomId.toString(), type: 'dm'});
    fetchMessages();
    
    user.unseenNum = 0;

    setFriendsState((prev:any)=>{
      const newFriends = prev.AcceptedFriends.map((friend:any)=>{
        if(friend.user === selected){
          friend.unseenNum = 0;
        }
        return friend;
      })
      return {
        ...prev,
        friends: newFriends
      }
    }
    )

    socket.on("joinRoom", (arg: any) => {
      //console.log(`Joined room successfully: ${arg.message.roomId}`)
    })

    socket.on("Messages", (arg: any) => {
      if (arg.error !== undefined) {
        toast.error(arg.error);
        //console.log(arg.error);
        return;
      }

      socket.emit('seenRightAway', {
        sender: AuthUser.username, receiver: selected, roomId: user.roomId, type:"dm"
      })
      if (arg.message.reciepient === AuthUser.username) {
        return;
      }
      console.log(arg.message)
      setMessages([...AuthUser.messages, {
        content: arg.message.content,
        sender_name: arg.message.sender,
        reciepient: arg.message.receiver,
        created_on: new Date().toString()
      }])
      console.log(new Date().toString())
      AuthUser.messages.push({
        content: arg.message.content,
        sender_name: arg.message.sender,
        reciepient: arg.message.receiver,
        created_on: new Date().toString()
      })
      setTimeout(() => {
        lastDiv.current?.scrollIntoView({ behavior: "smooth" });
      }
      , 250);
    })
    setTimeout(() => {
      lastDiv.current?.scrollIntoView({ behavior: "smooth" });
    }
    , 1000);

    return () => {
      socket.off("joinRoom")
      socket.off("Messages")
      // if (user)
      socket.emit("leaveRoom", '1');
      // alert(1)
      user.unseenNum = 0;
      // user.unseenNum = 0;
      setFriendsState((prev:any)=>{
        const newFriends = prev.AcceptedFriends.map((friend:any)=>{
          if(friend.user === selected){
            friend.unseenNum = 0;
          }
          return friend;
        })
        return {
          ...prev,
          friends: newFriends
        }
      }
      )
  }
  }, [selected]);

  if (!user) {
    return <>

    </>;
  }

  const handle_change = (e: any) => {
    const { value } = e.target;
    if (value === "" || checkWhiteSpace(value)) {
      return;
    }
    socket.emit("Writting", { sender: AuthUser.username, roomId: user.roomId });
    if (e.key === "Enter") {
      socket.emit("Messages", { content: value, sender: AuthUser.username, receiver: selected, roomId: user.roomId });
      setMessageText("");
      setMessages([...AuthUser.messages, {
        content: value,
        sender_name: AuthUser.username,
        reciepient: selected,
        created_on: new Date().toString()
      }])
      AuthUser.messages.push({
        content: value,
        sender_name: AuthUser.username,
        reciepient: selected,
        created_on: new Date().toString()
      })
      setTimeout(() => {
        lastDiv.current?.scrollIntoView({ behavior: "smooth" });
      }
      , 250);
    }
  }

  return (

    <Stack
      direction={"column"}
      justifyContent={"space-between"}
      alignItems={"stretch"}
      spacing={3}
      maxWidth={"800px"}
      sx={{
        width: "90%",
        margin: "auto",
        height: "100%",
      }}
    >


      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={3}
        sx={{
          background: "#222E35",
          borderRadius: "25px",
          padding: "10px",
        }}
      >
        <Box sx={{
          display: 'none',
          justifyContent: 'center',
          alignItems: 'center',
          '&:hover': {
            cursor: 'pointer'
          },
          '@media (max-width: 800px)': {
            display: 'flex'
          }

        }}>
          <IconButton onClick={
            () => {
              setSelected("");
            }
          } sx={
            {
            }
          }>
            <ArrowBack sx={
              {
                color: '#FCFCF6'
              }
            } />
          </IconButton>
        </Box>
        <Link to={`/profile/${user.user}`} style={{ textDecoration: 'none' }}>
        <Stack direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={3}>
          <Avatar src={user.image} />
          <Box>
            <Typography>{user.user}</Typography>

          </Box>
        </Stack>
            </Link>
        <Box>
            <ChatBarSettings user={user} socket={socket} />
        </Box>
      </Stack>
      <Box height={"100%"} sx={
        {
          overflowY: "scroll",
          scrollbarWidth: "none"
        }
      } ref={parentDiv}>
        {
          messages.length === 0 ? <Typography textAlign={'center'}>Start the conversation by sending a message</Typography> :
            messages.map(
              (element: MessageInterface, key: number) : JSX.Element => {
                return (
                  <Message lastDiv={lastDiv} key={key} sender={element.sender_name} message={element} previousMessage={messages[key - 1]} >
                    {
                      element.content
                    }
                    </Message>
                  );
                }
              )
          }
        </Box>
      {/* Input */}

      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={3}
        sx={{
          background: "#222E35",
          borderRadius: "25px",
          padding: "10px 20px",
          position: "relative"

        }}
      >

        <TextField
          ref={textFieldRef}
          variant="standard"
          onChange={(e) => setMessageText(e.target.value)}
          value={messageText}
          onKeyDown={handle_change}

          sx={{
            width: "80%",
            borderRadius: "25px",
            color: "white",

          }}
          placeholder="Type a message..."
          InputProps={{
            disableUnderline: true,
            sx: {
              borderBottom: "1px solid #fff",
              color: "white",
            },
          }}
        />
        <div style={
          {
            position: "absolute",
            bottom: "55px",
            right: 0,
            display: isPickerVisible ? "block" : "none",
          }
        }>
          <App />
        </div>


        <Box sx={
          {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            margin: "0 !important",
          }
        
        }>

          <IconButton onClick={
            () => {
              setIsPickerVisible(!isPickerVisible);
            }
          }  sx={
            {
              marginLeft: "10px",
            }
          }>
                              <Typography sx={{ color: "white", fontSize: "18px",
          filter: isPickerVisible ? "none" : "grayscale(100%)",
        }} >
            	&#128516;

          </Typography>
          </IconButton>
          <IconButton disabled={
            messageText === "" || checkWhiteSpace(messageText)
          
          } onClick={
            () => {
              socket.emit("Messages", { content: messageText, sender: AuthUser.username, receiver: selected, roomId: user.roomId });
              setMessageText("");
              setMessages([...AuthUser.messages, {
                content: messageText,
                sender_name: AuthUser.username,
                reciepient: selected,
                created_on: new Date().toString()
              }])
              AuthUser.messages.push({
                content: messageText,
                sender_name: AuthUser.username,
                reciepient: selected,
                created_on: new Date().toString()
              })
              setTimeout(() => {
                lastDiv.current?.scrollIntoView({ behavior: "smooth" });
              }
              , 250);
            }
          } >
          <SendIcon sx={
              {
                color: messageText === "" || checkWhiteSpace(messageText) ? "gray" : "white",
              }
            } />
          </IconButton>

        </Box>

      </Stack>
    </Stack>

  );
}
