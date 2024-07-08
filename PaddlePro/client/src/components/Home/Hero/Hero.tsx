import { Box, Button, Stack, Typography } from '@mui/material'
import React from 'react'
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import './Hero.css'
import InviteFriendToGame from './InviteFriendToGame';
import { Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Lottie from 'react-lottie';
import animationData from '../Animation.json';
// import Typewriter from 'typewriter-effect';
import { Typewriter } from 'react-simple-typewriter'
import { FriendsState } from '../../Context/user';




const Hero = ({ socket, isLoggedIn, friendsState }: {socket: any, isLoggedIn: boolean, friendsState:FriendsState}) => {
    const [showInviteFriendToGame, setShowInviteFriendToGame] = React.useState(false);
    const handleShowInviteFriendToGame = () => {
        setShowInviteFriendToGame(true);

    }

    return (

        <>
            {
                showInviteFriendToGame && <InviteFriendToGame friendsState={friendsState} socket={socket} setShowInviteFriendToGame={setShowInviteFriendToGame} />
            }
            <Stack className="hero" sx={
                {
                    width: "100%",
                    position: "relative",
                    gridTemplateColumns: "repeat(2,1fr)",
                    alignItems: "center",
                    gap: "4rem",
                    padding: "0 19%",
                    display: 'flex',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    flexWrap: 'wrap',
                    marginBottom: "100px",
                    textAlign: "center",
                    marginTop: "100px",
                    "@media (min-width: 1200px)": {
                        flexDirection: "row",
                        padding: "0 5%",
                        justifyContent: "space-between",
                        'WebkitFlexWrap': 'nowrap',
                        textAlign: "left",
                        width: "80%",
                        height: "257px",
                    }
                }

            }>
                {
                    /* hero-text */
                }
                <Box sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "2rem",
                    width: "100%",
                }}>
                    <Box height={300}>
                    <Typography sx={
                        {
                            fontFamily: "Anta",
                            fontSize: "2.5rem",
                            fontWeight: "bold",
                            color: "#fcfcf6",
                            "@media (min-width: 1200px)": {
                                fontSize: "3.5rem",
                            }
                        }
                    }>
                        Embark on a journey where every 
                        <span className='text-change-color'> 
                        
                        <Typewriter
                            words={['click', 'move', 'decision']}
                            loop={3}
                            cursor
                            cursorStyle='_'
                            typeSpeed={70}
                            deleteSpeed={50}
                            delaySpeed={4000}
                        />
                        </span>
                        shapes your destiny.
                    </Typography>
                    </Box>

                    {
                        isLoggedIn &&

                        <Box sx={
                            {
                                // border: "1px solid #304ffe",


                                width: "fit-content",
                                margin: "auto",

                                "@media (min-width: 1200px)": {
                                    margin: "0",
                                }
                            }
                        }>
                            <Button onClick={
                                () => {
                                    handleShowInviteFriendToGame();
                                }

                            } id='main-btn' className='btn-2' sx={
                                {
                                    color: "white",
                                    borderRadius: "15px",
                                    padding: "18px 36px",
                                    backgroundColor: "#24A8AF",
                                    transition: "all 0.2s ease-in-out",
                                    '&:hover': {
                                        backgroundColor: "#166569",
                                    },
                                    "@media (min-width: 1200px)": {
                                        padding: "15px 30px",
                                        fontSize: "1.2rem",
                                    }
                                }
                            }>
                                <Typography sx={{
                                    fontFamily: "Anta",
                                    fontSize: "1.5rem",
                                    fontWeight: "500",
                                }}>Play Now</Typography>
                                <PlayArrowIcon sx={
                                    {
                                        marginLeft: "10px",
                                        fontSize: "1.5rem",
                                        "@media (min-width: 1200px)": {
                                            fontSize: "1.2rem",
                                        }
                                    }
                                } />
                            </Button>
                        </Box>
                    }



                </Box>
                {
                    /* hero-img */
                }
                <Box sx={
                    {
                        height: "auto",
                        "@media (max-width: 800px)": {
                            display: "none",
                        }
                    }
                }>
                    {/* <img style={{
            }} src="/static/controller.png" alt="controller" /> */}
                    <Lottie
                        options={
                            {
                                loop: true,
                                autoplay: true,
                                animationData: animationData,
                                rendererSettings: {
                                    preserveAspectRatio: "xMidYMid slice"
                                }
                            }
                        }
                        height={300}
                        width={300}
                    />
                </Box>
            </Stack >
        </>

    )
}

export default Hero
