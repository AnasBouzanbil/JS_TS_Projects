import { IconButton, Menu, MenuItem } from "@mui/material"
import { ChannelInterface, Friend, FriendsState } from "../../../Context/user"
import { MoreVert } from "@mui/icons-material"
import { MembersInterface } from "./ChannelMembers"
import React, { useEffect } from "react"
import { toast } from "react-toastify"



export default function MoreOptionsMember(
    {
        chat,
        member,
        setMembers,
        members,
        mutedMembers,
        setMutedMembers,
        setFriendsState,
        friendsState
    }: {
        chat: ChannelInterface,
        member: MembersInterface,
        setMembers: React.Dispatch<React.SetStateAction<MembersInterface[]>>,
        members: MembersInterface[],
        mutedMembers: { username: string, image: string }[],
        setMutedMembers: React.Dispatch<React.SetStateAction<{ username: string, image: string }[]>>,
        setFriendsState: React.Dispatch<React.SetStateAction<FriendsState>>,
        friendsState: FriendsState
    }
) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [open, setOpen] = React.useState(false)

    const handleSetAdmin = async () => {
        try {
            const url = `http://localhost:4000/groups/${chat.id}/promote/${member.username}`
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            })
            if (response.ok) {
                toast.success('success');
                // const newMembers = members.find()
                setMembers((prev) => {
                    return prev.map((mem) => {
                        if (mem.username === member.username) {
                            return {
                                ...mem,
                                role: 'Admin'
                            }
                        }
                        return mem;
                    })
                }
                )

            } else {
                throw Error('error');
            }
        }
        catch (e) {
            toast.error('error');
        }
    }

    const handleUnsetAdmin = async () => {
        try {
            const url = `http://localhost:4000/groups/${chat.id}/demote/${member.username}`
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            })
            if (response.ok) {
                toast.success('success');
                setMembers((prev) => {
                    return prev.map((mem) => {
                        if (mem.username === member.username) {
                            return {
                                ...mem,
                                role: 'Member'
                            }
                        }
                        return mem;
                    })
                }
                )

            } else {
                throw Error('error');
            }
        }
        catch (e) {
            toast.error('error');
        }
    }

    const handleBlockUser = async () => {
        try {
            const url = `http://localhost:4000/friends/block/${member.username}`
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            })
            if (response.ok) {
                toast.success('you have successfully blocked that user')
                // setMembers((prev) => {
                //     return prev.filter((mem) => mem.username !== member.username);
                // }
                // )
                setFriendsState((prev) => {
                    return {
                        AcceptedFriends: prev.AcceptedFriends,
                        SentRequests: prev.SentRequests,
                        RecievedRequests: prev.RecievedRequests,
                        Blocked: [...prev.Blocked, member.username]
                    }
                }
                )


            } else {
                throw Error('error');
            }
        }
        catch (e) {
            toast.error('error');
        }
    }

    const handleUnBlockUser = async () => {
        try {
            const url = `http://localhost:4000/friends/unblock/${member.username}`
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            })
            if (response.ok) {
                toast.success('you have successfully blocked that user')
                // setMembers((prev) => {
                //     return prev.filter((mem) => mem.username !== member.username);
                // }
                // )
                setFriendsState((prev) => {
                    return {
                        AcceptedFriends: prev.AcceptedFriends,
                        SentRequests: prev.SentRequests,
                        RecievedRequests: prev.RecievedRequests,
                        Blocked: [...prev.Blocked.filter((e)=>e!==member.username)]
                    }
                }
                )


            } else {
                throw Error('error');
            }
        }
        catch (e) {
            toast.error('error');
        }
    }

    const handleMuteMember = async () => {
        try {
            const url = `http://localhost:4000/groups/${chat.id}/mute/${member.username}`
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            })
            if (response.ok) {
                toast.success('success');
                setMutedMembers((prev) => {
                    return [...prev, { username: member.username, image: member.image }];
                }
                )

            } else {
                throw Error('error');
            }
        }
        catch (e) {
            toast.error('error');
        }
    }

    const handleKickMember = async () => {
        try {
            const url = `http://localhost:4000/groups/delete/${chat.id}/${member.username}`
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            })
            if (response.ok) {
                toast.success('success');
                setMembers((prev) => {
                    return prev.filter((mem) => mem.username !== member.username);
                }
                )

            } else {
                throw Error('error');
            }
        }
        catch (e) {
            toast.error('error');
        }
    }

    const handleUnMuteMember = async () => {
        try {
            const url = `http://localhost:4000/groups/${chat.id}/unmute/${member.username}`
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            })
            if (response.ok) {
                toast.success('success');
                setMutedMembers((prev) => {
                    return prev.filter((mem) => mem.username !== member.username);
                }
                )

            } else {
                throw Error('error');
            }
        }
        catch (e) {
            toast.error('error');
        }
    }

    const handleBanMember = async () => {
        try {
            const url = `http://localhost:4000/groups/${chat.id}/ban/${member.username}`
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            })
            if (response.ok) {
                const data = await response.json();

                toast.success(data.success);
                setMembers((prev) => {
                    return prev.filter((mem) => mem.username !== member.username);
                }
                )

            } else {
                throw Error('error');
            }
        }
        catch (e) {
            toast.error('error');
        }
    }


    const handleClick = (e: any) => {
        setAnchorEl(e.currentTarget);
        setOpen(true);
    }
    const handleClose = () => {
        setAnchorEl(null);
        setOpen(false)
    }

    useEffect(() => {
        //console.log(anchorEl);
        //console.log(open);
    }, [open, anchorEl]
    );

    return (
        <>
            <IconButton onClick={handleClick} sx={{ padding: '0' }}>
                <MoreVert sx={{ color: 'white' }} />
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                sx={
                    {

                    }
                }
            >
                {
                    chat.isOwner && member.role !== 'Owner' ?
                        member.role === 'Admin' ?
                            <MenuItem onClick={handleUnsetAdmin}>Demote Admin</MenuItem>
                            :
                            <MenuItem onClick={handleSetAdmin}>Promote Admin</MenuItem>
                        :
                        <></>
                }
                {
                    member.role !== 'Owner' && chat.isAdmin ?
                        mutedMembers.find((mem) => mem.username === member.username) === undefined ?
                            chat.isOwner ?
                                <MenuItem onClick={handleMuteMember}>Mute Member</MenuItem>
                                :
                                member.role !== 'Admin' ?
                                    <MenuItem onClick={handleMuteMember}>Mute Member</MenuItem>
                                    :
                                    null
                            :
                            <>
                                {
                                    chat.isOwner ?
                                        <MenuItem onClick={handleUnMuteMember}>Unmute Member</MenuItem>
                                        :
                                        member.role !== 'Admin' ?
                                            <MenuItem onClick={handleUnMuteMember}>Unmute Member</MenuItem>
                                            :
                                            <>{member.role}</>
                                }
                            </>
                        :
                        null
                }
                {
                    member.role !== 'Owner' && chat.isAdmin ?
                        chat.isOwner ?
                            <MenuItem onClick={handleBanMember}>Ban Member</MenuItem>
                            :
                            member.role !== 'Admin' ?
                                <MenuItem onClick={handleBanMember}>Ban Member</MenuItem>
                                :
                                null
                        :
                        null
                }
                {
                    member.role !== 'Owner' && chat.isAdmin ?
                        chat.isOwner ?
                            <MenuItem onClick={handleKickMember}>Kick Member</MenuItem>
                            :
                            member.role !== 'Admin' ?
                                <MenuItem onClick={handleKickMember}>Kick Member</MenuItem>
                                :
                                null

                        :
                        null
                }
                {
                    friendsState.Blocked.find((blocked) => blocked === member.username) === undefined ?
                    <MenuItem onClick={handleBlockUser} sx={
                        {
                            color: 'red',
                        }
                    }>Block Member</MenuItem>
                    :
                    <MenuItem onClick={handleUnBlockUser} sx={
                        {
                            color: 'red',
                        }
                    }>Unblock Member</MenuItem>
                }
            </Menu>
        </>
    )

}