'use client';
import { createContext, useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie"; 
import { useRouter } from "next/navigation";

export const authenticationContext = createContext(); 

export function AuthenticationContextProvider({ children }) {
    const [userData, setUserData] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const token = Cookies.get('userToken');
        if (token) {
            setUserData(token);
        }
    }, []);

    async function loginApi(values) {
        try{
            const res = await axios.post(`https://ecommerce.routemisr.com/api/v1/auth/signin`, values);
            return res;
        } catch (error) {
            return error;
        }
    }

    async function registerApi(values) {
    try {
        const res = await axios.post(`https://ecommerce.routemisr.com/api/v1/auth/signup`, values);
        return res; 
    } catch (error) {
        return error; 
    }
}

    function logOut() {
        Cookies.remove('userToken');
        localStorage.removeItem('userToken');
        setUserData(null);
        router.replace('/login'); 
        router.refresh();
    }

    return (
        <authenticationContext.Provider value={{ loginApi, registerApi, userData, setUserData, logOut }}>
            {children}
        </authenticationContext.Provider>
    );
}