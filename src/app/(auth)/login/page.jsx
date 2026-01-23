'use client';

import React, { useContext, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authenticationContext } from '@/context/UserContext';
import toast from 'react-hot-toast';

export default function Login() {
    let { loginApi, setUserData } = useContext(authenticationContext);
    let router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [messageError, setMessageError] = useState('');

    async function handleLogin(values) {
        setIsLoading(true);
        let res = await loginApi(values);
        
        if (res?.data?.message === 'success') {
            localStorage.setItem('userToken', res?.data.token);
            setUserData(res?.data.token); 
            toast.success("Welcome Back! 😍", { duration: 2000 });
            router.push('/');
        } else {
            const errorMsg = res?.response?.data?.message || "Invalid email or password";
            setMessageError(errorMsg);
        }
        setIsLoading(false);
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

    // Helper to determine if field is invalid
    const isFieldInvalid = (fieldName) => 
        formik.errors[fieldName] && (formik.touched[fieldName] || formik.submitCount > 0);

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-12">
            <form 
                onSubmit={formik.handleSubmit}
                className="max-w-md w-full bg-white border border-gray-200 rounded-2xl p-8 shadow-xl space-y-8"
            >
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-[#001f3f]">Login Now</h2>
                    <p className="mt-2 text-sm text-gray-500 font-medium">Please enter your details</p>
                </div>

                {messageError && (
                    <div className="flex items-center bg-red-50 border-l-4 border-red-600 text-red-700 p-4 rounded-md">
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

                <div className="flex items-center justify-between">
                    <Link href="/forget-password" size="sm" className="text-sm font-medium text-[#12bb9c] hover:opacity-80 no-underline">
                        Forgot Password?
                    </Link>
                </div>

                <button 
                    disabled={isLoading} 
                    type="submit" 
                    className={`w-full py-3 rounded-xl text-white font-bold text-sm transition-all duration-300 shadow-lg
                        ${isLoading ? 'bg-gray-400' : 'bg-[#001f3f] hover:bg-[#002d5c] active:scale-95 shadow-[#001f3f]/20'}`}
                >
                    {isLoading ? <i className='fas fa-spinner fa-spin'></i> : "Login"}
                </button>

                <p className="text-center text-sm text-gray-600">
                    New here? <Link href="/register" className="text-[#12bb9c] font-bold no-underline hover:underline">Create an account</Link>
                </p>
            </form>
        </div>
    );
}