import React, { useContext } from "react";
import Logo from "./Logo";
import AccountMenu from "./Profile";
import LeftButton from "./LeftButton/LeftButton";
import SignIn from "./SignIn";
import RightButton from "./RightButton";
import { SearchBar } from "./SearchBar";
import { UserContext } from "../Context/main";
import Hero from "./Hero/Hero";
import { Box } from "@mui/material";
import NavigationBar from "../Navigation/NavigationBar";
import "./Home.css"


export default function Home(
  {
    friendsState,
    socket,
    notifications,
    setNotifications,
    getFriends,
    setFriendsState
  }: {
    notifications: any[],
    setNotifications: React.Dispatch<React.SetStateAction<any[]>>,
    socket: any,
    friendsState: any,
    getFriends: any,
    setFriendsState: any

  }
) {
  const AuthUser = useContext(UserContext);

  return (
    <>
      <Box>
        <div
          style={
            {
              height: "100vh",
            }
          }
        >
          <div id="left-chihaja">
            <div id="left-chihaja-child">
            </div>
          </div>
          <div id="app">
            <Logo />
            {
              AuthUser.isLoggedIn && <SearchBar />
            }
            {AuthUser.isLoggedIn ? (
              <AccountMenu getFriends={getFriends} socket={socket} notifications={notifications} setNotifications={setNotifications} username={AuthUser.username} image={AuthUser.image} />
            ) : (
              <SignIn />
            )}
          </div>

          <div id="center">
            {
              AuthUser.isLoggedIn && <LeftButton setFriendsState={setFriendsState} friendsState={friendsState} getFriends={getFriends} />
            }
            <Hero friendsState={friendsState} socket={socket} isLoggedIn={AuthUser.isLoggedIn} />
            {
              AuthUser.isLoggedIn && <RightButton />
            }
          </div>
        </div>

      </Box>

      {
        AuthUser.isLoggedIn && <NavigationBar></NavigationBar>
      }
    </>
  );
}
