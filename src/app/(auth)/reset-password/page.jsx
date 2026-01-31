'use client';
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function ResetPassword() {
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleReset(e) {
        e.preventDefault();
        setLoading(true);
        try {
            // The API requires the email and the NEW password
            const { data } = await axios.put('https://ecommerce.routemisr.com/api/v1/auth/resetPassword', {
                email: email,
                newPassword: newPassword
            });

            if (data.token) {
                toast.success("Password Updated! Logging you in...");
                localStorage.setItem('userToken', data.token);
                router.push('/login');
                router.refresh();
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Reset failed");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <form onSubmit={handleReset} className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl space-y-6">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-[#001f3f]">Set New Password</h2>
                    <p className="text-gray-500 text-sm mt-2">Almost there! Choose a strong password.</p>
                </div>

                <div className="space-y-4">
                    <input 
                        type="email" 
                        placeholder="Confirm your email" 
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 border-b-2 border-gray-300 focus:border-[#12bb9c] outline-none"
                        required
                    />
                    <input 
                        type="password" 
                        placeholder="Enter new password" 
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full p-3 border-b-2 border-gray-300 focus:border-[#12bb9c] outline-none"
                        required
                    />
                </div>

                <button 
                    disabled={loading}
                    className="cursor-pointer w-full py-3 bg-[#12bb9c] text-white rounded-xl font-bold hover:opacity-90 shadow-lg shadow-[#12bb9c]/20 transition-all"
                >
                    {loading ? <i className="fas fa-spinner fa-spin"></i> : "Complete Reset"}
                </button>
            </form>
        </div>
    );
}