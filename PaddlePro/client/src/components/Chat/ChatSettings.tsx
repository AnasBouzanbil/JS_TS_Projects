import { Settings } from '@mui/icons-material'
import { IconButton, Menu, MenuItem } from '@mui/material'
import React from 'react'
import CreateGroup from './Channels/CreateGroup'
import SearchChannel from './Channels/FIndChannel'
import { ChannelInterface } from '../Context/user'
import { Box } from '@mui/system'

const ChatSettings = (
  {
    setConversations,
    conversations,
  } : {
    setConversations: React.Dispatch<React.SetStateAction<ChannelInterface[]>>
    conversations: ChannelInterface[]
  }
) => {
    const [animationStyle, setAnimationStyle] = React.useState({} as React.CSSProperties)
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };

  return (
    <>
          <IconButton
            onClick={handleClick}
            
            sx={{
              color: "white",
            }}
          >
            <Settings sx={{
                transform: "scale(0.9)",
                rotate: "-45deg",
                padding: "5px",
                transition: "all 0.5s ease",
                boxSizing: 'unset',
                '&:hover': {
                    transform: "scale(1.5)",
                    rotate: "45deg",
                    transition: "all 0.5s ease"
                }
            }}/>
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
              <CreateGroup setGroups={setConversations} groups={conversations} onClickFun={handleClose} />
              <SearchChannel onClickFun={handleClose} setCurrentChannels={setConversations} currentChannels={conversations}/>

          </Menu> 
    </>
  )
}

export default ChatSettings
