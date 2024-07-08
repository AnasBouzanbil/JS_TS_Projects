import { Box, Typography } from "@mui/material";
import { useContext } from "react";
import { UserContext } from "../../Context/main";

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

function Message1({sender,  children }: {sender: string, children: string }) {
  return (
    <>
        <Typography
            variant="body1"
            component={"p"}
        >
            {sender}
        </Typography>
        <Box
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
        </Box>
    </>
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


function Message2({sender, children }: {sender: string, children: string }) {
  return (
    <>
    <Typography
        variant="body1"
        component={"p"}
        sx={
            {
                direction: "rtl",
                marginTop: "15px",
            }

        }
    >
        {sender}
    </Typography>
    <Box
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
    </Box>
    </>
  );
}

export default function MessageChannel({
  children,
  sender,
}: {
  children: string;
  sender: string;
}) {
  const AuthUser = useContext(UserContext);
  return sender === AuthUser.username ? (
    <Message2 sender={sender} children={children} />
  ) : (
    <Message1 sender={sender} children={children} />
  );
}
