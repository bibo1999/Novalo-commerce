'use client';
import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const authenticationContext = createContext(); 

export function AuthenticationContextProvider({ children }) {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('userToken');
        if (typeof window !== 'undefined' && localStorage.getItem('userToken')) {
            setUserData(localStorage.getItem('userToken'));
        }
    }, []);
    // Login
    async function loginApi(values) {
        return axios.post(`https://ecommerce.routemisr.com/api/v1/auth/signin`, values)
            .then((res) => res).catch((err) => err);
    }
    // Register
    async function registerApi(values){
      return axios.post(`https://ecommerce.routemisr.com/api/v1/auth/signup`, values)
        .then((res) => res).catch((err) => err);
    }
    // Logout
    function logOut() {
    localStorage.removeItem('userToken');
    setUserData(null);
}

    return (
        <authenticationContext.Provider value={{ loginApi, registerApi, userData, setUserData, logOut }}>
            {children}
        </authenticationContext.Provider>
    );
}