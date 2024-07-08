import { useContext, useState } from "react";
import {
  Badge,
  Box,
  IconButton,
  Stack,
  Tooltip,
  Menu,
  Typography,
  ButtonGroup,
  Button,
} from "@mui/material";
import Notification from '@mui/icons-material/Notifications';
import PersonIcon from '@mui/icons-material/Person';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import { UserContext } from "../Context/main";
import './NotificationBar.css';
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function NotificationBar(
  { notifications, setNotifications, socket, getFriends }: {
    notifications: any[],
    setNotifications: React.Dispatch<React.SetStateAction<any[]>>,
    socket: any, 
    getFriends: any
  }
) {
  const [isOpen, setIsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const AuthUser = useContext(UserContext);
  const unreadCount = notifications.length;
  const navigate = useNavigate()

  const toggleNotificationCenter = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setIsOpen(!isOpen);
  };


  const handleAcceptGroup = async (notification: any) => {
    if (notification.type !== 'GroupJoin') {
      return;
    }
    try {

      const name = notification.content.split(' ');
      const url = `http://localhost:4000/groups/accept/${name[10]}/${notification.id}`;
      //console.log('url:', url);
      const response = await fetch(url,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        });
      if (response.ok) {
        //console.log('accepted');
        toast.info(`You have joined ${name[10]} channel`);
        setNotifications((prev) => {
          return prev.filter((notif) => notif !== notification);
        });
      }
    }
    catch (error) {
      //console.log('error:', error);
    }

  }

  const hadnleDeclineGroup = async (notification: any) => {
    if (notification.type !== 'GroupJoin') {
      return;
    }

    try {
      const url = `http://localhost:4000/groups/deny/${notification.id}`;
      //console.log('url:', url);
      const response = await fetch(url,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        });
      if (response.ok) {
        setNotifications((prev) => {
          return prev.filter((notif) => notif !== notification);
        });
        
      }
    }
    catch (error) {
      //console.log('error:', error);
    }
  }

  const handleAcceptFriend = async (notification: any) => {
    //console.log(`notification.type: ${notification.type}`)

    if (notification.type !== 'friend') {
      return;
    }
    try {
      const sp = notification.content.split(' ')[0];
      //console.log('sp:', sp);
      //console.log(`notification.content.split(' '): ${notification.content.split(' ')}`) // `notification.content.split('')[0]: ${notification.content.split('')[0]}
      const url = `http://localhost:4000/friends/accept/${sp}`;
      //console.log('url:', url);
      const response = await fetch(url,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        });
      if (response.ok) {
        setNotifications((prev) => {
          return prev.filter((notif) => notif !== notification);
        });
        toast.info(`You are now friends with ${sp}`);
        getFriends();

      }
    }
    catch (error) {
      //console.log('error:', error);
    }
  }

  const handleDeclinFriend = async (notification: any) => {
    //console.log(`notification.type: ${notification.type}`)
    if (notification.type !== 'friend') {
      return;
    }
    try {
      const name = notification.content.split(' ')[0];
      const url = `http://localhost:4000/friends/reject/${name}`;
      console
        .log('url:', url);
      const response = await fetch(url,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        });
      if (response.ok) {
        setNotifications((prev) => {
          return prev.filter((notif) => notif !== notification);
        });
        
      }
    }
    catch (error) {
      //console.log('error:', error);
    }
  }

  const handleAcceptGame = async (notification: any) => {
    if (notification.type !== 'game') {
      return;
    }
    try {
      const url = `http://localhost:4000/game/delete/${notification.id}/accept`;
      console
        .log('url:', url);
      const response = await fetch(url,
        {
          method: 'Delete',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        });
      if (response.ok) {
        setNotifications((prev) => {
          return prev.filter((notif) => notif !== notification);
        });
      }
      socket.emit('AcceptGameInvite', { recipient: AuthUser.username, sender: notification.content.split(' ')[0] });
      navigate('/playWithFriend');
    }
    catch (error) {
      //console.log('error:', error);
    }
  }
   const  handleDeclineGame = async (notification: any) => {
    socket.emit('NoAccept', { recipient: AuthUser.username, sender: notification.content.split(' ')[0] });
    console.log(`notification.type: ${notification.content.split(' ')[0]} `)
    try {
      const url = `http://localhost:4000/game/delete/${notification.id}/deny`;
      console
        .log('url:', url);
      const response = await fetch(url,
        {
          method: 'Delete',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        });
      if (response.ok) {
        setNotifications((prev) => {
          return prev.filter((notif) => notif !== notification);
        });
      }

    }
    catch (error) {
      //console.log('error:', error);
    }

  }
    return (

      <Box

        sx={{
          margin: "8px",
          display: "flex",
          alignItems: "center",
          textAlign: "center",
        }}
      >

        <IconButton
          onClick={toggleNotificationCenter}
          sx={{ ml: 2 }}>
          <Tooltip title="Notifications">
            <Badge badgeContent={unreadCount} color="primary">
              <Notification htmlColor='white' sx={{ width: 35, height: 35 }} />
            </Badge>
          </Tooltip>
        </IconButton>
        <Menu open={isOpen} anchorEl={anchorEl} onClose={
          () => {
            setIsOpen(false);
          }
        } sx={
          {

          }
        } id="notification-menu" >
          <Stack
            sx={{
              maxHeight: "300px",
              width: "350px",
              padding: "12px",
              borderRadius: "8px",
              overflowY: "auto",
              scrollbarWidth: "none",
            }}
            spacing={2}
          >
            {notifications.map((notification) => {
              return (
                <Box sx={
                  {
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "8px",
                    borderRadius: "8px",
                    backgroundColor: "rgba(0,0,0,0.1)",
                  }

                }>
                  <Box sx={
                    {
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                      width: "100%",
                    }
                  }>
                    <Box sx={
                      {
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }
                    }>
                      <Box className='icon-type' sx={
                        {
                          width: "30px",
                          height: "30px",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: "rgba(0,0,0,0.2)",
                          padding: "4px",
                        }

                      } >
                        {
                          notification.type === 'friend' ? <PersonIcon /> : notification.type === 'game' ? <SportsEsportsIcon /> : <ChatBubbleOutlineIcon />
                        }
                      </Box>
                      <Typography sx={
                        {
                          "font-family": 'Rubik',
                        }
                      }> <span style={{ color: '#1b9ecd' }}>@{
                        notification.content.split(' ')[0]
                      } </span>
                        {notification.content.split(' ').slice(1).join(' ')}
                      </Typography>
                    </Box>
                    <ButtonGroup sx={
                      {
                        display: "flex",
                        justifyContent: "flex-end",
                      }

                    }>
                      <Button sx={
                        {
                          color: "#CD4A1B",
                          "font-family": 'Rubik',
                          "font-size": "small",
                        }
                      } onClick={
                        () => {
                          //console.log('clicked');
                          if (notification.type === 'GroupJoin') {
                            hadnleDeclineGroup(notification)
                          } else if (notification.type === 'friend') {
                            handleDeclinFriend(notification);
                          } else if (notification.type === 'game') {
                            handleDeclineGame(notification);
                          }
                        }
                      }>Decline</Button>
                      <Button sx={
                        {
                          color: "#1b9ecd",
                          "font-family": 'Rubik',
                          "font-size": "small",
                        }
                      } onClick={
                        () => {
                          // handleAcceptGroup(notification);
                          //console.log(`notification.type: ${notification.type}`) // `notification.type: ${notification.type}
                          if (notification.type === 'GroupJoin') {
                            handleAcceptGroup(notification)
                          } else if (notification.type === 'friend') {
                            handleAcceptFriend(notification);
                          } else if (notification.type === 'game') {
                            handleAcceptGame(notification);
                          }
                        }

                      }>Accept</Button>
                    </ButtonGroup>
                  </Box>
                </Box>
              );
            })}
          </Stack>
        </Menu>
      </Box>


    );
  }