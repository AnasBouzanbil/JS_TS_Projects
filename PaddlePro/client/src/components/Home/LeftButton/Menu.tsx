import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AlertDialog from './Dialog';
import { Link } from 'react-router-dom';

export default function LongMenu({ name }: { name: string }) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton onClick={handleClick}>
        <MoreVertIcon sx={{}} />
      </IconButton>

      <Menu anchorEl={anchorEl} open={open} onClose={handleClose} >
        <Link style={
            {
              textDecoration: 'none',
              color: 'white'
            }
          } to={`/chat/${name}`}>
        <MenuItem onClick={handleClose}>
          Chat
        </MenuItem>
        </Link>
        <Link style={
          {
            textDecoration: 'none',
            color: 'white'
          }
        } to={`/profile/${name}`}><MenuItem onClick={handleClose}>View profile</MenuItem></Link>
      </Menu>

    </div>
  );
}