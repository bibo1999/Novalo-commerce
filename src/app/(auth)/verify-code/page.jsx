'use client';
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function VerifyCode() {
    const [resetCode, setResetCode] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function verify(e) {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await axios.post('https://ecommerce.routemisr.com/api/v1/auth/verifyResetCode', { resetCode });
            if (data.status === 'Success') {
                toast.success("Code Verified!");
                router.push('/reset-password'); // Move to final step
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Invalid Code");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <form onSubmit={verify} className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl space-y-6 text-center">
                <h2 className="text-2xl font-bold text-[#001f3f]">Verify Code</h2>
                <p className="text-sm text-gray-500">Enter the 6-digit code sent to your email</p>
                <input 
                    type="text" 
                    placeholder="000000" 
                    onChange={(e) => setResetCode(e.target.value)}
                    className="text-center text-2xl tracking-widest w-full p-3 border-b-2 border-gray-300 focus:border-[#12bb9c] outline-none"
                    required
                />
                <button 
                    disabled={loading}
                    className="w-full py-3 bg-[#001f3f] text-white rounded-xl font-bold hover:bg-[#002d5c]"
                >
                    {loading ? <i className="fas fa-spinner fa-spin"></i> : "Verify Code"}
                </button>
            </form>
        </div>
    );
}