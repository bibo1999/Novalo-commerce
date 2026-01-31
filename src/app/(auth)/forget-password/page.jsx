'use client';
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function ForgetPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function sendCode(e) {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await axios.post('https://ecommerce.routemisr.com/api/v1/auth/forgotPasswords', { email });
            if (data.statusMsg === 'success') {
                toast.success(data.message);
                router.push('/verify-code');
                router.refresh(); 
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Error occurred");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <form onSubmit={sendCode} className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl space-y-6">
                <h2 className="text-2xl font-bold text-[#001f3f]">Forgot Password</h2>
                <input 
                    type="email" 
                    placeholder="Enter your email" 
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 border-b-2 border-gray-300 focus:border-[#12bb9c] outline-none transition-colors"
                    required
                />
                <button 
                    disabled={loading}
                    className="cursor-pointer w-full py-3 bg-[#12bb9c] text-white rounded-xl font-bold hover:opacity-90 transition-all"
                >
                    {loading ? <i className="fas fa-spinner fa-spin"></i> : "Send Verification Code"}
                </button>
            </form>
        </div>
    );
}