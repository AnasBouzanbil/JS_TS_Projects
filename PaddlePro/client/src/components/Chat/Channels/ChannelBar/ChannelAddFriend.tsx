import { Avatar, IconButton, Menu, MenuItem, Stack, Typography } from "@mui/material";
import PeopleIcon from '@mui/icons-material/People';
import React, { useContext, useEffect } from "react";
import { ChannelInterface, Friend, FriendsState } from "../../../Context/user";
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import { UserContext } from "../../../Context/main";
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';

export default function ChannelAddFriend(
    {
        chat,
        friendsState
    }: {
        chat: ChannelInterface,
        friendsState: FriendsState
    }
) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        fetchMembers();
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const [members, setMembers] = React.useState([] as any[]);
    const AuthUser = useContext(UserContext);
    const friends = friendsState.AcceptedFriends.filter((friend:Friend) => {
        return !members.find((member) => member.username === friend.user);
    }
    )

    const fetchMembers = async () => {
        try {
            const response = await fetch(`http://localhost:4000/groups/members/${chat.id}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                    }
                })
            const data = await response.json();
            setMembers(data.members);
        } catch (error) {
            //console.log('error:', error);
        }
    }

    const inviteFriend = async (member:Friend) => {
        try {
            const url = `http://localhost:4000/groups/send/${member.user}/${chat.name}`;
            //console.log('url:', url);
            const response = await fetch(`http://localhost:4000/groups/send/${member.user}/${chat.name}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${AuthUser.access_token}`
                    }
                })
            const data = await response.json();
            //console.log('data:', data);
        } catch (error) {
            //console.log('error:', error);
        }
    }

    return (
        <Stack>
            <IconButton
                onClick={handleClick}
            >
                <PersonAddAlt1Icon sx={
                    {
                        color: 'rgba(255, 255, 255, 0.75)',
                        '&:hover': {
                            color: 'rgba(255, 255, 255, 1)',
                        }
                    }
                } />
            </IconButton>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
                sx={
                    {
                        minWidth: '200px',
                    }
                }
            >
                <Stack sx={
                    {
                        width: '300px',
                        height: '300px',
                        overflowY: 'auto',
                        overflowX: 'hidden',
                        padding: '10px',
                        gap: '10px',


                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: 'rgba(255, 255, 255, 0.5)',
                        },
                        '&::-webkit-scrollbar-track': {
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        }
                    }
                }>
                    {
                        friends.map((member, index) => {
                            return (
                                <MenuItem key={index}>
                                    <Stack direction="row" spacing={4} alignItems="center" justifyContent={'space-between'} sx={{ width: "100%" }}>

                                        <Stack direction="row" spacing={2} alignItems="center">
                                            <Avatar src={member.image} />
                                            <Typography>{member.user}</Typography>
                                        </Stack>
                                        <Stack direction="row" spacing={2} alignItems="center">
                                            <IconButton onClick={(e)=>{
                                                inviteFriend(member)
                                            }
                                            }>
                                                <PersonAddAltIcon sx={
                                                    {
                                                        color: 'rgba(255, 255, 255, 0.75)',
                                                        '&:hover': {
                                                            color: 'rgba(255, 255, 255, 1)',
                                                        }
                                                    }
                                                
                                                } />
                                            </IconButton>
                                        </Stack>
                                    </Stack>
                                </MenuItem>
                            )
                        })
                    }
                </Stack>
            </Menu>
        </Stack>
    );
}