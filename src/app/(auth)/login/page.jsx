'use client';

import React, { useContext, useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authenticationContext } from '@/context/UserContext';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';

export default function Login() {
    let { loginApi, setUserData, userData } = useContext(authenticationContext);
    let router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [messageError, setMessageError] = useState('');

    // Best Practice: If user is already logged in, redirect them away from /login immediately
    useEffect(() => {
        if (userData || Cookies.get('userToken')) {
            router.replace('/');
        }
    }, [userData, router]);

    async function handleLogin(values) {
        setIsLoading(true);
        setMessageError(''); // Clear errors before new attempt
        
        try {
            let res = await loginApi(values);
            
            if (res?.data?.message === 'success') {
                const token = res?.data.token;

                // 1. Set Cookie for Middleware (Crucial for Best Practice)
                Cookies.set('userToken', token, { expires: 7, secure: true, sameSite: 'strict' });
                
                // 2. Set LocalStorage for existing persistence logic
                localStorage.setItem('userToken', token);
                
                // 3. Update Context State
                setUserData(token); 
                
                toast.success("Welcome Back! 😍", { duration: 3000 });
                
                // 4. Use replace instead of push to prevent going 'back' to login
                router.replace('/');
            } else {
                const errorMsg = res?.response?.data?.message || "Invalid email or password";
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
        email: Yup.string().required("Email is required").email("Invalid email format"),
        password: Yup.string().required("Password is required")
    });

    let formik = useFormik({
        initialValues: { email: '', password: '' },
        validationSchema: validation,
        onSubmit: handleLogin,
    });

    const isFieldInvalid = (fieldName) => 
        formik.errors[fieldName] && (formik.touched[fieldName] || formik.submitCount > 0);

    return (
        <div className="min-h-screen bg-[#f9f8f4] flex items-center justify-center px-4 py-12">
            <form 
                onSubmit={formik.handleSubmit}
                className="max-w-md w-full bg-white border border-gray-100 rounded-3xl p-10 shadow-2xl space-y-8"
            >
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-[#001f3f]">Login Now</h2>
                    <p className="mt-2 text-sm text-gray-500 font-medium">Please enter your details</p>
                </div>

                {messageError && (
                    <div className="flex items-center bg-red-50 border-l-4 border-red-600 text-red-700 p-4 rounded-xl animate-pulse">
                        <i className="fa-solid fa-circle-exclamation mr-3"></i>
                        <p className="text-sm font-bold">{messageError}</p>
                    </div>
                )}

                <div className="space-y-6">
                    {/* Email Input */}
                    <div className="relative z-0 w-full group">
                        <input 
                            type="email" name="email" id="email"
                            onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.email}
                            className={`block py-3 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 peer transition-colors ${
                                isFieldInvalid('email') ? 'border-red-600 focus:border-red-600' : 'border-gray-300 focus:border-[#12bb9c]'
                            }`}
                            placeholder=" " 
                        />
                        <label htmlFor="email" className={`absolute text-sm duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 ${
                            isFieldInvalid('email') ? 'text-red-600' : 'text-gray-500 peer-focus:text-[#12bb9c]'
                        }`}>
                            Email Address
                        </label>
                        {isFieldInvalid('email') && (
                            <p className="text-red-600 text-xs mt-1 font-semibold flex items-center">
                                <i className="fa-solid fa-circle-xmark me-1 text-[10px]"></i>
                                {formik.errors.email}
                            </p>
                        )}
                    </div>

                    {/* Password Input */}
                    <div className="relative z-0 w-full group">
                        <input 
                            type="password" name="password" id="password"
                            onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.password}
                            className={`block py-3 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 peer transition-colors ${
                                isFieldInvalid('password') ? 'border-red-600 focus:border-red-600' : 'border-gray-300 focus:border-[#12bb9c]'
                            }`}
                            placeholder=" " 
                        />
                        <label htmlFor="password" className={`absolute text-sm duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 ${
                            isFieldInvalid('password') ? 'text-red-600' : 'text-gray-500 peer-focus:text-[#12bb9c]'
                        }`}>
                            Password
                        </label>
                        {isFieldInvalid('password') && (
                            <p className="text-red-600 text-xs mt-1 font-semibold flex items-center">
                                <i className="fa-solid fa-circle-xmark me-1 text-[10px]"></i>
                                {formik.errors.password}
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex items-center justify-end">
                    <Link href="/forget-password" size="sm" className="text-sm font-medium text-[#12bb9c] hover:opacity-80 transition-opacity">
                        Forgot Password?
                    </Link>
                </div>

                <button 
                    disabled={isLoading} 
                    type="submit" 
                    className={`cursor-pointer w-full py-4 rounded-2xl text-white font-bold text-sm transition-all duration-300 shadow-xl
                        ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#001f3f] hover:bg-[#002d5c] active:scale-[0.98] shadow-[#001f3f]/20'}`}
                >
                    {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                            <i className='fas fa-circle-notch fa-spin'></i> Authenticaring...
                        </span>
                    ) : "Login"}
                </button>

                <p className="text-center text-sm text-gray-600">
                    New here? <Link href="/register" className="text-[#12bb9c] font-bold hover:underline ml-1">Create an account</Link>
                </p>
            </form>
        </div>
    );
}