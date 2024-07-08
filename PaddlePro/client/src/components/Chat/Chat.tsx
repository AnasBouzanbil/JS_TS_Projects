import React, { useContext, useEffect, useState } from "react";
import ChatList from "./ChatList";
import ChatBar from "./ChatBar";
import { Box, Stack, Typography } from "@mui/material";
import "./Chat.css";
import { Link, useParams } from "react-router-dom";
import ChannelBar from "./Channels/ChannelBar";
import { ChannelInterface, FriendsState } from "../Context/user";
import { UserContext } from "../Context/main";
import Lottie from 'react-lottie';
import animationData from './Animation.json';


export default function Chat(
  {
    socket,
    conversations,
    setConversations,
    getConversations,
    friendsState,
    setFriendsState,
    getFriends
  }: {
    getConversations: any,
    friendsState: FriendsState,
    setFriendsState: any,
    socket: any,
    conversations: ChannelInterface[],
    setConversations: React.Dispatch<React.SetStateAction<ChannelInterface[]>>,
    getFriends:any
  }
) {
  const chatWith = useParams().name;
  const [selected, setSelected] = React.useState(chatWith ? chatWith : "");
  const [selecteChannel, setSelectedChannel] = React.useState("");
  const [isTyping, setIsTyping] = React.useState(false);
  const AuthUser = useContext(UserContext);
  var timer: NodeJS.Timeout

  if (chatWith) {
    window.history.replaceState({}, "", "/chat");
  }



  useEffect(() => {
    socket.on("Writting", (arg: any) => {
      if (arg.sender === AuthUser.username) {
        return;
      }
      setIsTyping(true);
      clearTimeout(timer);
      timer = setTimeout(() => {
        setIsTyping(false);
      }, 1000);
    }
    )
    getConversations();

    getFriends()
  }
    , []);

  return (
    <Box
      id="chat-container"
      sx={{
        display: "flex",
        flexDirection: "row",
        width: "100%",
        maxWidth: "1600px",
        margin: "0 auto",
        padding: "10px",
        boxSizing: "border-box",
        borderRadius: "20px",
        height: "100vh",

      }}
    >
      <Box
        sx={{
          width: "30%",
          backgroundColor: "#111B21",
          minWidth: "370px",
          boxShadow: "0px 0px 2px rgba(255, 255, 255, 0.5)",
          overflow: "hidden",
          borderRadius: "25px",
          '&::after': {
          },
          '@media (max-width: 800px)': {
            display: selecteChannel === "" && selected === "" ? "block" : "none",
            width: "100%",
          },
        }}
      >
        <ChatList friendsState={friendsState} isTyping={isTyping} selectedChannel={selecteChannel} setSelectedChannel={setSelectedChannel} selected={selected} setSelected={setSelected} setConversations={setConversations} conversations={conversations} />
      </Box>
      <Stack
        sx={{
          // height: selected === "" ? "0%" : "100%",
          transition: "height 0.5s",
          width: "100%",
          '@media (max-width: 800px)': {
            display: selecteChannel === "" && selected === "" ? "none" : "block"
          },
        }}
      >
        {
          selecteChannel === "" ? <></> : <>
            <ChannelBar setFriendsState={setFriendsState} socket={socket} selecteChannel={selecteChannel} setSelectedChannel={setSelectedChannel} setGroups={setConversations} groups={conversations} friendsState={friendsState} />
          </>
        }
        {
          selected === "" ? <></> : <>
            <ChatBar setFriendsState={setFriendsState} socket={socket} selected={selected} setSelected={setSelected} friendsState={friendsState} />
          </>
        }
        {
          selected === "" && selecteChannel === "" ? <>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "100%",
                '@media (max-width: 800px)': {
                  display: "none"
                },
              }}
            >
              <Box style={{ color: "white" }}>
                <Lottie
                  options={
                    {
                      animationData: animationData,
                    }
                  }
                  height={300}
                  width={300}
                />
              </Box>
            </Box>

          </> : <>
          </>
        }

      </Stack>
      <Link to="/" style={
        {
          textDecoration: "none",
          color: "white",
        }

      }>

        <Box className="back-to-home"
          sx={
            {
              display: selected === "" && selecteChannel === "" ? "flex" : "none",
              position: "absolute",
              bottom: "10px",
              right: "10px",
              padding: "10px",
              borderRadius: "10px",
              backgroundColor: "#111B21",
              boxShadow: "0px 0px 2px rgba(255, 255, 255, 0.5)",
              cursor: "pointer",
              '&:hover': {
                backgroundColor: "#1A2B66",
              },
            }


          }>

          <span className="icon">
            <i className="fa fa-house"></i>
          </span>
        </Box>
      </Link>
    </Box>
  );
}
