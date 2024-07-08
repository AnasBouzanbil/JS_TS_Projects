import * as React from 'react';
import Box from '@mui/material/Box';
import LastMatchesList from './LastMatchesList';

export default function LastMatchesTabel() {

  return (
    <Box sx={{ width: "400px", margin: "auto" }}>
      <Box sx={
        {
            width: "100%", 
            display: "flex", 
            justifyContent: "center", 
            backgroundColor: "white", 
            position: "relative",
            top: "0",
            left: "0",
            zIndex: 1,
            boxShadow: "0px 0px 10px 0px black",
            marginBottom: "10px",
            padding: "10px 0",
            borderBottom: "1px solid black",
            textTransform: "uppercase",
    }
      }>
        Last Matches
      </Box>
      <Box
        sx={{
            padding: "10px 20px",

        }}
        >
            <LastMatchesList />
        </Box>
    </Box>
  );
}
