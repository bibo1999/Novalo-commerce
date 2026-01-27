'use client';
import { createContext, useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie"; 

export const authenticationContext = createContext(); 

export function AuthenticationContextProvider({ children }) {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const token = Cookies.get('userToken');
        if (token) {
            setUserData(token);
        }
    }, []);

    async function loginApi(values) {
        return axios.post(`https://ecommerce.routemisr.com/api/v1/auth/signin`, values);
    }

    async function registerApi(values){
        return axios.post(`https://ecommerce.routemisr.com/api/v1/auth/signup`, values);
    }

    function logOut() {
        Cookies.remove('userToken');
        localStorage.removeItem('userToken');
        setUserData(null);
        window.location.href = '/login'; 
    }

    return (
        <authenticationContext.Provider value={{ loginApi, registerApi, userData, setUserData, logOut }}>
            {children}
        </authenticationContext.Provider>
    );
}