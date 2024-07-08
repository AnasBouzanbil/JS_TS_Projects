import {
    Avatar,
    Box,
    IconButton,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import React, { useContext, useEffect } from "react";
import SendIcon from "@mui/icons-material/Send";
import { io } from "socket.io-client";
import { UserContext } from "../../Context/main";
import ReactDOM from "react-dom";
import { ChannelInterface, ChannelMessagesInterface, FriendsState, Message as MessageInterface } from "../../Context/user";
import MessageChannel from "./MessageChannel";
import HeaderChannelBar from "./ChannelBar/HeaderChannelBar";
import { toast } from "react-toastify";

interface ChatListProps {
    selecteChannel: string;
    // paramId: string | undefined;
    setSelectedChannel: React.Dispatch<React.SetStateAction<string>>;
    socket: any;
    setGroups: React.Dispatch<React.SetStateAction<ChannelInterface[]>>;
    groups: ChannelInterface[];
    friendsState: FriendsState,
    setFriendsState: React.Dispatch<React.SetStateAction<FriendsState>>
}

export default function ChannelBar({ setFriendsState, socket, selecteChannel, setSelectedChannel, setGroups, groups, friendsState }: ChatListProps) {
    const [value, setValue] = React.useState("");
    const AuthUser = useContext(UserContext);
    const [ChannelMessages, setChannelMessages] = React.useState<ChannelMessagesInterface[]>([]);
    const chat = groups.find((Channel) => Channel.name === selecteChannel);
    const parentDiv = React.useRef<HTMLDivElement>(null);

    const fetchMessages = async () => {
        if (chat === undefined) {
            return;
        }
        const url = `http://localhost:4000/groups/messages/${chat.id}`;

        const response = await fetch(url,
            {
                headers: {
                    "Authorization": `Bearer ${AuthUser.access_token}`
                }
            });
        if (!response.ok) {
            //console.log("error:", response);
            return;
        }

        const data = await response.json();
        setChannelMessages(data);
        AuthUser.channelMessages = data;
        // //console.log("data:", data);
        // //console.log("messages:", messages);
        // setRender(true);
    }

    useEffect(() => {
        fetchMessages();
        if (chat === undefined) {
            return;
        }
        // socket.emit("joinRoom", chat.id.toString());
        socket.on("joinRoom", (arg: any) => {
            //console.log(`Joined room successfully}`)
        })
        socket.on("GroupMessages", (arg: any) => {
            //console.log(arg)
            console.log(arg)
            if (arg.error !== undefined) {
                toast.error(arg.error);
                //console.log(arg.error);
                return;
              }
        
            if (arg.message.sender === AuthUser.username) {
                return  // Do not display the message if the sender is the current user
            }
            const test = friendsState.Blocked.find((element) => {
                console.log(element)
                console.log(arg.message.sender)
                console.log(element)
                return element === arg.message.sender
            });
            console.log(arg.message)
            console.log(test)
            if (test !== undefined) {
              return;
            }
      
            // setMessages([...AuthUser.messages, {
            //     content: arg.message.content,
            //     sender_name: arg.message.sender,
            //     reciepient: arg.message.receiver
            // }])
            setChannelMessages([...AuthUser.channelMessages, {
                content: arg.message.content,
                sender_name: arg.message.sender
            }])
            AuthUser.channelMessages.push({
                content: arg.message.content,
                sender_name: arg.message.sender
            })

            // AuthUser.messages.push({
            //     content: arg.message.content,
            //     sender_name: arg.message.sender,
            //     reciepient: arg.message.receiver
            // })
        })

        socket.emit("joinRoom", { roomId: chat.id.toString(), type: 'group' })

        return () => {
            socket.off("joinRoom")
            socket.off("GroupMessages")
            socket.emit("leaveRoom", chat.id.toString())
        }
    }, [selecteChannel]);

    if (!chat) {
        return <Box sx={
            {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
            }

        }>
            <Typography variant="h6" component="h5" gutterBottom>
                Sorry, this group does not exist
            </Typography>
        </Box>
    }

    const handle_change = (e: any) => {
        if (e.key === "Enter") {
            if (socket === null) {
                //console.log("socket is undefined");
                return;
            }
            if (value === "") {
                return;
            }
            //console.log(socket);
            socket.emit("GroupMessages", {
                content: value,
                sender: AuthUser.username,
                roomId: chat.id,
                type: 'group',
            });
            setValue("");
            setChannelMessages([...AuthUser.channelMessages, {
                content: value,
                sender_name: AuthUser.username
            }])
            AuthUser.channelMessages.push({
                content: value,
                sender_name: AuthUser.username
            })
        }
    }

    const handle_change2 = () => {
        if (socket === null) {
            return;
        }
        if (value === "") {
            return;
        }
        socket.emit("GroupMessages", {
            content: value,
            sender: AuthUser.username,
            groupId: chat.id,
        });
        setValue("")
        setChannelMessages([...AuthUser.channelMessages, {
            content: value,
            sender_name: AuthUser.username
        }])
        AuthUser.channelMessages.push({
            content: value,
            sender_name: AuthUser.username
        })
    }
    return (
        <Stack
            direction={"column"}
            justifyContent={"space-between"}
            alignItems={"stretch"}
            spacing={3}
            maxWidth={"800px"}
            sx={{
                width: "90%",
                margin: "auto",
                height: "100%",
            }}
        >
            <HeaderChannelBar setGroups={setGroups} chat={chat} setSelectedChannel={setSelectedChannel} friendsState={friendsState} setFriendsState={setFriendsState}/>

            <Box height={"100%"} sx={
                {
                    overflowY: "scroll",
                    scrollbarWidth: "none",
                    padding: "20px",
                }
            } ref={parentDiv}>
                {
                    ChannelMessages.length === 0 ? <Typography sx={
                        {
                            color: "white",
                            textAlign: "center",
                            marginTop: "20px",
                        }
                    } variant="h6" component="h5" gutterBottom
                    >Start the conversation by sending a message</Typography> :
                        ChannelMessages.map(
                            (element, key) => {
                                const test =  friendsState.Blocked.find((element2) => {
                                    return element2 === element.sender_name
                                }
                                );
                                if (test !== undefined) {
                                    return null;
                                }
                                return (
                                    <MessageChannel key={key} sender={element.sender_name}>
                                        {
                                            element.content
                                        }
                                    </MessageChannel>
                                );
                            }
                        )
                }
            </Box>
            {/* Input */}
            <Stack
                direction="row"
                justifyContent="center"
                alignItems="center"
                spacing={3}
                sx={{
                    background: "#222E35",
                    borderRadius: "25px",
                    padding: "10px"
                }}
            >
                <TextField
                    variant="standard"
                    onKeyDown={handle_change}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    sx={{
                        width: "80%",
                        borderRadius: "25px",
                        color: "white",
                    }}
                    placeholder="Type a message..."
                    InputProps={{
                        disableUnderline: true,
                        sx: {
                            borderBottom: "1px solid #fff",
                            color: "white",
                        },
                    }}
                />

                <IconButton onClick={
                    handle_change2
                }
                    disabled={value === ""}
                >
                    <SendIcon
                        sx={{
                            color: "white",
                            filter: value === "" ? "invert(1)" : "none",
                        }}
                    />
                </IconButton>
            </Stack>
        </Stack>

    );
}
