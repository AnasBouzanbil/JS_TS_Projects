import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useContext } from 'react';
import {UserContext } from '../Context/main';
import { ArrowForward } from '@mui/icons-material';
import LoginIcon from '@mui/icons-material/Login';

const api ="https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-237d55966e695a4a59e0cc40d7cb4cae5f18bef5b1e9f3c73bcc85ed7bffe0de&redirect_uri=http%3A%2F%2F127.0.0.1%3A3000%2F&response_type=code"

export default function SignIn() {
  const user = useContext(UserContext)
  const [status, setStatus] = React.useState('Authenticating...');
  async function getAccessToken() {

    try {
      const searchParams = window.location.search;
      const url = "http://127.0.0.1:4000/auth/callback";
      const response = await fetch(`${url}${searchParams}`);
      const data = await response.json();
      localStorage.setItem('access_token', data.acces_token);
      user.access_token = data.access_token;
      window.location.href = "/";
    } catch (error: any) {
      //console.log(error.message);
      setStatus('Failed to fetch access token. Please try again.');
      window.location.href = "/";
    }
  }
  React.useEffect(()=>{
    if (window.location.search !== "")
      getAccessToken();
    else {
      setStatus('');
    }
  },[])
  return (
    <Stack sx={{justifyContent: "center"}}>
      <Button variant="contained" sx={
        {
          backgroundColor: "#24A8AF",
          color: "#fcfcf6",
          borderRadius: "15px",
          padding: "12px 24px",
          fontSize: "1rem",
          fontWeight: "bold",
          textTransform: "capitalize",
          transition: "all 0.2s ease-in-out",
          letterSpacing: "1px",
          fontFamily:"Rubik",
          '&:hover': {
            backgroundColor: "#166569",
          }
        }
      } href={api} >Login To Continue
      
        <LoginIcon sx={{marginLeft: "10px"}}/>

      </Button>
    </Stack>
  );
}