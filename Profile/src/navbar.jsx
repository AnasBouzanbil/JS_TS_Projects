import React from "react";
import Avatar from '@mui/material/Avatar';
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Tooltip from '@mui/material/Tooltip';
import { useState, useEffect } from "react";
import './abou.jpg'
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';



export default function Navbar() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const image = './abou.jpg';
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="bg-every flex justify-end fixed">
      <Button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
     <Tooltip showArrow title="Anas Bouzanbil" style={{fontSize: '1rem', fontFamily: 'Arial', fontWeight: 'bold'}}>
      <Avatar 
        alt="Remy Sharp"
        img src="https://cdn.discordapp.com/attachments/1194621408727285790/1233356355197341697/457566_j4bqaeGu_1.png?ex=6634b51d&is=6633639d&hm=4047a28f907e1750f209ac21653ec27ad89df05ceede7e10ecc6c8bc5680952c&"
        sx={{
          width: { xs: 30, sm: 30, md: 30, lg: 40, xl: 40,},
          height: { xs: 30, sm: 30, md: 30, lg: 40, xl: 40},
          cursor: 'pointer',
          ":hover": {
            transform: 'scale(1.1)'
          }
        }}
      />
    </Tooltip>
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={handleClose}  sx={{ fontSize: '15px', padding: '5px' }}>Profile</MenuItem>
        <MenuItem onClick={handleClose}  sx={{ fontSize: '15px', padding: '5px' }}>My account</MenuItem>
        <MenuItem onClick={handleClose}  sx={{ fontSize: '15px', padding: '5px' }}>Logout</MenuItem>
      </Menu>
    </div>
  );
  }
