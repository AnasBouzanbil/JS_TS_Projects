import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import ListItemText from '@mui/material/ListItemText';
import PenddingMenu from './PenddingMenu';
import Avatar from '@mui/material/Avatar';
import { UserContext } from '../../Context/main';
import * as React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { FriendsState } from '../../Context/user';

export default function TestFriendsList({setFriendsState, friendsState}:{
    setFriendsState: any,
    friendsState: FriendsState
}) {
    const AuthUser = React.useContext(UserContext);

    const friendsContent = friendsState.SentRequests.map((friend, index) => (
      <Box key={index} sx={{
        padding: "0",
      }}>
        <MenuItem sx={{ cursor: "default" , padding: "20px 10px" }}>
          <Link to={`/profile/${friend.user}`}>

          <Button
            sx={{
              borderRadius: "50%",
              padding: "0",
              minWidth: "0",
            }}
          >
            <Avatar
              alt="Remy Sharp"
              src={friend.image}
              // sx={{ filter: "grayscale(100%)" }}
            />
          </Button>
          </Link>
          <ListItemText sx={{ padding: "0 10px" }}>
            {friend.user}
          </ListItemText>
          <PenddingMenu setFriendsState={setFriendsState} friend={friend}/>
        </MenuItem>
      </Box>
    ));
  
    return (
      <MenuList
        sx={{
          padding: "0",
        }}
      >
        {friendsContent.length === 0 ? (
          <Typography
          
          sx={
            {
              padding: "20px",
              textAlign: "center"
            }
          }
          >
            No Pandding
          </Typography>
        ) : (
          friendsContent
        )}
      </MenuList>
    );
  }