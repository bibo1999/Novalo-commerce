'use client';

import React, { useContext, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import { authenticationContext } from '@/context/UserContext';
import Link from 'next/link';

export default function Register() {
    let { registerApi } = useContext(authenticationContext);
    const [isLoading, setIsLoading] = useState(false);
    const [messageError, setMessageError] = useState('');
    let router = useRouter();

    async function handleRegister(values) {
        setIsLoading(true);
        let res = await registerApi(values);
        if (res?.data?.message === 'success') {
            router.push('/login');
        } else {
            const errorMsg = res?.response?.data?.message || "Registration failed";
            setMessageError(errorMsg);
        }
        setIsLoading(false);
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
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-12">
            <form 
                onSubmit={formik.handleSubmit} 
                className="max-w-md w-full bg-white border border-gray-200 rounded-2xl p-8 shadow-xl space-y-6"
            >
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-[#001f3f]">Create Account</h2>
                    <p className="mt-2 text-sm text-gray-500 font-medium">Join us today</p>
                </div>

                {messageError && (
                    <div className="bg-red-50 border-l-4 border-red-600 text-red-700 p-3 rounded text-sm font-bold animate-shake">
                        {messageError}
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
                    className={`cursor-pointer w-full py-3 rounded-xl text-white font-bold transition-all duration-300 shadow-lg
                        ${isLoading ? 'bg-gray-400' : 'bg-[#12bb9c] hover:opacity-90 active:scale-95 shadow-[#12bb9c]/20'}`}
                >
                    {isLoading ? <i className='fas fa-spinner fa-spin'></i> : "Register Now"}
                </button>

                <p className="text-center text-sm text-gray-600">
                    Already have an account? <Link href="/login" className="text-[#001f3f] font-bold no-underline hover:underline">Login</Link>
                </p>
            </form>
        </div>
    );
}