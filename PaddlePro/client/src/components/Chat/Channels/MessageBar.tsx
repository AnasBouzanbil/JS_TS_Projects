import { Avatar, Divider, IconButton, Stack } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../Context/main";
import { ChannelInterface } from "../../Context/user";
import { More, MoreHoriz, MoreVert } from "@mui/icons-material";

interface MessageBarChannelProps {
  group: ChannelInterface;
  setSelectedChannel: React.Dispatch<React.SetStateAction<string>>;
  selectedChannel: string;
}

export function MessageBarChannel1({
  group,
  setSelectedChannel,
  selectedChannel,
}: MessageBarChannelProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Stack>
      <Stack
        direction={"row"}
        alignItems={"center"}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Stack
          direction={"row"}
          alignItems={"center"}
          sx={{
            width: "100%",
            padding: "10px",
            cursor: selectedChannel === group.name ? "default" : "pointer",

          }}
          onClick={() => {
            if (selectedChannel === group.name) return;
            setSelectedChannel(group.name);
            //console.log("selected channel", group.name);
          }}
        >
                  <Avatar
          src={group.image}
          sx={{
            margin: "5px 20px",
            marginLeft: "5px",
          }}
        />

        <Stack direction={"row"} alignItems={"center"} sx={
          {
            width: "100%",

          }
        }>
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
              <span>{group.name}</span>
            </Stack>
          </Stack>

        </Stack>
        </Stack>

      </Stack>
      <Divider sx={{ backgroundColor: isHovered ? "#3e5d91" : selectedChannel === group.name ? "#3e5d91" : "#222E35", height: "2px" }} />
    </Stack>
  );
}
