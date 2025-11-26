import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext({
    email: null,
    setEmail: () => {},
    clear: () => {},
    isAuth: () => null,
    isAdmin: () => null,
    getEmail: ()  => null,
});

export const UserProvider = ({ children }) => {
    const [email, setEmail] = useState(() => {
        return localStorage.getItem('email') || null;
    });

    useEffect(() => {
        if (email) {
            localStorage.setItem('email', email);
        } else {
            localStorage.removeItem('email');
        }
    }, [email]);

    const clear = () => { setEmail(null); };
    const isAuth = () => email !== null;
    const isAdmin = () => email === "admin@library.com";

    return (
        <UserContext.Provider value={{ email, setEmail, clear, isAuth, isAdmin }}>
            {children}
        </UserContext.Provider>
    );
}