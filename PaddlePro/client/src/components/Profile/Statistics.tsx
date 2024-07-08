import * as React from 'react';
import { Box, Slider, Typography, colors, useColorScheme } from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';
import "./Statistics.css"
import { UserContext } from '../Context/main';

interface DataInterface {
    wins: number;
    losses: number;
}

export default function Statistics({data}:any) {
    const AuthUser = React.useContext(UserContext);
    
    const [radius, setRadius] = React.useState(10);
    const handleRadius = (event: Event, newValue: number | number[]) => {
        if (typeof newValue !== 'number') {
          return;
        }
        setRadius(newValue);
      };
    const asd : DataInterface = {
        wins: parseInt(data.win),
        losses: parseInt(data.lose),
    }

    return (
        <Box sx={
            {
                padding: "20px",

            }
        }>
              <Typography
        sx={{
          textAlign: "center",
        }}
        variant="h5"
        component="h3"
        gutterBottom
      >
        Statistics
      </Typography>
        <Box sx={
            {
                display: "flex",
                flexDirection: "row",
                gap: "1rem",
                color: "white",
                justifyContent: "center",
                alignItems: "center",
                margin: "20px"
            }
        }
        >
            
            {
                asd.losses === 0 && asd.wins === 0 ?
                <Typography variant="h6" component="p" gutterBottom sx={
                    {
                        color: "white",
                        fontSize: "1.2rem",
                        textAlign: "center",
                    }
                
                }>
                    No statistics available !
                </Typography>
                :
                <PieChart
                    series={[
                        {
                            data: [
                                { id: 0, value: asd.wins, label: 'wins' },
                                { id: 1, value: asd.losses, label: 'losses' },
                            ],
                        },
                    ]}
                    width={400}
                    height={200}
                />
            }
            {/* <Box
            sx={{
                textAlign: "center",
            }}>
                <Typography variant="h5" component="h2" gutterBottom>
                    Statistics
                </Typography> */}
                {/* <Box sx={
                    {
                        backgroundColor: "rgba(40,40,40,0.75)",
                        color: "white",
                        padding: "40px",
                        borderRadius: "20px"
                    }
                }>
                    <Typography variant="body1" component="p" gutterBottom>
                        Total number of wins: {data.wins}
                    </Typography>
                    <Typography variant="body1" component="p" gutterBottom>
                        Total number of losses: {data.losses}
                    </Typography>
                    <Typography variant="body1" component="p" gutterBottom>
                        Total number of draws: {data.draws}
                    </Typography>
                </Box> */}
            {/* </Box> */}
        </Box>
        </Box>
    )
    
}