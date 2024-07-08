import { Box } from "@mui/material";
import { useContext } from "react";
import { UserContext } from "../Context/main";
import { Link } from "react-router-dom";
import './NavigationBar.css';

const NavigationBar = () => {
    const AuthUser = useContext(UserContext);
  
    return (
      <Box sx={
        {
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          zIndex: 1000
        }
      }>
        <ul className="navigation">
          <li className="active">
            <Link to="/">
              <span className="icon">
                <i className="fa fa-house"></i>
              </span>
              <span style={
                {
                    position: "absolute",
                    opacity: 1,
                    transform: "translateY(4px)",
                    fontFamily: 'Rubik',
                    fontSize: "1rem",
                    color: "white",
                    fontWeight: 400,
                    padding: "5px 10px",
                }
              } className="textNav">Home</span>
            </Link>
          </li>
          <li>
            <Link to={`/profile/${AuthUser.username}`}>
              <span className="icon">
                <i className="fa fa-user"></i>
              </span>
            </Link>
          </li>
          <li>
            <Link to="/chat">
              <span className="icon">
                <i className="fa fa-message"></i>
              </span>
            </Link>
          </li>
          <li>
            <Link to="/PlayGame">
              <span className="icon">
                <i className="fa fa-gamepad"></i>
              </span>
            </Link>
          </li>
        </ul>
      </Box>
    );
  };
  

export default NavigationBar;