import { CircularProgress, InputAdornment, TextField } from "@mui/material";
import React, { useEffect } from "react";
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

function hasWhiteSpace(s: string) {
    return /\s/.test(s);
}

export default function CustomInput(
    { placeholder, value, setValue, error, setError }: { placeholder: string, value: string, setValue: any, error: boolean, setError: React.Dispatch<React.SetStateAction<boolean>>}
) {
    const [helperText, setHelperText] = React.useState(' ');
    const [loading, setLoading] = React.useState(false);

    var timer: NodeJS.Timeout;
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
    };

    const checkNameIsVaild = () => {
        if (value.length === 0) {
            setError(true);
            setHelperText('Empty field!');
        } else if (hasWhiteSpace(value)) {
            setError(true);
            setHelperText('Name must not contain white spaces!');
        } else {
            clearTimeout(timer);
            timer = setTimeout(() => {
                setLoading(true);
                setTimeout(() => {
                    checkNameIsReserved(value);

                }, 1000);
            }, 1000);

        }
    }

    const checkNameIsReserved = async (name: string) => {
        try {
            const url = `http://localhost:4000/groups/check/${name}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            });
            const data = await response.json();
            if (response.ok === false) {
                setError(true);
                setHelperText(data.error);
            } else {
                setError(false);
                setHelperText(' ');
            }
            setLoading(false);
        }
        catch (error: any) { }
    }

    useEffect(() => {
        if (value.length == 0)
            checkNameIsVaild();
    }
    , []);

    return (
        <>
            <TextField
                fullWidth
                error={
                    loading ? false : error
                }
                placeholder={placeholder}
                onChange={handleChange}
                onKeyDown={
                    () => {
                        clearTimeout(timer);
                    }
                }
                onKeyUp={
                    () => {
                        checkNameIsVaild();
                    }
                }
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            {
                                loading ? <CircularProgress size={24} /> :
                                    error ? <ErrorIcon color="error" /> : <CheckCircleOutlineIcon color="success" />
                            }
                        </InputAdornment>
                    ),
                }}
                value={value}
                helperText={helperText}
                variant="standard"
                type="text"
                disabled={loading}
            />
        </>
    );
}