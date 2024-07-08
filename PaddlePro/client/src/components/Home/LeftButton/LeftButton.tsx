import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import BasicTabs from './FriendsList';
import "./Buttons.css";
import './LeftButton.css';
import { BackHand } from '@mui/icons-material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { UserContext } from '../../Context/main';
import { get } from 'lodash';
export default function LeftButton({friendsState, setFriendsState, getFriends}:any) {
  const [state, setState] = React.useState(false);
  const user = React.useContext(UserContext);



    function toggleDrawer(open: boolean) {
      return function(event: React.KeyboardEvent | React.MouseEvent) {
        if ((event as React.KeyboardEvent).key === 'Shift') {
          return;
        }
        if (open === true) {
          getFriends();
        }
        setState(open);
      };
    }


  return (
    <Box sx={
      {
        
      }
    }>
        <button style={
          {

            borderRadius: "10px 0 10px 0 ",
            transform: "translate(0, -50%)",
            position: "absolute",
            top: "50%",
            left: "5%",
            zIndex: "100"

          }
        } onClick={toggleDrawer(true)} className="button">
          <div className="overlay">
            <ArrowBackIcon />
          </div>
          <span className='span-text-button' style={
            {
              color: "#121212",
              width: "100%",
              textAlign: "left",
              paddingBlock: "12px",
              paddingLeft: "24px",
              zIndex: 2,
              transition: "all 200ms ease",
            }
          }>Friends</span>
        </button>
        <Drawer
          anchor={'left'}
          open={state}
          onClose={toggleDrawer(false)}
          sx={{background: "none"}}
        >
          <Box
            onKeyDown={toggleDrawer(false)}
          >
            <BasicTabs setFriendsState={setFriendsState} friendsState={friendsState} getFriends={getFriends}/>
          </Box>
        </Drawer>
    </Box>
  );
}