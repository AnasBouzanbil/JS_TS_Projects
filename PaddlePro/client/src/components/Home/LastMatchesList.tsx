import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { Link } from 'react-router-dom';

export const StyledBadge = styled (Badge) (() => ({
    '& .MuiBadge-badge': {
      backgroundColor: 'rgb(100 217 86)'
    }
}));

export default function LastMatchesList() {
    const [listFriends, setListFriends] = React.useState<any>([]);

    const getLastMatches = async () => {
        try {
            const response = await fetch('http://localhost:4000/game/last', 

                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                    }

                }
            );
            if (!response.ok) {
                throw new Error('Response was not ok');
            }
            const data = await response.json();
            setListFriends(data.games);
        }
        catch (error) {
            console.log(error);
        }

    }

    React.useEffect (() => {
        getLastMatches();
    }
    , []);
  return (
    <MenuList disableListWrap disablePadding  disabledItemsFocusable>
        {
            listFriends.map(
                (friend:any, id: number) => {
                    return (
                        <MenuItem key={id} disableGutters disableRipple disableTouchRipple  sx={{
                            cursor: "default",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "10px 0",
                            borderBottom: "1px solid black",
                            width: "100%",
                            margin: "0",
                            "&:hover": {
                                backgroundColor: "rgb(255,255 , 255)"
                            }

                            }} >
                            <Box sx={
                                {
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    flexDirection: "column",
                                }
                            }>
                                <Link to={`/profile/${friend.playerO.username}`}>
                                    <Avatar alt={`${friend.playerO.username}'s image`} src={friend.playerO.image} />
                                </Link>
                                <ListItemText sx={{padding: "0 10px"}}
                                >{friend.playerO.username}</ListItemText>
                            </Box>

                            <Box sx={
                                {
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    gap: "10px",
                                    padding: "0 10px",
                                    fontSize: "18px", fontWeight: "500", fontFamily: "Anta"
                                }
                            }>
                                {
                                    friend.playerOScore
                                }
                                <span> 
                                    vs
                                </span>

                                {
                                    friend.playerTScore
                                }
                            </Box>

                            <Box sx={
                                {
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    flexDirection: "column",
                                }
                            }>
                                    <Link to={`/profile/${friend.playerT.username}`}>
                                    <Avatar alt={`${friend.playerT.username}'s image`} src={friend.playerT.image} />
                                </Link>
                                <ListItemText sx={{padding: "0 10px"}}
                                >{friend.playerT.username}</ListItemText>
                            </Box>
                        </MenuItem>
                    )
                }
            )
        }
    </MenuList>
  );
}