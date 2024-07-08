import { Avatar, Button, Divider, IconButton, Input, Menu, MenuItem, Stack, Typography } from "@mui/material";
import PeopleIcon from '@mui/icons-material/People';
import React, { useContext, useEffect } from "react";
import { ChannelInterface, FriendsState } from "../../../Context/user";
import { Label, MoreHoriz, MoreVert } from "@mui/icons-material";
import MoreOptionsMember from "./MoreOptionsMember";

import './style.css'
import useGetMembers from "./Hooks/getMembers";
import { UserContext } from "../../../Context/main";
import { Link } from "react-router-dom";
export interface MembersInterface {
  username: string,
  image: string,
  role: string
}

export default function ChannelListMembers(
  {
    chat,
    setFriendsState,
    friendsState
  }: {
    chat: ChannelInterface,
    setFriendsState: React.Dispatch<React.SetStateAction<FriendsState>>,
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
  const AuthUser = useContext(UserContext);
  const { fetchMembers, muteMembers, bannedMembers, setBannedMembers, setMuteMembers, members, setMembers } = useGetMembers({ chat });

  const handleUnBanMember = async (username: string) => {
    try {
      const url = `http://localhost:4000/groups/${chat.id}/unban/${username}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      }
      );
      if (!response.ok) {
        throw new Error('Network response was not ok');
        return;
      }
      setBannedMembers(bannedMembers.filter((member) => member.username !== username));
    } catch (error) {
      console.log('error:', error);
    }
  }

  return (
    <Stack>
      <IconButton
        onClick={handleClick}
      >
        <PeopleIcon sx={
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
            members.map((member, key) => {
              return (
                <MenuItem key={key}>
                  <Stack direction="row" spacing={4} alignItems="center" justifyContent={'space-between'} sx={{ width: "100%" }}>
                    <Stack direction="row" spacing={4} alignItems="center" justifyContent={''} sx={{ width: "100%" }}>

                      <Stack direction="row" spacing={2} alignItems="center">
                        <Link to={`/profile/${member.username}`}>
                          <Avatar src={member.image} />
                        </Link>
                        <Stack className="is-admin" direction="column" alignItems="flex-start">
                          <Typography>{member.username}</Typography>
                          <Stack direction={'row'} spacing={2}>
                            {
                              member.role === 'Admin' ?
                                <Typography sx={
                                  {
                                    color: '#FCFCF6',
                                    fontWeight: 'bold',
                                    fontSize: '0.6rem',
                                    fontFamily: 'Rubik',
                                    border: '1px solid #3e5d91',
                                    padding: '4px 10px',
                                    borderRadius: '50px',
                                  }
                                }>Admin</Typography>
                                : member.role === 'Owner' ? <Typography sx={
                                  {
                                    color: '#FCFCF6',
                                    fontWeight: 'bold',
                                    fontSize: '0.6rem',
                                    fontFamily: 'Rubik',
                                    backgroundColor: '#3385a3',
                                    padding: '4px 10px',
                                    borderRadius: '50px',

                                  }
                                }>Owner</Typography> : null
                            }
                            {
                              muteMembers.find((banned) => banned.username === member.username) ?
                                <Typography sx={
                                  {
                                    color: '#FCFCF6',
                                    fontWeight: '500',
                                    fontSize: '0.6rem',
                                    fontFamily: 'Rubik',
                                    // backgroundColor: '#',
                                    border: '1px solid #ff4545',
                                    padding: '4px 10px',
                                    borderRadius: '50px',
                                    opacity: '0.7'
                                  }
                                }>Muted</Typography>
                                : null
                            }
                          </Stack>


                        </Stack>
                      </Stack>

                    </Stack>
                    {
                      AuthUser.username !== member.username ?
                            <MoreOptionsMember
                              setMutedMembers={setMuteMembers}
                              mutedMembers={muteMembers}
                              chat={chat}
                              member={member}
                              setMembers={setMembers}
                              members={members}
                              setFriendsState={setFriendsState}
                              friendsState={friendsState}
                            />
                        : null
                    }
                  </Stack>
                </MenuItem>
              )
            })
          }
          {/* <Divider /> */}
          {
            // showBannedMembers ?
            chat.isAdmin ?
              bannedMembers.map((member, key) => {
                return (
                  <MenuItem key={key}>
                    <Stack direction="row" spacing={4} alignItems="center" justifyContent={'space-between'} sx={{ width: "100%" }}>
                      <Stack direction="row" spacing={4} alignItems="center" justifyContent={'space-between'} sx={{ width: "100%" }}>

                        <Stack direction="row" spacing={2} alignItems="center">
                          <Avatar src={member.image} />
                          <Typography>{member.username}</Typography>
                        </Stack>
                        <Button onClick={
                          () => {
                            handleUnBanMember(member.username);
                          }
                        } variant="outlined" color="info" sx={
                          {
                            p: '5px 10px',
                            fontSize: '0.7rem',
                            m: '0',

                          }
                        }>
                          Unban
                        </Button>
                      </Stack>
                    </Stack>
                  </MenuItem>
                )

              })
              : null
          }
        </Stack>
        {/* Banned Members Hide/Show */}
        <MenuItem>
          {/* <label onClick={()=>{
            setShowBannedMembers(!showBannedMembers)
            //console.log('showBannedMembers:', showBannedMembers)
          }} className="container">
            Show Banned Members
            <input type="checkbox" />
            <span className="checkmark"></span>
          </label> */}
        </MenuItem>
      </Menu>
    </Stack>
  );
}

