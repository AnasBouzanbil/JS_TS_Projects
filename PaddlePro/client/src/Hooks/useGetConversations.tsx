


import { useContext, useEffect, useState } from "react";
import { ChannelInterface, Friend } from "../components/Context/user";
import { UserContext } from "../components/Context/main";

interface FriendsState {
    AcceptedFriends: Friend[];
    SentRequests: Friend[];
    RecievedRequests: Friend[];
}

const useGetConversations = () => {
    const [conversations, setConversations] = useState<ChannelInterface[]>([]);
    const AuthUser = useContext(UserContext);
    const [render3, setRender3] = useState(false);

    const getConversations = async () => {
      try {
            if (!AuthUser.access_token) {
              throw new Error("No access token found");
            }
            const url = "http://localhost:4000/groups/";
            const response = await fetch(url, {
              method: "GET",
              headers: {
                Authorization: `Bearer ${AuthUser.access_token}`,
              },
            });
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            const data = await response.json();
            setConversations(data);
            setRender3(true);

          }
          catch (error : any) {
            console.error(error);
            setRender3(true);
          }
    }

    useEffect(() => {

        getConversations();
    }, []);
    
    return { conversations, setConversations, getConversations, render3}
};

export default useGetConversations;