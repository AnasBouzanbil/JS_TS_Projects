import { Box, TextField, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../Context/main";
import { toast } from "react-toastify";

export async function fetchForNotifications(socket: any) {
  if (socket === null) {
    return;
  }
  if (socket === undefined) {
    return;
  }
  socket.emit("Notifications", '');
}


export function NotFoundPage() {
  return (
    <div className="error-container flex justify-center  flex-col">
      <h1 style={{ fontSize: '5rem', marginBottom: '10px', color: '#ff5252' }}>
        404
      </h1>
      <p style={{ fontSize: '1.5rem', marginBottom: '20px' }}>
        Oops! The page you're looking for doesn't exist.
      </p>
      <Button variant="contained" color="primary">
        <Link to="/" style={{ textDecoration: 'none', color: '#fff',
        backgroundColor: '#ff5252',
        padding: '10px 20px',
        borderRadius: '5px' ,
        textAlign: 'center',
        textSizeAdjust: '100%',
        display: 'inline-block',
        }}>
          Go back to Home
        </Link>
      </Button>
    </div>
  );
};

type TwoFactorAuthProps = {
  show2fa: boolean;
  code: string;
  setCode: any;
  setShow2fa: any;
  firstTime: boolean;
}


export function TwoFactorAuth(props: TwoFactorAuthProps) {
  const show2fa = props.show2fa;
  const code = props.code;
  const setCode = props.setCode;
  const setShow2fa = props.setShow2fa;
  const firstTime = props.firstTime;
  const AuthUser = useContext(UserContext);
  const nagigate = useNavigate();

  const handleTwoFactorAuth = async (code: string) => {
    try {
      const url = "http://localhost:4000/2fa/verify";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${AuthUser.access_token}`
        },
        body: JSON.stringify({ token: code })
      });
      if (response.ok === false) {
        toast.error("Error: code is invalid")
        return;
      }
      const data = await response.json();
      toast.success("2fa enabled");
      AuthUser.access_token = data.access_token;
      window.localStorage.setItem("access_token", data.access_token);
      setShow2fa(false);
    }
    catch (error) {
      toast.error(`Error: code is invalid`)
    }
  }

  useEffect(() => {

      firstTime && nagigate(`/profile/${AuthUser.username}/update_info`);

  }
  , [firstTime]);


  return <>
    {
      show2fa ? <ContainerFloat>
        <Box sx={
          {
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "20px 40px",
            backgroundColor: "white",
            color: "black",
            borderRadius: "10px",
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
            fontFamily: "Poppins",
            fontWeight: "bold",
            gap: "20px"
          }

        }>
          <Typography>Authenticate with the code of the authenticator app</Typography>
          <TextField sx={
            {
              color: "black",
            }
          } value={code} onChange={(e) => { setCode(e.target.value) }} type="text" placeholder="Enter the code" />
          <Button onClick={
            () => {
              handleTwoFactorAuth(code)
            }
          } variant="contained" color="primary">Submit</Button>
        </Box>
      </ContainerFloat>
        : null

    }

  </>


}

export default function ContainerFloat({ children, change }: { children: any, change? : boolean | undefined }) {
  return (
    <div
      style={
        {
          position: "fixed",
          top: "0",
          right: "0",
          zIndex: 10000,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100%",
          backgroundColor: change === undefined ? "rgba(0,0,0,0.5)" : change === true ? "rgba(0,0,0,1)" : "rgba(0,0,0,0.5)",
        }
      }
    >
      {children}
    </div>
  )
}