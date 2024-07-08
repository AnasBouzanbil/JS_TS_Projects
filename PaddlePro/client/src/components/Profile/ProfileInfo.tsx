import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Cancel, Edit } from '@mui/icons-material';
import { Avatar, Tooltip } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { UserContext } from '../Context/main';
import { Friend } from '../Context/user';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import "./Profile.css";
import AlertDialog from '../Home/LeftButton/Dialog';

function convertToFractionalPart(number: number): number {
    // Get the fractional part of the number
    var fractionalPart = number % 1;

    // Ensure the result is within the range [0, 1]
    if (fractionalPart < 0) {
        fractionalPart += 1; // Add 1 to get the positive fractional part
    }

    return fractionalPart;
}

interface SectionOneProps {
    data: any;
    setChangeInfo: (changeInfo: boolean) => void;
    srcImage: any,
    friendsState: any,
    getFriends: () => void;
}

const buttonStyle = {
    margin: "auto",
    top: "50%",
    transform: "translateY(-50%)",
    padding: "1rem",
    color: "white",
    "&:hover": {
        border: "1px solid rgba(255,255,255,0.5)",
    }
}


interface whichOneInterface {
    whichOne: "add" | "cancel" | "remove" | "accept" | "edit" | "none";
}

const ProfileInfo = ({ srcImage, data, setChangeInfo, friendsState, getFriends }: SectionOneProps) => {
    const AuthUser = useContext(UserContext);
    const [whichOne, setWhichOne] = useState<whichOneInterface>({ whichOne: "none" });
    const handleAddFriend = async () => {
        try {
            // //console.log("add friend, username", data.username, "user", AuthUser);
            const url = "http://localhost:4000/friends/add/" + data.username;
            const response = await fetch(url,
                {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${AuthUser.access_token}`
                    }
                }
            );
            if (response.status !== 200) {
                throw new Error("error");
            }

            //console.log("response", response);
            //console.log("status", response.status);
            /*
                fetch friends again [] important , because the AuthUser.friends is not updated
            */
            //console.log("user", AuthUser);
            getFriends();
            // AuthUser.SentRequests.push({ blocked: false, user: data.username, sender: AuthUser.username, status: "pending", image: data.image, onlineStatus: false, unseenNum: 0, receiver: data.username, roomId: 0 });
            setWhichOne({ whichOne: "cancel" });
        }
        catch (error: any) {
            //console.log(error.message);
        }
    }

    const AcceptFriend = async () => {
        try {
            // //console.log("add friend, username", data.username, "user", AuthUser);
            const url = "http://localhost:4000/friends/accept/" + data.username;
            const response = await fetch(url,
                {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${AuthUser.access_token}`
                    }
                }
            );
            //console.log("response", response);

            //console.log("status", response.status);
            if (response.status !== 200) {
                throw new Error("error");
            }
            const rdata = await response.json();
            getFriends();
            setWhichOne({ whichOne: "remove" });
            //console.log("user", AuthUser);
        }
        catch (error: any) {
            //console.log(error.message);
        }
    }

    const RemoveFriend = async () => {
        try {
            //console.log("add friend, username", data.username, "user", AuthUser);
            const url = "http://localhost:4000/friends/remove/" + data.username;
            const response = await fetch(url,
                {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${AuthUser.access_token}`
                    }
                }
            );
            if (response.status !== 200) {
                throw new Error("error");
            }
            //console.log("response", response);
            //console.log("status", response.status);
            getFriends();
            //console.log("here2");
            setWhichOne({ whichOne: "add" });
            //console.log("user", AuthUser);
        }
        catch (error: any) {
            //console.log(error.message);
        }
    }
    const CancelFriend = async () => {
        try {
            //console.log("add friend, username", data.username, "user", AuthUser);
            const url = "http://localhost:4000/friends/reject/" + data.username;
            const response = await fetch(url,
                {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${AuthUser.access_token}`
                    }
                }
            );
            //console.log("response", response);
            //console.log("status", response.status);
            getFriends();
            //console.log("here2");
            setWhichOne({ whichOne: "add" });
            //console.log("user", AuthUser);
        }
        catch (error: any) {
            //console.log(error.message);
        }
    }

    console.log(Math.round((data.level - Math.floor(data.level)) * 100) + "%");
    console.log((data.level - Math.floor(data.level)));
    console.log((Math.floor(data.level)));
    console.log(((data.level)));
    const handlePendingOrFriend = () => {
        //console.log("handlePendingOrFriend");
        if (AuthUser.username === data.username) {
            setWhichOne({ whichOne: "edit" });
            return;
        }
        //console.log("here3")
        setWhichOne({ whichOne: "add" });
        // console.log("friendsState", friendsState);
        friendsState.SentRequests.find((friend: Friend) => {
            if (friend.user === data.username) {
                setWhichOne({ whichOne: "cancel" });
                return true;
            }
            return false;
        }
        );
        friendsState.RecievedRequests.find((friend: Friend) => {
            if (friend.user === data.username) {
                setWhichOne({ whichOne: "accept" });
                return true;
            }
            return false;
        }
        );
        friendsState.AcceptedFriends.find((friend: Friend) => {
            if (friend.user === data.username) {
                setWhichOne({ whichOne: "remove" });
                return true;
            }
            return false;
        }
        );
    }

    React.useEffect(() => {
        //console.log("fetching data");
        handlePendingOrFriend();
    }, [friendsState]);

    const switchCase = () => {
        switch (whichOne.whichOne) {
            case "edit":
                return (
                    <Tooltip title="Edit Profile Info">
                        <Button sx={buttonStyle} onClick={(e) => { e.preventDefault(); setChangeInfo(true); }}  >
                            <Edit />
                        </Button>
                    </Tooltip>
                );
            case "add":
                return (
                    <Tooltip title="Add Friend">
                        <Button sx={buttonStyle} onClick={(e) => { e.preventDefault(); handleAddFriend(); }}  >
                            <PersonAddIcon />
                        </Button>
                    </Tooltip>
                );
            case "cancel":
                return (
                    <Tooltip title="Cancel Friend Request">
                        <Button sx={buttonStyle} onClick={(e) => { e.preventDefault(); CancelFriend(); }}  >
                            <Cancel />
                        </Button>
                    </Tooltip>
                );
            case "remove":
                return (
                        <AlertDialog action='remove' onClick={() => { RemoveFriend(); }} name={data.username} />
                );
            case "accept":
                return (
                    <Tooltip title="Accept Friend Request">
                        <Button sx={buttonStyle} onClick={(e) => { e.preventDefault(); AcceptFriend() }}  >
                            <CheckCircleIcon />
                        </Button>
                    </Tooltip>
                );

        }
    }

    return (
        <Box>

            <Box sx={
                {
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    padding: "1rem",
                    margin: "1rem",
                    paddingTop: '0',
                    marginBottom: "0",
                    borderRadius: "4px",
                    gap: "1rem",
                    color: "white",
                }
            }
            >
                <Box>
                    <Avatar
                        sx={
                            {
                                width: "10rem",
                                height: "10rem",
                                margin: "1rem",
                                backgroundColor: "rgb(255, 255, 255)",
                                borderRadius: "50%",
                                color: "rgb(33, 33, 33)",

                            }
                        }
                        alt="Remy Sharp" src={srcImage} />
                </Box>

                <Box sx={
                    {
                        width: "60%",
                        "flexDirection": "column",
                        "gap": "20px",
                        "display": "flex",
                        "justifyContent": "center"
                    }
                }>
                    <Box>
                        <Typography variant="h5" gutterBottom sx={
                            {
                                fontWeight: "bold",
                            }
                        }>
                            {
                                data.real_name
                            }
                        </Typography>
                        <Typography sx={{
                            margin: 0, padding: 0,
                            fontFamily: 'Rubik',
                            color: "#1b9ecd", fontSize: "1rem",
                        }} variant="h6" gutterBottom>
                            @{
                                data.username
                            }
                        </Typography>
                    </Box>


                    <Typography sx={{
                        margin: 0, padding: 0,
                        color: "rgba(200,200,200,1)"

                    }} variant="body1">
                        {data.bio}
                    </Typography>
                </Box>

                <Box>
                    {
                        switchCase()
                    }
                </Box>
            </Box>
            <Box>
                <Typography sx={{ textAlign: "center" }} variant="h5" component="h2" gutterBottom>
                    Level {(Math.round(data.level * 100) / 100).toFixed(2)}
                </Typography>
                <Box sx={
                    {
                        backgroundColor: "rgba(40,40,40,0.75)",
                        width: "80%",
                        color: "white",
                        margin: "auto",
                        border: "1px solid white",
                        borderRadius: "20px",
                        overflow: "hidden",
                    }
                }>
                    <div id='progress' style={
                        {
                            padding: "10px 0",
                            width: `${(Math.round((data.level - Math.floor(data.level)) * 100) + "%")}`,
                            height: "10px",
                            backgroundColor: "rgba(255,255,255,0.5)",
                            position: "relative"
                        }
                    }>
                    </div>
                </Box>

            </Box>
        </Box>
    );
}

export default ProfileInfo