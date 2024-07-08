import React, { useState } from "react";
import { User, user } from "./user";
import { createContext } from "react";

type UserContextProviderProps = {
    children: React.ReactNode
}

type ValueContextType = {
    value: string;
    setValue: (value: string) => void;
}


const ValueContext = createContext<ValueContextType | null>(null);

export const  UserContext = createContext<User>(user);


export function UserContextProvider({ children }: UserContextProviderProps) {
    const [value, setValue] = useState("Hello, World!");

    return (
        <ValueContext.Provider value={{value, setValue}}>
        <UserContext.Provider value={user}>
            {children}
        </UserContext.Provider>
        </ValueContext.Provider>
    )
}