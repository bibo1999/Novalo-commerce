'use client';

import React, { useContext, useEffect, useState } from 'react';
import { authenticationContext } from '@/context/UserContext';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; 
import { useTheme } from '@/hooks/useTheme';

export default function Profile() {
    
    const { userData } = useContext(authenticationContext); 
    const [orders, setOrders] = useState([]);
    const [userName, setUserName] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter(); // Initialize the router hook

    useTheme("#0f172a", "MyProfile | Novalo");

    useEffect(() => {
        // 1. Check if we are in the browser
        if (typeof window !== 'undefined') {
            const localToken = localStorage.getItem('userToken');
            
            console.log("1. UseEffect Triggered. Context status:", !!userData, "Local status:", !!localToken);

            // 2. Only redirect if BOTH context and localStorage are empty
            if (!userData && !localToken) {
                 console.log("No token found anywhere. Redirecting to login...");
                 router.push('/login');
                 setIsLoading(false); 
                 return;
            }

            // 3. Check and get the localToken if userData hasn't caught up yet
            const tokenToUse = userData || localToken;

            if (tokenToUse) {
                try {
                    const decoded = jwtDecode(tokenToUse);
                    console.log("2. Token Decoded Successfully:", decoded);
                    setUserName(decoded.name);
                    fetchOrders(decoded.id);
                } catch (error) {
                    console.error("Error: Token decoding failed:", error);
                    setIsLoading(false);
                }
            }
        }
    }, [userData, router]);

    async function fetchOrders(id) {
        console.log("3. Fetching orders for User ID:", id);
        try {
            const { data } = await axios.get(`https://ecommerce.routemisr.com/api/v1/orders/user/${id}`);
            console.log("4. Orders Data Received:", data);
            setOrders(data);
        } catch (err) {
            console.error("Error: Fetching orders failed:", err.response?.data || err.message);
        } finally {
            console.log("5. Setting Loading to false");
            setIsLoading(false);
        }
    }

    if (isLoading) return (
        <div className="h-screen flex flex-col items-center justify-center">
            <i className="fas fa-spinner fa-spin text-3xl text-[#12bb9c] mb-4"></i>
            <p className="text-gray-500 animate-pulse">Loading your profile data...</p>
        </div>
    );

    return (
        <div className="container mx-auto p-6 mt-20 space-y-8">
            {/* User Header */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-6">
                <div className="w-20 h-20 bg-[#12bb9c]/10 rounded-full flex items-center justify-center text-[#12bb9c] text-3xl font-bold">
                    {userName?.charAt(0).toUpperCase()}
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-[#001f3f]">{userName}</h1>
                    <Link href="/forget-password" title="Security Settings" className="text-sm text-[#12bb9c] hover:underline">
                        Change Security Settings
                    </Link>
                </div>
            </div>

            {/* Orders Summary */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 bg-[#001f3f] text-white flex justify-between items-center">
                    <h2 className="text-xl font-bold">Recent Orders</h2>
                    <span className="bg-[#12bb9c] px-3 py-1 rounded-full text-xs">{orders.length} Total</span>
                </div>
                
                <div className="p-6">
                    {orders.length === 0 ? (
                        <div className="text-center py-10">
                             <p className="text-gray-500">No orders found.</p>
                             <Link href="/" className="text-[#12bb9c] font-bold">Go Shopping</Link>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-gray-400 text-sm uppercase border-b">
                                        <th className="pb-4 px-2">Order ID</th>
                                        <th className="pb-4 px-2">Date</th>
                                        <th className="pb-4 px-2">Payment</th>
                                        <th className="pb-4 px-2">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order) => (
                                        <tr key={order._id} className="border-b last:border-0 hover:bg-gray-50">
                                            <td className="py-4 px-2 font-mono text-xs text-gray-500">#{order.id}</td>
                                            <td className="py-4 px-2 text-sm">{new Date(order.createdAt).toLocaleDateString()}</td>
                                            <td className="py-4 px-2">
                                                <span className={`text-[10px] font-bold px-2 py-1 rounded ${order.isPaid ? 'bg-green-100 text-[#12bb9c]' : 'bg-yellow-100 text-yellow-700'}`}>
                                                    {order.isPaid ? 'PAID' : 'PENDING'}
                                                </span>
                                            </td>
                                            <td className="py-4 px-2 font-bold text-[#12bb9c]">{order.totalOrderPrice} EGP</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}