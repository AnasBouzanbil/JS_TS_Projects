import * as React from "react";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import Button from "@mui/material/Button";
import LongMenu from "./Menu";
import { styled } from "@mui/material/styles";
import { UserContext } from "../../Context/main";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";

const StyledBadge = styled(Badge)(() => ({
  "& .MuiBadge-badge": {
    backgroundColor: "rgb(100 217 86)",
  },
}));

// const listFriends = [
//     {
//         name: 'John',
//         status: 'Online'
//     },
//     {
//         name: 'Jane',
//         status: 'Offline'
//     },
//     {
//         name: 'Jill',
//         status: 'Online'
//     },
//     {
//         name: 'Jack',
//         status: 'Offline'
//     }
// ]

// listFriends.sort((a, b) => {
//     if (a.status === 'Online' && b.status === 'Offline') {
//         return -1
//     } else if (a.status === 'Offline' && b.status === 'Online') {
//         return 1
//     } else {
//         return 0
//     }
// }
// )

 // friend.status === 'Online' ?
                // <StyledBadge
                // overlap="circular"
                // anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}

                // variant="dot"
                // >
                // <Avatar alt="Remy Sharp" src="" />

                // </StyledBadge>
                // :

export default function TestFriendsList({friendsState, getFriends}:any) {
  const user = React.useContext(UserContext);
  // const [friends, setFriends] = React.useState(user.AcceptedFriends);

  const friendsContent = friendsState.AcceptedFriends.map((friend:any, index:number) => (
    <Box key={index} sx={{
      padding: "0",
    }}>
      <MenuItem sx={{ cursor: "default" , padding: "20px 10px" }}>
        <Link to={`/profile/${friend.user}`}>
        <Button
          
          sx={{
            borderRadius: "50%",
            padding: "0",
            minWidth: "0",
          }}
        >
          {
            friend.onlineStatus ? (
              <StyledBadge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                variant="dot"
              >
                <Avatar alt={friend.user} src={friend.image} />
              </StyledBadge>
            ) : (
              <Avatar alt={friend.user} src={friend.image} />
            )
          }
        </Button>
        </Link>
        <ListItemText sx={{ padding: "0 10px" }}>
          {friend.user}
        </ListItemText>
        <LongMenu  name={friend.user} />
      </MenuItem>
    </Box>
  ));

  return (
    <MenuList
      sx={{
        padding: "0",
      }}
    >
      {friendsContent.length === 0 ? (
        <Typography
        
        sx={
          {
            padding: "20px",
            textAlign: "center"
          }
        }
        >
          No Friends
        </Typography>
      ) : (
        friendsContent
      )}
    </MenuList>
  );
}