import * as React from 'react';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import './SearchBar.css';
import { useNavigate } from 'react-router-dom';



export const SearchBar = () => {
    const navigate = useNavigate();

    const [value, setValue] = React.useState("");
    const [style, setStyle] = React.useState({
        width: 0,
        backgroundColor: "white",
        overflow: "hidden",
        padding: "10px 0"
    } as any);
    const [boxStyle, setBoxStyle] = React.useState({
        width: "100px",
        transition: "width 0.75s",
        margin: "15px auto",
        padding: "5px 10px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
        borderRadius: "25px",
    } as any);
    /*
    {
    }
    */
    const [users, setUsers] = React.useState([]);

    const fetchUsers = async () => {
        if (value === "") {
            setUsers([]);
            return;
        }
        //console.log("fetching users" , value);
        const response = await fetch('http://127.0.0.1:4000/users/search/' + value,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + localStorage.getItem('access_token')
                }
            }    
        );
        if (response.status === 401) {
            //console.log("Unauthorized");
            return;
        }
        if (response.ok === false) {
            //console.log("error");
            return;
        }
        console .log(response);
        const data = await response.json();
        //console.log("for search data:", data);
        if (data.length === 0) {
            setUsers([]);
            return;
        }
        setUsers(
                data.map((user: any) => {
                    return (
                        user.username
                    );
                })
        );
    };

    return (
        <Box sx={

                boxStyle
            }  
        onFocus={()=>{
            setStyle({ 
                transition: "width 0.75s",
                width: "80%",
                backgroundColor: "white",
                padding: "10px",
             });
             setBoxStyle({
                width: "50%",
                transition: "width 0.75s",
                maxWidth: "500px",
                margin: "15px auto",
                padding: "5px 10px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "white",
                borderRadius: "25px",
            })
        }} 
            onBlur={()=>{
                setStyle({
                    width: 0,
                    transition: "width 0.75s",
                    backgroundColor: "white",
                    overflow: "hidden",
                    padding: "10px 0"
                });
                setBoxStyle({
                    width: "100px",
                    transition: "width 0.75s",
                    maxWidth: "500px",
                    margin: "15px auto",
                    padding: "5px 10px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "white",
                    borderRadius: "25px",
                })
            }
        }>
                <Autocomplete
                    sx={style}
                    options={users}
                    freeSolo
                    value={value}
                    onChange={
                        (e:any, nv:string|null) => {
                            setValue(nv?nv:"");
                        }
                    }
                    renderInput={(params) => (
                    <TextField
                        value={value}
                        onChange={
                            (e) => {
                                e.preventDefault();
                                if (e.target.value === "") {
                                    setUsers([]);
                                    setValue(e.target.value);
                                } else {
                                    setValue(e.target.value);
                                    fetchUsers();
                                }
                            }
                        }
                        {
                            ...params
                        }
                        sx={{border: "0px"}}
                        label="search..."
                    />
                    )}
                />
            <Button
            sx={
                {
                    backgroundColor: "white",
                    padding: "10px",
                    color: "black",
                    height: "100%",
                    "&:hover": { // Fix: Assign the CSS properties inside an object
                        backgroundColor: "white"
                    },
                    borderRadius: 0,
                }
                
            }
            onClick={() => {
                if (value === "") {
                    return;
                }
                navigate('/profile/' + value);
            }}
            id='main-search-button'>
                <SearchIcon sx={{

                }}  />
            </Button>
        </Box>

    );
}