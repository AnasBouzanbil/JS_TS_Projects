import React, { useContext } from 'react'
import { Avatar } from '@mui/material'
import './UploadImage.css'
import { useState } from 'react'
import { UserContext } from '../Context/main'

interface UploadImageProps {
    inputRef:any
}

export default function UploadImage(
    {inputRef}: UploadImageProps
) {
    const AuthUser = useContext(UserContext);
    const [src, setSrc] = useState<string>(AuthUser.image);

    return (
        <div style={{padding: 20}}>
            <label htmlFor='photo-upload' className="custom-file-upload fas">
                <div className="img-wrap img-upload" >
                    <Avatar style={
                        {
                            width: "auto",
                            height: "100%",
                        }
                    } src={src}/>
                </div>
            </label>
            <input ref={inputRef} id="photo-upload" type="file" onChange={
                (e:any)=>{
                    const reader = new FileReader();
                    const file = e.target.files[0];
                    reader.onloadend = () => {
                        setSrc(reader.result as string);
                    }
                    reader.readAsDataURL(file);
                }
            } accept='image/*'/>
        </div>
    )
}
