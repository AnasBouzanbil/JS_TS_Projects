import { useEffect, useState } from "react";



const list = [
    1,3,2,23,23,1,2
]

list.push.apply(list, list );
list.push.apply(list, list );
list.push.apply(list, list );


export default function useLastMatches(username: string) {
    const [listFriends, setListFriends] = useState([] as any);

    useEffect(() => {
        const GetLastMatches = async () => {
            try {
                const response = await fetch(`http://localhost:4000/game/UserLast/${username}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("access_token")}`
                    }
                }
                );
                const data = await response.json();
                if (data.error !== undefined) {
                    console.log(data.error);
                    return;
                }
                setListFriends(data.games);
            }
            catch (error: any) {
                console.log(error.message);
            }
        }
        GetLastMatches();
    }
    , []);

    return {listFriends};
}
