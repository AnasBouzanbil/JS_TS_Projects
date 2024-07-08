import React, { useEffect } from 'react';

export default function Auth() {
    const [status, setStatus] = React.useState('Authenticating...');

    async function  getAccessToken() {
        try {
            const searchParams = window.location.search;
            const url = "http://localhost:4000/auth/callback";
            const response = await fetch(`${url}${searchParams}`);
            const data = await response.json();
            localStorage.setItem('access_token', data.acces_token);
            window.location.href = "/";
        } catch (error : any) {
            setStatus('Failed to fetch access token. Please try again.');
        }
    }

    useEffect(() => {
        getAccessToken();
    }
    , []);

    return (
        <div>
            <p>{status}</p>
        </div>
    );
}


// import React from 'react'
// import axios from 'axios';

// const handle_auth = () => {
//     const url = ""
// }

// const grab_access_token = async (code) => {
//     const url = "http://127.0.0.1:4000/auth/callback"
//     const params = {"code":code}
//     try {
//         const response = await axios.get(url, { params: params });
//         localStorage.setItem("access_token", response.data['acces_token']);
//     } catch (error) {
//         //console.log(error);
//     }
// }

// const Login = () => {
//     const [token, setToken] = React.useState("")
//     React.useEffect(()=>{
//         const url_query = new URLSearchParams(window.location.search)
//         const val = url_query.get('code')
//         setToken(val)
//         grab_access_token(val)
//     },[])
//   return (
//     <div>
//         <a href='https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-237d55966e695a4a59e0cc40d7cb4cae5f18bef5b1e9f3c73bcc85ed7bffe0de&redirect_uri=http%3A%2F%2F127.0.0.1%3A3000%2F&response_type=code' >CLick here</a>
//         <p>token is {token}</p>
//     </div>
//   )
// }

// export default Login
