'use client';

import React, { useContext, useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import { authenticationContext } from '@/context/UserContext';
import Link from 'next/link';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';

export default function Register() {
    let { registerApi, setUserData, userData } = useContext(authenticationContext);
    const [isLoading, setIsLoading] = useState(false);
    const [messageError, setMessageError] = useState('');
    let router = useRouter();

    // 1. Redirect if already logged in (Sync with Login logic)
    useEffect(() => {
        if (userData || Cookies.get('userToken')) {
            router.replace('/');
        }
    }, [userData, router]);

    async function handleRegister(values) {
        setIsLoading(true);
        setMessageError('');
        
        try {
            let res = await registerApi(values);
            
            if (res?.data?.message === 'success') {
                const token = res?.data.token;

                // 2. Set Cookie (Matches Login logic for Middleware compatibility)
                Cookies.set('userToken', token, { 
                    expires: 7, 
                    secure: true, 
                    sameSite: 'strict',
                    path: '/' 
                });
                
                // 3. Set LocalStorage and Context
                localStorage.setItem('userToken', token);
                setUserData(token); 
                
                toast.success("Account Created Successfully! 🎉", { duration: 3000 });

                // 4. Force hard reload to sync cookie with Server Components/Middleware
                setTimeout(() => {
                    window.location.href = '/'; 
                }, 400); 

            } else {
                const errorMsg = res?.response?.data?.message || "Registration failed";
                setMessageError(errorMsg);
                toast.error(errorMsg);
            }
        } catch (error) {
            setMessageError("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    let validation = Yup.object({
        name: Yup.string().required("Name is required").min(3, "Too short").max(15, "Too long"),
        email: Yup.string().required("Email is required").email("Invalid email"),
        phone: Yup.string().required("Phone is required").matches(/^01[0125][0-9]{8}$/, 'Enter valid Egyptian number'),
        password: Yup.string().required("Password is required").matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/, 'Min 8 chars, 1 uppercase, 1 number'),
        rePassword: Yup.string().required("Confirm password").oneOf([Yup.ref('password')], 'Passwords must match'),
    });

    let formik = useFormik({
        initialValues: { name: '', phone: '', email: '', password: '', rePassword: '' },
        validationSchema: validation,
        onSubmit: handleRegister,
    });

    const renderInput = (id, label, type = "text") => {
        const isInvalid = formik.errors[id] && (formik.touched[id] || formik.submitCount > 0);

        return (
            <div className="relative z-0 w-full group">
                <input 
                    type={type} name={id} id={id}
                    onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values[id]}
                    className={`block py-3 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 peer transition-colors ${
                        isInvalid ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-[#12bb9c]'
                    }`}
                    placeholder=" " 
                />
                <label htmlFor={id} className={`absolute text-sm duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 ${
                    isInvalid ? 'text-red-500' : 'text-gray-500 peer-focus:text-[#12bb9c]'
                }`}>
                    {label}
                </label>
                {isInvalid && (
                    <p className="text-red-500 text-[11px] mt-1 font-bold flex items-center italic">
                        <i className="fa-solid fa-triangle-exclamation me-1"></i>
                        {formik.errors[id]}
                    </p>
                )}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-24">
            <form 
                onSubmit={formik.handleSubmit} 
                className="max-w-md w-full bg-white border border-gray-200 rounded-3xl p-10 shadow-2xl space-y-8"
            >
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-[#001f3f]">Create Account</h2>
                    <p className="mt-2 text-sm text-gray-500 font-medium">Join us today</p>
                </div>

                {messageError && (
                    <div className="flex items-center bg-red-50 border-l-4 border-red-600 text-red-700 p-4 rounded-xl animate-pulse">
                         <i className="fa-solid fa-circle-exclamation mr-3"></i>
                        <p className="text-sm font-bold">{messageError}</p>
                    </div>
                )}

                <div className="space-y-5">
                    {renderInput("name", "Full Name")}
                    {renderInput("email", "Email Address", "email")}
                    {renderInput("phone", "Phone Number", "tel")}
                    {renderInput("password", "Password", "password")}
                    {renderInput("rePassword", "Confirm Password", "password")}
                </div>

                <button 
                    disabled={isLoading} 
                    type="submit" 
                    className={`cursor-pointer w-full py-4 rounded-2xl text-white font-bold text-sm transition-all duration-300 shadow-xl
                        ${isLoading ? 'bg-gray-400' : 'bg-[#12bb9c] hover:opacity-90 active:scale-95 shadow-[#12bb9c]/20'}`}
                >
                    {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                             <i className='fas fa-circle-notch fa-spin'></i> Registering...
                        </span>
                    ) : "Register Now"}
                </button>

                <p className="text-center text-sm text-gray-600">
                    Already have an account? <Link href="/login" className="text-[#001f3f] font-bold hover:underline ml-1">Login</Link>
                </p>
            </form>
        </div>
    );
}