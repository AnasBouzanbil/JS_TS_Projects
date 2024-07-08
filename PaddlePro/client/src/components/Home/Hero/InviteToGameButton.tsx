import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../Context/main";
import { toast } from "react-toastify";
import { Button } from "react-bootstrap";




export const InviteFriendToGameButton = ({ friend, socket, children }: {friend : any, socket:any, children:any}) => {
    const navigate = useNavigate();
    const AuthUser = useContext(UserContext)

    const fun = async () => {
        try {
            const url = `http://localhost:4000/game/create`;
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("access_token"),
                },
                body: JSON.stringify({
                    receipient: friend.user,
                }),
            });
            if (!response.ok) {
                throw new Error("Couldn't send the game invite");
            }
            const data = await response.json();
            //console.log(data);
            // setIsLoaded(true);
            socket.emit('inviteFriendToGame', { sender: AuthUser.username, receipient: friend.user });
            navigate('/playWithFriend');
            toast.success("Game invite sent successfully");

        } catch (error) {
            console.log(error);
            // setIsLoaded(true);
            toast.error("Couldn't send the game invite");
        }
    }

    return (
        <>
            <Button onClick={fun}>
                {
                    children
                }
            </Button>
        </>
    )
}