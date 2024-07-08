import { useContext, useEffect, useState } from "react";
import { Friend, FriendsState } from "../components/Context/user";
import { UserContext } from "../components/Context/main";

const useGetFreindsState = () => {
    const [friendsState, setFriendsState] = useState<FriendsState>({
        AcceptedFriends: [],
        SentRequests: [],
        RecievedRequests: [],
        Blocked: [],
    });
    const AuthUser = useContext(UserContext);
    const [render2, setRender2] = useState(false);

    const getFriends = async () => {
        try {
            if (!localStorage.getItem("access_token")) {
                throw new Error("No access token found");
            }
            const url = "http://localhost:4000/friends/";
            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                },
            });
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            //console.log(data);
            const AcceptedFriends = data.friends.filter((friend: any) => friend.status === "accepted");
            const SentRequests = data.friends.filter((friend: any) => friend.status === "pending" && friend.sender === AuthUser.username);
            const RecievedRequests = data.friends.filter((friend: any) => friend.status === "pending" && friend.receiver === AuthUser.username);
            const blocked = data.blocked;
            console.log(blocked);
            setFriendsState({
                AcceptedFriends: AcceptedFriends,
                SentRequests: SentRequests,
                RecievedRequests: RecievedRequests,
                Blocked: blocked,
            });
            setRender2(true);

        } catch (error) {
            console.error(error);
            setRender2(true);
        }
    };

    useEffect(() => {
        getFriends();
    }, []);

    return { friendsState, setFriendsState, render2, getFriends };
};

export default useGetFreindsState;