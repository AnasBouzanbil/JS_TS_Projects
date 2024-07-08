import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import React, { useState } from 'react';
import ChangeInfoForm from './ChangeInfoForm';
import Statistics from "./Statistics"
import LoadingPage from '../LoadingPage/LoadingPage';
import ProfileInfo from './ProfileInfo'
import { Divider, Stack } from '@mui/material/'
import History from './History';
import Achievement from './Achievement';
import AccountMenu from '../Home/Profile';
import Logo from '../Home/Logo';
import { UserContext } from '../Context/main';
import useProfileInfo from './Hooks/useProfile';
import { Link, useParams } from "react-router-dom";

export default function Profile(
    {
        friendsState,
        getFriends,
        socket,
        notifications,
        setNotifications
    }: {
        notifications: any,
        friendsState: any,
        getFriends: any,
        socket: any,
        setNotifications: any
    }

) {
    const {change} = useParams();
    console.log(`update_info: ${change}`);
    let [changeInfo, setChangeInfo] = useState(change === "update_info");
    const [loading, setLoading] = React.useState(false);
    const AuthUser = React.useContext(UserContext);
    const { error, loading2, setSrcImage, data, setData, srcImage } = useProfileInfo();
    React.useEffect(() => {
        getFriends()
      }, [])
    if (error) {
        return (
            <>
            <div id="app">
            <Logo />
            <AccountMenu getFriends={getFriends} socket={socket} notifications={notifications} setNotifications={setNotifications} username={AuthUser.username} image={AuthUser.image} />
        </div>
            <Box>
                <Typography variant="h3" component="h1" gutterBottom>
                    User not found
                </Typography>
            </Box>
            </>
        );
    }

    if (loading2) {
        return (
            <Box>
                <Typography variant="h3" component="h1" gutterBottom>
                    Loading...
                </Typography>
            </Box>
        );
    }


    return (
        <>

            {

                changeInfo ?
                    <ChangeInfoForm change={change === "update_info"} setSrcImage={setSrcImage} setLoading={setLoading} data={data} setChangeInfo={setChangeInfo} setData={setData}/>
                    :
                    <></>
            }
            <div id="app">
                <Logo />
                <AccountMenu getFriends={getFriends} socket={socket} notifications={notifications} setNotifications={setNotifications} username={AuthUser.username} image={AuthUser.image} />
            </div>
            <Box sx={{
                display: "flex",
                flexWrap: "wrap",
                margin: "auto",
                justifyContent: "center"
            }}>
                {
                    loading === true ? <LoadingPage /> : <>
                        <Box sx={
                            {
                                backgroundColor: "rgba(40,40,40,0.75)",
                                padding: "10px",
                                width: "1200px",
                                color: "white",
                                margin: "20px",
                                borderRadius: "20px"
                            }
                        }
                        >
                            <Stack direction={'row'} flexWrap={'wrap'} sx={
                                {
                                    '@media (max-width: 1200px)': {
                                        width: '100%',
                                        maxWidth: '800px',
                                        margin: "auto",
                                        direction: "column",
                                    }
                                }
                            }>
                                <Box width={'48%'} minWidth={'300px'} sx={
                                    {
                                        '@media (max-width: 1200px)': {
                                            width: '100%',
                                            margin: "auto",
                                            marginBottom: "20px"
                                        },
                                    }
                                }
                                >
                                    <ProfileInfo friendsState={friendsState} srcImage={srcImage} data={data} setChangeInfo={setChangeInfo} getFriends={getFriends} />
                                </Box>
                                <Divider sx={
                                    {
                                        borderWidth: "10px",
                                        borderRadius: "25px",
                                        margin: "10px",
                                        '@media (max-width: 1200px)': {
                                            width: '100%',
                                            margin: "auto",
                                        }
                                    }
                                } />
                                <Box width={'48%'} sx={
                                    {
                                        '@media (max-width: 1200px)': {
                                            width: '100%',
                                            margin: "auto",
                                        }
                                    }
                                }>
                                    <Statistics data={data} />
                                </Box>
                            </Stack>
                            
                            <Stack direction={'row'} sx={
                                {
                                    '@media (max-width: 1200px)': {
                                        width: '100%',
                                        maxWidth: '800px',
                                        margin: "auto",
                                        flexDirection: "column",
                                    }
                                }
                            }>
                                <Box width={'60%'} sx={
                                    {
                                        '@media (max-width: 1200px)': {
                                            width: '100%',
                                            margin: "auto",
                                        }
                                    }
                                }>
                                    <History data={data} />
                                </Box>
                                <Divider sx={
                                    {
                                        borderWidth: "10px",
                                        borderRadius: "25px",
                                        margin: "10px"
                                    }
                                } />
                                <Box width={'40%'} sx={
                                    {
                                        '@media (max-width: 1200px)': {
                                            width: '100%',
                                            margin: "auto",
                                        }
                                    }
                                }>
                                    <Achievement data={data} />
                                </Box>
                            </Stack>
                        </Box>

                    </>
                }
            </Box>

        </>

    );
}