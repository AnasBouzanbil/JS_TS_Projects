import React, { useContext } from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import { Link } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import NotificationBar from './NotificationBar';
import SettingsComponent from './Settings';

export default function AccountMenu({ username, image, notifications, setNotifications, socket, getFriends }: {
  image: string, username: string,
  notifications: any[], setNotifications: React.Dispatch<React.SetStateAction<any[]>>,
  socket: any,
  getFriends: any
}) {
  const user = {
    username: username
  }
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const [displaySettings, setDisplaySettings] = React.useState(false);


  return (
    <React.Fragment>
      {
        displaySettings ? (
          <SettingsComponent setDisplaySettings={setDisplaySettings} />
        ) : (
          <div></div>
        )
      }
      {
        /*
  
          Notification icon will be added here
          It will be a button that will open a dialog box
          just like the account settings button
          Copy Paste
  
          And then do it with backend
  
          Make Search bar responsive
          Make the search bar work with backend
  
        */
      }
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>

        <NotificationBar notifications={notifications} setNotifications={setNotifications} socket={socket} getFriends={getFriends} />
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            sx={{ ml: 2 }}>
            <Avatar src={image} sx={{ width: 70, height: 70 }} alt="User Image" />
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
      >
        <MenuItem >
          <Link to={`/profile/${user.username}`} style={{
            textDecoration: "none", color: "white", display: 'flex', justifyContent: "center"
            , alignItems: "center"
          }} >
            <ListItemIcon>
              <AccountCircleIcon htmlColor='white' />
            </ListItemIcon>
            Profile
          </Link>
        </MenuItem>
        <Divider />
        <MenuItem onClick={
          () => {
            setDisplaySettings(true);
          }
        }>
          <ListItemIcon>
            <Settings fontSize="small" htmlColor='white' />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem onClick={() => {
          localStorage.removeItem("access_token");
          window.location.href = "/"; // Redirect to login page using navigate
        }}>
          <ListItemIcon>
            <Logout fontSize="small" htmlColor='white' />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}
