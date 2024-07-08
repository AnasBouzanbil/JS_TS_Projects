
export interface Friend {
    user: string;
    status: string;
    image: string;
    sender: string;
    receiver: string;
    roomId: number;
    blocked: boolean;
    unseenNum: number;
    onlineStatus: boolean;
    inGame: boolean;
}

export interface Notification {
    id: number
}

export interface Message {
    sender_name: string;
    reciepient: string;
    content: string;
    created_on: string;
}

export interface ChannelMessagesInterface {
    sender_name: string;
    content: string;
}

export interface ChannelInterface {
    id: number;
    name: string;
    image: string;
    desc: string;
    isAdmin: boolean;
    isOwner: boolean;
    type: string;
}

// export interface Notificatio

export interface User {
    username: string;
    image: string;
    isLoggedIn: boolean;
    access_token: string | null;
    messages: Message[];
    channelMessages: ChannelMessagesInterface[];
    tfwactivated: boolean;
}

export const user:User = {
    username: "",
    image: "/static/images/default.jpeg",
    isLoggedIn: false,
    access_token: localStorage.getItem("access_token"),
    messages: [],
    channelMessages: [],
    tfwactivated: false,
}

export interface FriendsState {
    AcceptedFriends: Friend[];
    SentRequests: Friend[];
    RecievedRequests: Friend[];
    Blocked         :string[];
}