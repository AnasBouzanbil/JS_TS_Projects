import { Navigation } from "@mui/icons-material";
import { Avatar, Divider, Stack, Typography } from "@mui/material";
import { channel } from "diagnostics_channel";
import React from "react";
import { useNavigate } from "react-router-dom";

interface MessagesBarProps {
  // message: string;
  name: string;
  image: string;
  // online: boolean;
  // unread: number;

  roomId: number;
  unseenNum: number;
  setSelected: React.Dispatch<React.SetStateAction<string>>;
  isTyping: boolean
}

export default function MessagesBar({
  // message,
  name,
  image,
  // online,
  // unread,
  isTyping,
  setSelected
}: MessagesBarProps) {
  return (
    <Stack>
      <Stack
        direction={"row"}
        alignItems={"center"}
        sx={{
          padding: "10px",
          backgroundColor: "#",
          cursor: "pointer",
        }}
        onClick={() => {
          setSelected("");
        }}
      >
        <Avatar
          src={image}
          sx={{
            margin: "5px 20px",
            marginLeft: "5px",
          }}
        />
        <Stack>
          <Stack direction={"row"} alignItems={"center"}>
            <Stack
              sx={{
                color: "white",
              }}
              spacing={1}
            >
              <Stack
                sx={{
                  fontSize: "17px",
                }}
              >
                <span>{name}</span>
              </Stack>
              <Stack
                sx={{
                  fontSize: "14px",
                }}
              >
                <span>
                  {isTyping ? (
                    <Typography sx={{
                      color: "#fafaf3"
                    }}>
                      Typing...
                    </Typography>
                  ) : <></> }
                  {/* {message.length > 30 ? message.slice(0, 30) + "..." : message} */}
                </span>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
}
