import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";



export default function useProfileInfo() {
    let [loading2, setLoading2] = useState(true);
    let [error, setError] = useState(false);
    const [data, setData] = useState<any>({});
    let { username } = useParams();
    const [srcImage, setSrcImage] = useState(data.image as string);

    const GetProfile: () => void = async () => {
        try {
            const response = await fetch(`http://localhost:4000/users/getInfo/${username}`,
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
                setError(true);
                return;
            }
            setData(data);
            console.log(data);
            setLoading2(false);
            setSrcImage(data.image);
        }
        catch (error: any) {
            console.log(error.message);
        }
    }

    useEffect(() => {
        GetProfile();
    }, []);

    return { loading2, error, data, setSrcImage, srcImage, setData };
}