import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './Style_Files/Style.css';
import { UserContext } from "../Context/main";
import { Box } from "@mui/material";
import { Typography, Button, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";




const GamePong = ({ socket }: { socket: any }) => {
    const navigate = useNavigate();
    const userCtx = useContext(UserContext);

 
    // useEffect(() => {
    //     if (userCtx === null || userCtx.username === 'default') {
    //         navigate('/');
    //     }
    //     else 
    //     {
    //         console.log(userCtx);
    //     }
    // }, []);

    return (
        <Box id="container" sx={
            {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                width: "100%",
                position: "fixed",
                top: "0",
                left: "0",
                backgroundColor: "rgba(0,0,0,0.5)",
                zIndex: 10010,
                boxShadow: "0 0 10px 0 rgba(0,0,0,0.5)",
            }
        } >
            <Box id="modal" sx={
                {
                    color: "black",
                    position: "relative",
                    width: "50%",
                    height: "40%",
                    backgroundColor: "white",
                    borderRadius: "10px",
                    padding: "20px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                    "@media (max-width: 800px)": {
                        width: "85%",
                        height: "85%",
                    },
                    maxWidth: "600px",
                }
            }>
                <Box id='header' sx={
                    {
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }
                }>
                    <span></span>
                    <Typography variant="h4" sx={
                        {
                            fontSize: "24px",
                            fontWeight: "400",
                            color: "#f8049cad",
                            fontFamily: "Anta",
                            textAlign: "center",
                        }
                    }>
                        Choose Game Mode

                    </Typography>
                    <IconButton>
                        <Close  onClick={() => { navigate('/'); } } />
                    </IconButton>
                </Box>
                <Box sx={
                    {
                        display: "flex",
                        gap: "20px",
                        width: "100%",
                        height: "100%",
                        overflowY: "auto",
                        flexDirection: "column",
                        padding: "20px",
                        boxSizing: "border-box",
                    }
                }>
                    <Button variant="contained" color="primary" sx={
                        {
                            backgroundColor: "#24a8af",
                            color: "white",
                            fontSize: "20px",
                            fontWeight: "400",
                            fontFamily: "Anta",
                            padding: "10px",
                            borderRadius: "10px",
                            boxShadow: "0 0 10px 0 rgba(0,0,0,0.5)",
                        }
                    } onClick={() => {
                        navigate('/Playground');
                    }}>
                        Play Vs Computer
                    </Button>
                    <Button variant="contained" color="primary" sx={
                        {
                            backgroundColor: "#24a8af",
                            color: "white",
                            fontSize: "20px",
                            fontWeight: "400",
                            fontFamily: "Anta",
                            padding: "10px",
                            borderRadius: "10px",
                            boxShadow: "0 0 10px 0 rgba(0,0,0,0.5)",
                        }
                    } onClick={() => {
                        navigate('/Gaming');
                    }}>
                        Play Vs Stranger
                    </Button>
                </Box>
            </Box>
        </Box>

    )
};

export default GamePong;
