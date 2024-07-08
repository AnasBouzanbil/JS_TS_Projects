import { Button } from '@mui/material';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';

const style = {
    margin: "20px 0",
    padding: "10px 0",
    color: "white",
    fontSize: "30px",
    fontFamily: "Raleway, sans-serif",
    fontWeight: 700,
    textAlign: "center",
    cursor: "pointer",
    textTransform: "capitalize",
}

export default function Logo() {
  return (
    <div>
      <Link to={'/'}>
        <Button disableRipple sx={style}>
          PaddlePro
        </Button>
      </Link>
    </div>
  );
}