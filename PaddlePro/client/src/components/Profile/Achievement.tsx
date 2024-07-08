import { Box, Button, Tooltip, Typography } from "@mui/material";
export default function Achievement({ data }: any) {

  console.log(data.win > 1);
  console.log(`grayscale(${Number(!(data.win >= 1))});`);

  return (
    <Box
      sx={{
        color: "white",
        backgroundColor: "rgba(40,40,40,0.75)",
        padding: "40px 20px",
        borderRadius: "20px",
      }}
    >
      <Typography
        sx={{
          textAlign: "center",
          padding: "10px 0",
        }}
        variant="h5"
        component="h3"
        gutterBottom
      >
        Achievement
      </Typography>
      <Box
        sx={{
          display: "flex",
          gap: "20px",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          width: "100%",
          alignContent: "center",
          textAlign: "center",
        }}
      >
        <Tooltip title="Win 1 game" arrow>
          <Box sx={{ display: "flex", gap: "10px", alignItems: "center", margin: "auto", filter: `grayscale(${Number(!(data.win >= 1))});` }}>
            <img src="/static/images/bronze-medal.png" alt="bronze-medal" style={{ width: "50px", height: "50px" }} />
            <Typography variant="h6" component="h6">Bronze</Typography>
          </Box>
        </Tooltip>
        <Tooltip title="Win 5 games" arrow>
          <Box sx={{ display: "flex", gap: "10px", alignItems: "center", margin: "auto", filter: `grayscale(${Number(!(data.win >= 5))});` }}>
            <img src="/static/images/silver-medal.png" alt="bronze-medal" style={{ width: "50px", height: "50px" }} />
            <Typography variant="h6" component="h6">Silver</Typography>
          </Box>
        </Tooltip>
        <Tooltip title="Win 10 games" arrow>
          <Box sx={{ display: "flex", gap: "10px", alignItems: "center", margin: "auto", filter: `grayscale(${Number(!(data.win >= 10))});` }}>
            <img src="/static/images/gold-medal.png" alt="bronze-medal" style={{ width: "50px", height: "50px" }} />
            <Typography variant="h6" component="h6">Gold</Typography>
          </Box>
        </Tooltip>
        <Tooltip title="Win 15 games" arrow>
          <Box sx={{ display: "flex", gap: "10px", alignItems: "center", margin: "auto", filter: `grayscale(${Number(!(data.win >= 15))});` }}>
            <img src="/static/images/platinum-medal.png" alt="bronze-medal" style={{ width: "50px", height: "50px" }} />
            <Typography variant="h6" component="h6">Platinum</Typography>
          </Box>
        </Tooltip>
        <Tooltip title="Win 20 games" arrow>
          <Box sx={{ display: "flex", gap: "10px", alignItems: "center", margin: "auto", filter: `grayscale(${Number(!(data.win >= 20))});` }}>
            <img src="/static/images/master-medal.png" alt="bronze-medal" style={{ width: "50px", height: "50px" }} />
            <Typography variant="h6" component="h6">Master</Typography>

        </Box>
        </Tooltip>
      </Box>
    </Box>
  );
}
