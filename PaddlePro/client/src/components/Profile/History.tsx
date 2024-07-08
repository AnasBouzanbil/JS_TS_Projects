import { Box, Typography } from "@mui/material";
import LastMatchesListHistory from "./LastMatchesListHistory";

export default function History({data}:any) {
  return (
    <Box
      sx={{
        color: "white",
        backgroundColor: "rgba(40,40,40,0.75)",
        padding: "20px",
        borderRadius: "20px",
      }}
    >
      <Typography
        sx={{
          textAlign: "center",
        }}
        variant="h5"
        component="h3"
        gutterBottom
      >
        History
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box sx={
          {
            width: "100%",
          }
        }>
          <LastMatchesListHistory data={data} />
        </Box>
      </Box>
    </Box>
  );
}
