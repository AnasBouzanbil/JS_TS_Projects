import { Box, CircularProgress } from "@mui/material";


export default function LoadingPage () {
    return (
        <Box
            sx={
                {
                    position: "absolute",
                    width: "100vw",
                    height: "100vh",
                    backgroundColor: "rgba(0,0,0,0.75)",
                    top: 0,
                    left: 0,
                    zIndex: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }
            }
        >

            <CircularProgress size={"80px"}/>

        </Box>
    )
}