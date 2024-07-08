import React, { useContext, useEffect } from "react";
import GroupsIcon from "@mui/icons-material/Groups";
import {
  Avatar,
  Box,
  Button,
  Stack,
  Typography,
} from "@mui/material";
import Normal from "./Normal";
import MessagesBar from "./MessagesBar";
import {UserContext} from '../Context/main'
import ChatSettings from "./ChatSettings";
import ChannelsList from "./Channels/ChannelsList";
import { ChannelInterface, FriendsState } from "../Context/user";
import { toast } from "react-toastify";

interface ChatListProps {
  
  selected: string,
  setSelected: React.Dispatch<React.SetStateAction<string>>,
  selectedChannel: string,
  setSelectedChannel: React.Dispatch<React.SetStateAction<string>>,
  
  setConversations: React.Dispatch<React.SetStateAction<ChannelInterface[]>>
  conversations: ChannelInterface[],
  isTyping: boolean
  friendsState: FriendsState
}

export default function ChatList(
  {selected, setSelected, selectedChannel, friendsState, setSelectedChannel, conversations, setConversations,isTyping} : ChatListProps
) {
  const AuthUser = useContext(UserContext);
  const [showChannels, setShowChannels] = React.useState(false);
  const fetchGroups = async () => {
    try {
      const response = await fetch('http://localhost:4000/groups',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        })
      const data = await response.json();
      setConversations(conversations);
    }
    catch (e) {
      //console.log(e);
      toast.error("An error occured while fetching groups");
    }
  }


  return (

      <Stack
        sx={{
          height: "100%",
        }}
      >
        {/*
          Header
        */}

        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
          sx={{
            // backgroundColor: "#222E35",
            borderBottom: "2px solid #222E35",
            padding: "10px 20px",
            paddingLeft: "15px",
          }}
        >
          <Stack
            direction={"row"}
            alignItems={"center"}
            justifyContent={"center"}
            spacing={2}
          >
            <Avatar src={AuthUser.image} />
            <Typography>
              {AuthUser.username}
            </Typography>
          </Stack>
          <ChatSettings conversations={conversations} setConversations={setConversations} />
        </Stack>
          <Stack
          sx={
            {
              position: 'relative',
              overflow: 'hidden', 
              height: '100%',

            }
          }
          >

            {/*
                Search
              */}
            <Stack>
              <Button
                startIcon={
                  <GroupsIcon
                    sx={{
                      color: "#1F90B8",
                      padding: "0 20px",
                      width: "25px",
                      height: "25px",
                    }}
                  />
                }
                sx={{
                  color: "white",
                  justifyContent: "flex-start",
                  textTransform: "capitalize",
                  padding: "20px",
                  paddingLeft: "5px",
                  width: "100%",
                  borderBottom: "2px solid #222E35",
                }}
                onClick={() => {
                  setShowChannels(true);
                  setSelected('');
                  fetchGroups();
                }
                }
              >
                <Typography>Channels</Typography>
              </Button>
            </Stack>
            {/*
                Chat list
              */}

            <Stack 
            direction={"column"}
            sx={
              {
                overflowY: "scroll",
                height: "100%",
                scrollbarWidth: "none",
              }
            }>
              {
                friendsState.AcceptedFriends.map((friend, index) => (

                  <Normal
                    isSelected={selected === friend.user}
                    online={friend.onlineStatus}
                    selected={selected}
                    key={index}
                    name={friend.user}
                    image={friend.image}
                    roomId={friend.roomId}
                    setSelected={setSelected}
                    unseenNum={friend.unseenNum}
                    isTyping={isTyping }
                  />
                ))
              }
            </Stack>
            <ChannelsList selected={selectedChannel} setSelected={setSelectedChannel} selectedChannel={selectedChannel} setSelectedChannel={setSelectedChannel} showChannels={showChannels} setShowChannels={setShowChannels} groups={conversations} setGroups={setConversations} conversation={conversations} />
          </Stack>
      </Stack>
  );
}


/*

*/