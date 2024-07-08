import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import { Divider } from '@mui/material';
import { Link } from 'react-router-dom';
import useLastMatches from './Hooks/useLastMatches';

export default function LastMatchesListHistory(props: any) {
    const { data } = props;
    const { listFriends } = useLastMatches(data.username);

    return (
        <MenuList sx={
            {
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                padding: "10px",
                width: "100%",
                margin: "0",
                overflowY: "overlay",
                maxHeight: "500px",
                "&::-webkit-scrollbar": {
                    width: "5px",
                },
            }
        }>
            {
                listFriends.length === 0 ?
                    <MenuItem disableTouchRipple sx={{ display: "flex", cursor: "default", justifyContent: "center", alignItems: "center", padding: "10px 0", width: "100%", margin: "0" }}>
                        No matches found
                    </MenuItem>
                    :

                    listFriends.map(
                        (friend: any, key: number) => {
                            return (
                                <MenuItem disableTouchRipple key={key} sx={
                                    {
                                        display: "flex",
                                        flexDirection: "column",
                                    }
                                }>
                                    {
                                        key !== 0 && <Divider sx={
                                            {
                                                width: "100%",
                                                margin: "0",
                                                padding: "0",
                                                borderWidth: "1px",
                                                borderRadius: "25px",
                                                backgroundColor: "rgba(255,255,255,0.4)",
                                                '@media (max-width: 1200px)': {
                                                    width: '100%',
                                                    margin: "auto",
                                                }
                                            }

                                        } />
                                    }
                                    <Box sx={{
                                        cursor: "default",
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        padding: "10px 0",
                                        width: "100%",
                                        margin: "0",
                                        direction: "column",
                                        dispay: "flex",
                                    }} >

                                        <Box sx={
                                            {
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                flexDirection: "row",
                                            }
                                        }>
                                            <Link to={`/profile/${friend.playerO.username}`}>
                                                <Avatar alt={`${friend.playerO.username}'s image`} src={friend.playerO.image} />
                                            </Link>
                                            <ListItemText sx={{ padding: "0 10px" }}
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
                                                justifyContent: "center",
                                                alignItems: "center",
                                                flexDirection: "row",
                                            }
                                        }>
                                            <ListItemText sx={{ padding: "0 10px" }}
                                            >{friend.playerT.username}</ListItemText>
                                            <Link to={`/profile/${friend.playerT.username}`}>
                                                <Avatar alt={`${friend.playerT.username}'s image`} src={friend.playerT.image} />
                                            </Link>
                                        </Box>
                                    </Box>
                                </MenuItem>
                            )
                        }
                    )
            }
        </MenuList>
    );
}