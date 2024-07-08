import { Box, Typography } from "@mui/material";
import React, { useContext, useEffect } from "react";
import { UserContext } from "../Context/main";
import { Message as MessageInt } from "../Context/user";

const stylesM1 = {
  width: "fit-content",
  borderTopLeftRadius: "6px",
  borderTopRightRadius: "14px",
  borderBottomLeftRadius: "14px",
  borderBottomRightRadius: "6px",
  padding: "12px 15px",
  backgroundColor: "#2c2d31",
  fontFamily: '"Rubik", sans-serif',
  fontOpticalSizing: "auto",
  fontWeight: "400",
  fontStyle: "normal",
  margin: "5px 0",
  maxWidth: "60%",
  direction: "ltr",
  fontSize: "1rem",
  wordBreak: "break-all",
}

function Message1({ children, message, lastDiv }: { children: string, message: MessageInt, lastDiv: React.RefObject<HTMLDivElement>}) {
  return (
    <Box
      ref={lastDiv}
      sx={{
        width: "100%",
        direction: "ltr",
      }}
    >
      <Typography
        sx={stylesM1}
        variant="body1"
        component={"p"}
      >
        {children}
      </Typography>
            {/*Date*/}
            <Typography
        sx={{
          color: "#8A8A8A",
          fontSize: "0.8rem",
          textAlign: "left",
          margin: "0",
        }}
      >
        {
          new Date(message.created_on).toLocaleTimeString(
            "en-US",
            {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            }

          )
        }
      </Typography>
      
    </Box>
  );
}
const stylesM2 = {
  width: "fit-content",
  borderTopLeftRadius: "14px",
  borderTopRightRadius: "6px",
  borderBottomLeftRadius: "6px",
  borderBottomRightRadius: "14px",
  padding: "12px 15px",
  backgroundColor: "#1f90b8",
  margin: "5px 0",
  fontFamily: '"Rubik", sans-serif',
  fontOpticalSizing: "auto",
  fontWeight: "400",
  fontStyle: "normal",
  maxWidth: "60%",
  direction: "ltr",
  fontSize: "1rem",
  wordBreak: "break-all",
}


function Message2({ children, message, lastDiv }: { children: string, message: MessageInt, lastDiv: React.RefObject<HTMLDivElement>}) {
  return (
    <Box
      ref={lastDiv}
      sx={{
        width: "100%",
        direction: "rtl",
      }}
    >
      <Typography
        sx={stylesM2}
        variant="body1"
        component={"p"}
      >
        {children}
      </Typography>
      {/*Date*/}
      <Typography
        sx={{
          color: "#8A8A8A",
          fontSize: "0.8rem",
          textAlign: "right",
          margin: "0",
        }}
      >
        {
          new Date(message.created_on).toLocaleTimeString(
            "en-US",
            {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            }

          )
        }
      </Typography>

    </Box>
  );
}

export default function Message({
  children,
  sender,
  message,
  previousMessage,
  lastDiv
}: {
  children: string;
  sender: string;
  message: MessageInt;
  previousMessage: MessageInt;
  lastDiv: React.RefObject<HTMLDivElement>;
}) {
  const AuthUser = useContext(UserContext);
  const [showDate, setShowDate] = React.useState(false);

  // else {
  //   setShowDate(new Date(message.created_on).getDate() !== new Date(dateLastMessage).getDate());
  // }
  useEffect(() => {
    if (previousMessage === undefined ) {
      setShowDate(true);
    } else {
      setShowDate(new Date(message.created_on).getDate() !== new Date(previousMessage.created_on).getDate());
    }
  }
  ,[message]);

  return sender === AuthUser.username ? (
    <>
      {
        showDate ? (
          <Typography
            sx={{
              color: "#8A8A8A",
              fontSize: "0.8rem",
              textAlign: "center",
              margin: "10px 0",
            }}
          >
            {
              new Date(message.created_on).toLocaleDateString(
                "en-US",
                {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }
              )
            }
          </Typography>
        ) : null
      }
      <Message2 lastDiv={lastDiv} children={children} message={message}/>
    </>
  ) : (
    <>
          {
        showDate ? (
          <Typography
            sx={{
              color: "#8A8A8A",
              fontSize: "0.8rem",
              textAlign: "center",
              margin: "10px 0",
            }}
          >
            {
              new Date(message.created_on).toLocaleDateString(
                "en-US",
                {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }
              )
            }
          </Typography>
        ) : null
      }
    <Message1 lastDiv={lastDiv} children={children} message={message}/>
    </>
  );
}
