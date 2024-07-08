import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import './PenddingMenu.css'
import { Link } from 'react-router-dom';
import { Friend } from '../../Context/user';
import { UserContext } from '../../Context/main';

export default function PenddingMenu({ friend, setFriendsState }: { friend: Friend, setFriendsState: any }) {
  const AuthUser = React.useContext(UserContext);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton
        onClick={handleClick}
      >
        <MoreVertIcon sx={{}} />
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
        <MenuItem >
          <Link style={
            {
              textDecoration: 'none',
              color: 'white'
            }
          } to={`/profile/${friend.user}`}>View profile</Link>
        </MenuItem>
      </Menu>
    </div>
  );
}