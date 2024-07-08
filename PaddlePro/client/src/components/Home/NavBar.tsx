import * as React from 'react';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import VideogameAssetIcon from '@mui/icons-material/VideogameAsset';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import HomeIcon from '@mui/icons-material/Home';
import './NavBar.css'
import { useNavigate } from 'react-router-dom';

const BoxStyle = {
    width: 400,
}

export default function SimpleBottomNavigation() {
  const [value, setValue] = React.useState(0);
  const navigate = useNavigate();

  return (
    <Box sx={BoxStyle}>
      <BottomNavigation sx={{
        color: "white",
        borderRadius: "10px 10px 0  0",
      }}
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
          navigate(newValue === 0 ? "/" : newValue === 1 ? "/chat" : "/game")
        }}
      >
        <BottomNavigationAction label="Home" icon={<HomeIcon />} />
        <BottomNavigationAction label="Chat" icon={<ChatBubbleIcon />} />
        <BottomNavigationAction label="Game" icon={<VideogameAssetIcon />} />
      </BottomNavigation>
    </Box>
  );
}