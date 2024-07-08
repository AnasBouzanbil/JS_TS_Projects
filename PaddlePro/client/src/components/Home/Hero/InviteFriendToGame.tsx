import { Avatar, Badge, Box, Button, Divider, IconButton, List, ListItem, Typography } from "@mui/material";
import { useContext } from "react";
import { UserContext } from "../../Context/main";
import { Close } from "@mui/icons-material";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTableTennisPaddleBall } from '@fortawesome/free-solid-svg-icons'
import { StyledBadge } from "../LastMatchesList";
import { Friend, FriendsState } from "../../Context/user";
import { InviteFriendToGameButton } from "./InviteToGameButton";
import styled from "@emotion/styled";

const StyledBadge2 = styled(Badge)(() => ({
    '& .MuiBadge-badge': {
        backgroundColor: 'rgb(0 55 255)'
    }
}));

export default function InviteFriendToGame({ setShowInviteFriendToGame, socket, friendsState }: { setShowInviteFriendToGame: any, socket: any, friendsState: FriendsState }) {
    const AuthUser = useContext(UserContext);

    document.addEventListener('keydown', (e) => {
        if (e.key === "Escape") {
            setShowInviteFriendToGame(false);
        }
    })


    return (
        <Box id="container" sx={
            {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                width: "100%",
                position: "fixed",
                top: "0",
                left: "0",
                backgroundColor: "rgba(0,0,0,0.5)",
                zIndex: 10010,
                boxShadow: "0 0 10px 0 rgba(0,0,0,0.5)",
            }
        } >
            <Box id="modal" sx={
                {
                    color: "black",
                    position: "relative",
                    width: "50%",
                    height: "50%",
                    backgroundColor: "white",
                    borderRadius: "10px",
                    padding: "20px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                    "@media (max-width: 800px)": {
                        width: "80%",
                        height: "80%",
                    },
                    maxWidth: "500px",
                }
            }>
                <Box id='header' sx={
                    {
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }
                }>
                    <span></span>
                    <Typography variant="h4" sx={
                        {
                            fontSize: "24px",
                            fontWeight: "400",
                            color: "#f8049cad",
                            fontFamily: "Anta",
                            textAlign: "center",
                        }
                    }>
                        Invite a friend to play a game

                    </Typography>
                    <IconButton onClick={() => setShowInviteFriendToGame(false)}>
                        <Close />
                    </IconButton>
                </Box>
                {
                    friendsState.AcceptedFriends.length === 0 && <Typography variant="h6" sx={
                        {
                            textAlign: "center",
                            color: "#303030"
                        }
                    }>
                        You have no friends
                    </Typography>
                }

                        <List sx={{                         display: "flex",
                        gap: "5px",
                        overflowY: "auto",
                        flexDirection: "column"}}>

                    {
                        friendsState.AcceptedFriends.map((friend: Friend, id) => {
                            return (
                                <ListItem sx={
                                    {
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "20px",
                                        width: "100%",
                                        alignItems: "normal",

                                    }
                                } key={id}>
                                 {
                                       id !== 0 &&
                                       <Divider />
                                 }
                                    <Box sx={
                                        {
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            gap: "20px",

                                        }
                                    }>
                                        <Box sx={
                                            {
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                gap: "20px",
                                            }

                                        }>
                                            {
                                                friend.inGame ? <StyledBadge2
                                                    overlap="circular"
                                                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                                                    variant="dot"
                                                >
                                                    <Avatar alt={friend.user} src={friend.image} />
                                                </StyledBadge2> :
                                                    friend.onlineStatus ? <StyledBadge
                                                        overlap="circular"
                                                        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                                                        variant="dot"
                                                    >
                                                        <Avatar alt={friend.user} src={friend.image} />
                                                    </StyledBadge> :
                                                        <Avatar alt={friend.user} src={friend.image} />
                                            }
                                            <Typography>{friend.user}</Typography>
                                        </Box>

                                        <InviteFriendToGameButton friend={friend} socket={socket}>
                                            <Box sx={
                                                {
                                                    "&:hover": {
                                                        color: "#f8049cad",
                                                    }
                                                }
                                            }
                                            >
                                                <FontAwesomeIcon icon={faTableTennisPaddleBall} />
                                            </Box>
                                        </InviteFriendToGameButton>
                                    </Box>
                                </ListItem>
                            )
                        }
                        )
                    }
                    </List>
            </Box>
        </Box>

    )
}