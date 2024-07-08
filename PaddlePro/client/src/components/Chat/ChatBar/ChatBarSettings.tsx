import { Settings } from "@mui/icons-material";
import { Box, IconButton, Menu, MenuItem } from "@mui/material";
import { Friend } from "../../Context/user";
import React from "react";
import { toast } from "react-toastify";
import AlertDialog from "../../Home/LeftButton/Dialog";
import { InviteFriendToGameButton } from "../../Home/Hero/InviteToGameButton";


export default function ChatBarSettings(
    {
        user,
        socket
    }
    : {
        user: Friend,
        socket: any
    }
) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [open, setOpen] = React.useState(false);
    const [blocked, setBlocked] = React.useState(user.blocked);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    const handleBlockUser = async () => {
        try {
            const url = `http://localhost:4000/friends/block/${user.user}`;
            const reponse = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            })
            if (reponse.ok) {
                toast.info(`You have blocked ${user.user}`);
            }
            setBlocked(true);
            user.blocked = true;
        }
        catch (e:any) {
            toast.error('Error blocking user');
            toast.error(e.error);
            // //console.log(e);
        }
    }
    const handleUnBlockUser = async () => {
        try {
            const url = `http://localhost:4000/friends/unblock/${user.user}`;
            const reponse = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            })
            if (reponse.ok) {
                toast.info(`You have unblocked ${user.user}`);
            }
            setBlocked(false);
            user.blocked = false;
        }
        catch (e:any) {
            toast.error('Error unblocking user');
            toast.error(e.error);
            // //console.log(e);
        }
    }
    return (
    <>
        <IconButton onClick={(e) => {
            //console.log('settings');
            handleClick(e)
          }
          }>
            <Settings sx={
              {
                color: '#FCFCF6',
                opacity: 0.75,
                '&:hover': {
                  opacity: 1
                }
              }

            }
            
            />
          </IconButton>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
            >
                {/* <MenuItem onClick={
                    () => {
                        handleBlockUser();
                    }
                }>block user</MenuItem> */}
            {
                blocked ? 
                <MenuItem onClick={
                    () => {
                        handleUnBlockUser();
                    }
                }>Unblock user</MenuItem> :
                <AlertDialog action='block' onClick={handleBlockUser} name={user.user}/>
            }
            <MenuItem>
            <InviteFriendToGameButton friend={user} socket={socket}>
                Invite to game
            </InviteFriendToGameButton>
            </MenuItem>
        </Menu>

    </>
    )
}