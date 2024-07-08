import { Avatar, Divider, Stack, Typography } from "@mui/material";
import { useContext } from "react";
import { UserContext } from "../Context/main";
import { StyledBadge } from "../Home/LastMatchesList";

interface NormalProps {
  // message: string;
  name: string;
  image: string;
  // online: boolean;
  // unread: number;
  isSelected: boolean;
  roomId: number;
  setSelected: React.Dispatch<React.SetStateAction<string>>;
  selected: string;
  unseenNum: number;
  online: boolean;
  isTyping: boolean;
}

export default function Normal({
  name,
  image,
  online,
  setSelected,
  unseenNum,
  isSelected,
  isTyping
}: NormalProps) {
  console.log(isSelected);

  return (
    <Stack>
      <Stack
        direction={"row"}
        alignItems={"center"}
        sx={{
          padding: "10px",
          cursor: "pointer",
          backgroundColor: isSelected ? "#16556beb" : "#111B21",
          '&:hover': {
            backgroundColor: "#16556beb"
          },
          gap: "10px",
        }}
        onClick={() => {
          if (isSelected) {
            setSelected("");
          }
          else {

            setSelected(name);
          }
        }}

      >

        {
          online ? (
            <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              variant="dot"
            >
              <Avatar
                alt="profile image"
                src={image}
              />
            </StyledBadge>
          ) : (
            <Avatar
              src={image}
              alt="profile image"
            />
          )
        }
        <Stack sx={
          {
            width: '100%',
            justifyContent: 'space-between',
          }
        } direction={'row'} >

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
              <Stack
                sx={{
                  fontSize: "14px",
                  height: "20px",
                  overflow: "hidden",
                }}
              >
                <span>
                  {isTyping && isSelected? (
                    <Typography sx={{
                      color: "#fafaf3",
                      height: "5px",
                      fontSize: "12px",
                    }}>
                      Typing...
                    </Typography>
                  ) : <></> }
                  {/* {message.length > 30 ? message.slice(0, 30) + "..." : message} */}
                </span>
            </Stack>
            </Stack>
          </Stack>
          <Stack
            sx={{
              color: "white",
              fontSize: "12px",
            }}
            justifyContent={'center'}

          >
            {
              isSelected ?
                <></> :
                unseenNum > 0 ? (
                  <span style={
                    {
                      color: "#1F90B8",
                      // backgroundColor: "#1F90B8",
                      borderRadius: "50%",
                      padding: "5px",
                      // color: "white",
                      fontSize: "15px",
                      fontFamily: "'Rubik', sans-serif",
                      fontWeight: 700,
                    }
                  }>{unseenNum} </span>
                ) : (
                  <></>
                )
            }
          </Stack>
 
        </Stack>
      </Stack>
      <Divider sx={{ backgroundColor: "#222E35", height: "1px" }} />
    </Stack>
  );
}