import React from 'react';
import { Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Input, MenuItem, Stack, Typography } from '@mui/material';
import { Cancel } from '@mui/icons-material';
import { toast } from 'react-toastify';

export default function SearchChannel({ onClickFun, setCurrentChannels, currentChannels }: any) {
    const [channels, setChannels] = React.useState([

    ]) as any[];
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState<string>('');
    const PublicChannels = channels.filter((channel: any) => channel.type === 'Public')
    const ProtectedChannels = channels.filter((channel: any) => channel.type === 'Protected')

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChangeInput = async ({ e }: any) => {
        if (e.target.value === '') {
            setChannels([])
            return
        }
        try {
            const url = `http://localhost:4000/groups/search/${e.target.value}`
            //console.log(url)
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
                    'Content-Type': 'application/json',
                }
            })
            const data = await response.json()
            //console.log(data)
            setChannels(data)
        } catch (e) {
            //console.log(e)
        }
    }

    const handleJoinChannel = async (channel : any, passcode : string ) => {
        try {
            const url = `http://localhost:4000/groups/add/${channel.id}/${passcode}`
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
                    'Content-Type': 'application/json',
                }
            })
            //console.log(response)
            if (response.ok === false) {
                toast.error('Error joining channel')
                return
            }

            const data = await response.json()
            //console.log(data)
            setCurrentChannels((prev:any) => {
                return [...prev, channel]
                }
            )
            toast.success('Joined channel')
        } catch (e) {
            //console.log(e)
        }
        handleClose()
    }


    return (
        <>
            <Typography onClick={handleClickOpen} sx={
                {
                    cursor: 'pointer',
                    color: 'white',
                    fontSize: '1rem',
                    padding: '0px 20px 10px 20px',
          
                }

            }>
                Find a group
            </Typography>
            <Dialog
                open={open}
                onClose={() => {
                    handleClose()
                }}
                aria-labelledby="Create a group dialog"
                sx={
                    {
                        '& .MuiDialog-paper': {
                            width: '80%',
                            maxWidth: 500,
                            borderRadius: 2,
                        },
                    }
                }
            >
                <DialogTitle sx={
                    {
                        textAlign: 'center',
                    }
                }>
                    Find a Channel
                    <Box sx={
                        {
                            padding: '16px 0',
                            width: '100%'
                        }
                    }>
                        <Input onChange={
                            (e) => {
                                handleChangeInput({ e })
                            }
                        } fullWidth type="text" placeholder="Search for channel ..." />
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>

                        <Box id='channel-des' sx={
                            {
                                width: '100%',
                                overflowY: 'auto',
                                height: '300px',
                                padding: '0 10px',
                                scrollbarWidth: 'thin',
                                '&::-webkit-scrollbar': {
                                    width: '5px',
                                },
                                '&::-webkit-scrollbar:hover': {
                                    width: '10px',
                                    scrollbarWidth: 'auto',
                                },

                                '&::-webkit-scrollbar-thumb': {
                                    backgroundColor: 'rgba(0, 0, 0, 0)',
                                },
                                '&::-webkit-scrollbar-thumb:hover': {
                                    backgroundColor: 'rgba(0, 0, 0, 0)',
                                },

                            }

                        }
                        >
                            {
                                channels.length === 0 ? <Box sx={
                                    {
                                        textAlign: 'center',
                                        padding: '16px 0',
                                    }
                                }>
                                    No channels found
                                </Box> : <>
                                    <Box sx={
                                        {
                                            padding: '16px 8px',
                                            borderBottom: '1px solid #f0f0f0',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                        }
                                    }>
                                        <Box>
                                            Public Channels
                                        </Box>
                                    </Box>
                                    {
                                        PublicChannels.map((channel: any, index: number) => {
                                            let isAlreadyIn = false
                                            currentChannels.forEach((ch:any) => {
                                                if (ch.id === channel.id) {
                                                    isAlreadyIn = true
                                                    return
                                                }
                                            }
                                            )

                                            return (
                                                <Stack key={index} direction="row" spacing={2} sx={
                                                    {
                                                        padding: '16px 8px',
                                                        borderBottom: '1px solid #f0f0f0',
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                    }
                                                }>
                                                    <Box sx={
                                                        {
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '16px',
                                                            padding: '8px 0',
                                                            direction: 'row',
                                                        }
                                                    }>
                                                        <img src={channel.image} alt="channel" style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
                                                        <Stack>
                                                            <Box>
                                                                {channel.name}
                                                            </Box>
                                                            <Box>
                                                                Public chat
                                                            </Box>
                                                        </Stack>
                                                    </Box>
                                                    <Box>
                                                        <Button variant='contained' color='primary' onClick={
                                                            () => {
                                                                handleJoinChannel(channel, 'none')
                                                            }
                                                        } 
                                                        disabled={isAlreadyIn ? true : false}
                                                        >
                                                            {
                                                                isAlreadyIn ? 'Joined' : 'Join'
                                                            }
                                                        </Button>
                                                    </Box>
                                                </Stack>
                                            )
                                        })
                                    }

                                    <Box sx={
                                        {
                                            padding: '16px 8px',
                                            borderBottom: '1px solid #f0f0f0',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                        }
                                    }>
                                        <Box>
                                            Protected Channels
                                        </Box>
                                    </Box>
                                    {
                                        ProtectedChannels.map((channel: any, index: number) => {
                                            return (
                                                <Stack key={index} direction="row" spacing={2} sx={
                                                    {
                                                        padding: '16px 8px',
                                                        borderBottom: '1px solid #f0f0f0',
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                        position: 'relative',
                                                    }
                                                }>
                                                    <Box sx={
                                                        {
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '16px',
                                                            padding: '8px 0',
                                                            direction: 'row',
                                                        }
                                                    }>
                                                        <Avatar src={channel.image} alt="channel" style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
                                                        <Stack>
                                                            <Box>
                                                                {channel.name}
                                                            </Box>
                                                            <Box>
                                                                Protected chat
                                                            </Box>
                                                        </Stack>
                                                    </Box>
                                                    <Box>
                                                        <Button id={
                                                            `join-${index}`
                                                        } variant='contained' color='primary' onClick={
                                                            () => {
                                                                const password = document.getElementById(`password-${index}`)
                                                                const input = document.getElementById(`password-${index}`)?.querySelector('input')
                                                                const join = document.querySelector(`#join-${index}`)

                                                                if (password && input && join) {
                                                                    if (input.value !== '') {
                                                                        //console.log(input.value)
                                                                        //console.log('submit')
                                                                        handleJoinChannel(channel, input.value )
                                                                        return
                                                                    } else if (password.style.left === '0%') {
                                                                        
                                                                    }
                                                                    if (input?.value === '') {
                                                                        input.focus()
                                                                    }
                                                                    password.style.left = '0%';
                                                                }
                                                            }
                                                        }>
                                                            Join
                                                        </Button>
                                                    </Box>
                                                    <Box
                                                        id={
                                                            `password-${index}`
                                                        }

                                                        sx={
                                                            {
                                                                width: '70%',
                                                                height: '100%',
                                                                animation: 'all 5s ease',
                                                                position: 'absolute',
                                                                top: '0',
                                                                left: '-100%',
                                                                right: '0',
                                                                bottom: '0',
                                                                backgroundColor: 'rgba(255, 255, 255, 1)',
                                                                zIndex: 1,
                                                                margin: '0 !important',
                                                                display: 'flex',
                                                                justifyContent: 'start',
                                                                alignItems: 'center',
                                                                padding: '0 16px',
                                                                gap: '8px',
                                                            }
                                                        } >

                                                        <Input onChange={
                                                            (e) => { }
                                                        } id="password" type="password" placeholder="Password" />
                                                        <IconButton onClick={
                                                            () => {
                                                                const password = document.getElementById(`password-${index}`)
                                                                if (password) {
                                                                    password.style.left = '-100%'
                                                                }
                                                            }
                                                        }>
                                                            <Cancel />
                                                        </IconButton>
                                                    </Box>
                                                </Stack>
                                            )
                                        })
                                    }
                                </>
                            }
                        </Box>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus variant='outlined' color='info'
                        onClick={() => {
                            handleClose()
                        }}>
                        Cancel {//hadi kon kant just an icon f top right corner 
                        }
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

