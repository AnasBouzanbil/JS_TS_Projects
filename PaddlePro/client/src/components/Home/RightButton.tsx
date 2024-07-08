import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import "./LeftButton/Buttons.css";
import LastMatchesTabel from './LastMatchesTabel';
import { ArrowForward } from '@mui/icons-material';

export default function RightButton() {
  const [state, setState] = React.useState(false);



    function toggleDrawer(open: boolean) {
      return function(event: React.KeyboardEvent | React.MouseEvent) {
        if ((event as React.KeyboardEvent).key === 'Shift') {
          return;
        }
        setState(open);
      };
    }


  return (
    <Box sx={
      {
        
          boxSizing: "border-box",
        
      }
    }>
        <button style={
          {
            borderRadius: "10px 0 10px 0 ",
            position: "absolute",
            top: "50%",
            right: "5%",
            transform: "translate(0, -50%)",
          }
        } onClick={toggleDrawer(true)} className="button">
          <span style={
            {
              color: "#121212",
              width: "100%",
              textAlign: "left",
              paddingBlock: "12px",
              paddingLeft: "24px",
              zIndex: 2,
              transition: "all 200ms ease",
            }
          } className='span-text-button'>Matches</span>
          <div className="overlay">
            <ArrowForward />
          </div>
        </button>
        <Drawer
          anchor={'right'}
          open={state}
          onClose={toggleDrawer(false)}




          sx={{background: "none"}}
        >
          <Box
            // sx={{ width: "400px", height: "200px", position: "relative", background: "none",    transform: "translate(0, -50%)",top: "50%",left: 0}}

            onKeyDown={toggleDrawer(false)}
          >
            <LastMatchesTabel />
          </Box>
        </Drawer>
    </Box>
  );
}