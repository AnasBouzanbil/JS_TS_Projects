import { Avatar, Box, Button, IconButton, Stack, Typography } from "@mui/material";
import { ChannelInterface, FriendsState } from "../../../Context/user";
import { MessageBarChannel1 } from "../MessageBar";
import { ArrowBack, MoreHorizSharp, MoreVert } from "@mui/icons-material";
import ChannelListMembers from "./ChannelMembers";
import Settings from "@mui/icons-material/Settings";
import ChannelSettings from "./ChannelSettings";
import { channel } from "diagnostics_channel";
import ChannelAddFriend from "./ChannelAddFriend";


export default  function HeaderChannelBar(
    {
        chat,
        setSelectedChannel,
        setGroups,
        friendsState,
        setFriendsState
    } : {
        chat: ChannelInterface,
        setSelectedChannel: React.Dispatch<React.SetStateAction<string>>
        setGroups: React.Dispatch<React.SetStateAction<ChannelInterface[]>>,
        friendsState: FriendsState,
        setFriendsState: React.Dispatch<React.SetStateAction<FriendsState>>
    }
)
{
    return (
        <>
            <Stack direction={'row'}>
                <Box sx={{
                    display: 'none',
                    justifyContent: 'center',
                    alignItems: 'center',
                    '&:hover': {
                        cursor: 'pointer'
                    },
                    '@media (max-width: 800px)': {
                        display: 'flex'
                    },
                    width: '0'

                }}>
                    <IconButton onClick={
                        () => {
                            setSelectedChannel("");
                        }
                    } sx={
                        {
                            transform: 'translate(-20px, 0px)',
                        }
                    }>
                        <ArrowBack sx={
                            {
                                color: '#FCFCF6'
                            }
                        } />
                    </IconButton>
                </Box>
                <Stack direction={'row'} justifyContent={'space-between'} sx={
                    {
                        backgroundColor: '#222E35',
                        padding: '10px',
                        gap: '10px',
                        borderRadius: "25px",
                        width: "100%",
                    }
                }>
                    <Stack
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    spacing={3}
                    sx={{
                    }}
                    >
                        <Avatar src={chat.image} />
                        <Box>
                            <Typography>{chat.name}</Typography>
                            {/* <Typography>{user.online ? "online" : "offline"}</Typography> */}
                        </Box>
                    </Stack>
                    <Stack className="members" sx={
                        {
                            justifyContent: 'center',
                            alignItems: 'center',
                            display: 'flex',
                            flexDirection: 'row',
                            '&:hover': {
                                cursor: 'pointer'
                            }
                            
                        }
                    }>
                        <ChannelAddFriend chat={chat} friendsState={friendsState}/>
                        <ChannelListMembers chat={chat} setFriendsState={setFriendsState} friendsState={friendsState}/>
                        <ChannelSettings setSelecteChannel={setSelectedChannel} channel={chat} setGroups={setGroups} />
                    </Stack>
                </Stack>
            </Stack>

        </>
    );
}