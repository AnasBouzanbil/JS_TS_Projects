import { Route, Routes } from "react-router-dom";
import Auth from "./components/Auth/Auth";
import React from "react";
import Home from "./components/Home/Home";
import Profile from "./components/Profile/Profile";
import { UserContext } from "./components/Context/main";
import Chat from "./components/Chat/Chat";
import { Socket, io } from "socket.io-client";
import { toast } from "react-toastify";
import useGetFreindsState from "./Hooks/useGetFreindsState";
import GamePong from "./components/Game/Index";
import LiveGame from "./components/Game/WatchGame";
import PlayWithAi from "./components/Game/PLayWithAi";
import Game from "./components/Game/Game";
import GameWithInvi from "./components/Game/playWithFriendInvit";
import useGetConversations from "./Hooks/useGetConversations";
import { Box, Typography } from "@mui/material";
import { NotFoundPage, TwoFactorAuth, fetchForNotifications } from "./components/Tools/ContainerFloat";
import use2fa from "./Hooks/use2fa";
import "./App.css";
import { FriendsState } from "./components/Context/user";

function App() {
  const [notifications, setNotifications] = React.useState<any[]>([]);
  const AuthUser = React.useContext(UserContext);
  const [socket, setSocket] = React.useState<Socket | null>(null);
  const { show2fa, setShow2fa, render, firstTime } = use2fa();
  const { friendsState, setFriendsState, getFriends, render2 } = useGetFreindsState();
  const { conversations, setConversations, getConversations, render3 } = useGetConversations();
  const [code, setCode] = React.useState("");

  /*
      Mazal khas f awl tl3 lih dik l3ba bach ibdel symto o idir image 
  */

  const handleOffline = (arg: { username: string }) => {
    setFriendsState((prev: FriendsState) => {
      prev.AcceptedFriends.map((friend) => {
        if (friend.user === arg.username) {
          friend.onlineStatus = false;
        }
        return friend;
      }
      )
      return { ...prev }

    }
    )
  }

  const handleOnline = (arg: { username: string }) => {
    setFriendsState(
      (prev: FriendsState) => {
        prev.AcceptedFriends.map((friend) => {
          if (friend.user === arg.username) {
            friend.onlineStatus = true;
          }
          return friend;
        }
        )
        return { ...prev }
      }
    );
  }
  const handleInGame = (arg: { username: string }) => {
    console.log(`${arg.username} is in game`);
    setFriendsState((prev: FriendsState) => {
      prev.AcceptedFriends.map((friend) => {
        if (friend.user === arg.username) {
          friend.inGame = true;
          console.log(friend);
        }
        return friend;
      }
      )
      return { ...prev }

    }
    )
  }

  const handleNotInGame = (arg: { username: string }) => {
    console.log(`${arg.username} is out of game`);
    setFriendsState(
      (prev: FriendsState) => {
        prev.AcceptedFriends.map((friend) => {
          if (friend.user === arg.username) {
            friend.inGame = false;
          }
          return friend;
        }
        )
        return { ...prev }
      }
    );
  }
  const handleNewMessages = (arg: any) => {
    setFriendsState((prev: FriendsState) => {
      const newFriends = prev.AcceptedFriends.map((friend) => {
        if (friend.user === arg.sender) {
          friend.unseenNum += 1;
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

  const handleNotifications = (data: any) => {
    if (data.error !== undefined) {
      return;
    }
    getFriends();
    getConversations();
    setNotifications(data.notifs);
  }

  React.useEffect(() => {
    const socket = io(`http://127.0.0.1:4000`, {
      extraHeaders: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      }
    })

    socket.emit('Online', '');

    socket.on('Offline', handleOffline);
    socket.on('Online', handleOnline);
    socket.on('InGame', handleInGame);
    socket.on('NotInGame', handleNotInGame);
    socket.on("newMessages", handleNewMessages);
    socket.on("RealTimeActions", (arg: any) => {
      toast.success(arg.message) 
      setTimeout( 
        () => { 
          
          fetchForNotifications(socket);
        }, 1000);
    });
    socket.on('Notifications', handleNotifications);

    fetchForNotifications(socket);

    setSocket(socket);

    return () => {
      socket.disconnect();
    }
  }, [AuthUser.access_token]);

  if (render === false || render2 === false || render3 === false) {
    return <div>Rendering...</div>;
  }

  if (AuthUser.isLoggedIn === false && window.location.pathname !== "/") {
    return (
      <Box>
        <Typography
          variant="h3"
          sx={{
            color: "white",
            textAlign: "center",
            marginTop: "100px",
          }}
        >
          Please login to continue, Go to /
        </Typography>
      </Box>
    );
  }


  return (
    <div>

      <TwoFactorAuth
        show2fa={show2fa}
        code={code}
        setCode={setCode}
        setShow2fa={setShow2fa}
        firstTime={firstTime}
      />

      <Routes>
        <Route path="/" element={
          <Home
            getFriends={getFriends}
            setFriendsState={setFriendsState}
            friendsState={friendsState}
            socket={socket}
            notifications={notifications}
            setNotifications={setNotifications}
          />} />
        <Route path="/profile/:username/:change?" element={
          <Profile
            friendsState={friendsState}
            notifications={notifications}
            getFriends={getFriends}
            setNotifications={setNotifications}
            socket={socket}
          />} />
        <Route path="/chat/:name?" element={
          <Chat
            getConversations={getConversations}
            setFriendsState={setFriendsState}
            friendsState={friendsState}
            socket={socket}
            conversations={conversations}
            setConversations={setConversations}
            getFriends={getFriends}
          />} />
        <Route path="/auth/callback" element={<Auth />} />
        <Route path="/PlayGame" element={<GamePong socket={socket} />} />
        <Route path="/Gaming" element={<Game socket={socket} />} />
        <Route path="/watchLive" element={<LiveGame socket={socket} />} />
        <Route path="/Playground" element={<PlayWithAi />} />
        <Route path="/playWithFriend" element={<GameWithInvi socket={socket} />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default App;
