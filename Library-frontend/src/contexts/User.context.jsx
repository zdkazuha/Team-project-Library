import React, { createContext, useState, useEffect } from 'react';
const API = import.meta.env.VITE_API;

export const UserContext = createContext({
    id: null,    
    email: null,
    setEmail: () => {},
    setId: () => {},
    isAuth: () => null,
    isAdmin: () => null,
    clear: () => {},
    getIdByEmail: () => {}
});

export const UserProvider = ({ children }) => {
    const [email, setEmail] = useState(() => {
        return localStorage.getItem('email') || null;
    });

    const [id, setId] = useState(() => {
        return localStorage.getItem('id') || null;
    }); 

    useEffect(() => {
        if (email || id) {
            localStorage.setItem('email', email);
            localStorage.setItem('id', id);
        } else {
            localStorage.removeItem('email');
            localStorage.removeItem('id');
        }
    }, [email, id]);

    const clear = () => { setEmail(null); setId(null); localStorage.removeItem('token'); };
    const isAuth = () => email !== null;
    const isAdmin = () => email === "admin@library.com";
    const getIdByEmail = async (email) => {
        try {
            const response = await fetch(API +`User/user/${email}`, {
                method: 'GET',
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setId(data.id);
            } else {
                console.error('Failed to fetch user ID');
            }
        } catch (error) {
            console.error('Error fetching user ID:', error);
        }
    }

    return (
        <UserContext.Provider value={{ id, email, setEmail, setId, clear, isAuth, isAdmin, getIdByEmail }}>
            {children}
        </UserContext.Provider>
    );
}