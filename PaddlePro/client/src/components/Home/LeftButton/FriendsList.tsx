import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import TestFriendsList from './TestFriendsList';
import TestPenddingList from './TestPenddingList';
import Paper from '@mui/material/Paper';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{  }}>
          <Paper>
          {children}
          </Paper>
        </Box>
      )}
    </div>
  );
}

export default function BasicTabs({friendsState, setFriendsState, getFriends}:any) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "400px", margin: "auto" }}>
      <Box>
        <Tabs value={value} onChange={handleChange}>
          <Tab sx={{ width: "50%"}} label="Friends"/>
          <Tab sx={{ width: "50%"}} label="Pendding"/>
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0} >
          <TestFriendsList friendsState={friendsState} getFriends={getFriends}/>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
          <TestPenddingList setFriendsState={setFriendsState} friendsState={friendsState}/>
      </CustomTabPanel>
    </Box>
  );
}
