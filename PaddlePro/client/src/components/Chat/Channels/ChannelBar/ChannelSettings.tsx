import { MoreVert, Update } from "@mui/icons-material";
import { Settings } from '@mui/icons-material';
import { Divider, IconButton, Menu, MenuItem } from '@mui/material'
import React from 'react'
import { Box } from '@mui/system'
import AlertDialog from "../../../Home/LeftButton/Dialog";
import { channel } from "diagnostics_channel";
import { ChannelInterface } from "../../../Context/user";
import { toast } from "react-toastify";
import UpdateChannel from "./UpdateChannel";
import UpdateChannelInfo from "./UpdateChannelInfo";

const ChannelSettings = (
  {
    channel,
    setGroups,
    setSelecteChannel
  
  } : {
    channel: ChannelInterface,
    setGroups: React.Dispatch<React.SetStateAction<ChannelInterface[]>>,
    setSelecteChannel: React.Dispatch<React.SetStateAction<string>>
  }
) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    };
    const [openUpdateInfoDialog, setOpenUpdateInfoDialog] = React.useState(false);
    const handleClose = () => {
      setAnchorEl(null);
      setOpenUpdateInfoDialog(true);
    };
    const handleLeaveChannel = () => {
      try {
        const url = `http://localhost:4000/groups/delete/${channel.id}`;
        fetch(url, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        })
        .then(response => {
          if (response.ok) {
            toast.info(`You have left ${channel.name}`);
            setGroups((prev) => {
              return prev.filter((group) => group.id !== channel.id);
            });
            setSelecteChannel('');
          } else {
            throw Error('Error leaving channel');
          }
        })
      }
      catch (e:any) {
        toast.error('Error leaving channel');
        //console.log(e);
      }
    }

  return (
    <>
          <IconButton
            onClick={handleClick}
            sx={{
              boxSizing: "border-box",
              color: '#FCFCF6'
            }}
          >
            <MoreVert />
          </IconButton>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
          >
                {/* <MenuItem onClick={handleClose}>Edit channel</MenuItem> */}
                {
                  channel.isOwner ?
                  <UpdateChannelInfo channel={channel} onClickFun={handleClose}/>
                  :
                  null
                }
                <AlertDialog action="leave" onClick={handleLeaveChannel} name={channel.name} isOwner={channel.isOwner}/>
          </Menu> 
    </>
  )
}

export default ChannelSettings
