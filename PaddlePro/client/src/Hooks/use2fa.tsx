import { useContext, useEffect, useState } from "react";
import { UserContext } from "../components/Context/main";

const use2fa = () => {
    const AuthUser = useContext(UserContext);
    const [render, setRender] = useState(false);
    const [firstTime, setFirstTime] = useState(false);
    const [show2fa, setShow2fa] = useState(false);

    async function whoAmI() {
        try {
          if (!AuthUser.access_token) {
            throw new Error("No access token found");
          }
          const url = "http://127.0.0.1:4000/users/whoami";
          const response = await fetch(url, {
            headers: {
              Authorization: `Bearer ${AuthUser.access_token}`,
            },
          });
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          AuthUser.image = data.image;
          AuthUser.username = data.username;
          AuthUser.isLoggedIn = true;
          AuthUser.tfwactivated = data.tfwactivated;
          setFirstTime(data.ftime);
          setRender(true);
          if (data.tfwactivated === true && data.eligible === false) {
            setShow2fa(true);
          }
        } catch (error: any) {
          setRender(true);
        }
      }

      useEffect(() => {
        whoAmI();
      }
    ,[]);


    return { show2fa, render, setShow2fa, firstTime};
}


export default use2fa;