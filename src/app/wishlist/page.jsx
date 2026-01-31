'use client';

import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import Skeleton from 'react-loading-skeleton';
import toast from 'react-hot-toast';
import { cartContext } from '@/context/CartContext';
import 'react-loading-skeleton/dist/skeleton.css';
import Cookies from 'js-cookie';

export default function Wishlist() {
    const [wishlist, setWishlist] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRemoving, setIsRemoving] = useState(null);
    const { addToCart, setIsCartOpen } = useContext(cartContext);

    

    // 1. Fetch Wishlist Data
    async function getWishlist() {
        try {
            const { data } = await axios.get(`https://ecommerce.routemisr.com/api/v1/wishlist`, { headers: getAuthHeaders() });
            setWishlist(data.data);
        } catch (error) {
            console.error("Error fetching wishlist:", error);
        } finally {
            setIsLoading(false);
        }
    }

    // 2. Remove Item from Wishlist
    async function removeItem(id) {
        setIsRemoving(id);
        try {
            const { data } = await axios.delete(`https://ecommerce.routemisr.com/api/v1/wishlist/${id}`, { headers: getAuthHeaders() });
            if (data.status === "success") {
                toast.success("Removed from wishlist");
                setWishlist(prev => prev.filter(item => item._id !== id));
            }
        } catch (error) {
            toast.error("Failed to remove item");
        } finally {
            setIsRemoving(null);
        }
    }

    // 3. Add to Cart Logic
    async function handleAddToCart(id) {
        const res = await addToCart(id);
        if (res?.data?.status === 'success') {
            toast.success('Added to cart!', {
                style: { background: '#1e293b', color: '#fff', border: '1px solid #12bb9c' },
            });
            setIsCartOpen(true);
        }
    }
    // 4. Helper to get headers safely
    const getAuthHeaders = () => {
        const token = Cookies.get('userToken'); 
        return { token };
    };

    useEffect(() => {
        getWishlist();
    }, []);

    return (
        <div className="bg-[#0f172a] min-h-screen pt-28 pb-20 text-white px-4">
            <div className="max-w-screen-xl mx-auto">
                <div className="flex items-center gap-4 mb-10">
                    <h1 className="text-3xl font-black uppercase tracking-tight">My Wishlist</h1>
                    <div className="h-0.5 flex-1 bg-linear-to-r from-[#12bb9c] to-transparent opacity-30"></div>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <Skeleton key={i} height={200} borderRadius={20} baseColor="#1e293b" highlightColor="#334155" />
                        ))}
                    </div>
                ) : wishlist.length === 0 ? (
                    <div className="text-center py-20 bg-[#1e293b]/30 rounded-3xl border border-dashed border-gray-700">
                        <i className="fa-regular fa-heart text-5xl text-gray-600 mb-4 block"></i>
                        <p className="text-gray-400 text-lg mb-6">Your wishlist is empty.</p>
                        <Link href="/" className="bg-[#12bb9c] px-8 py-3 rounded-xl font-bold uppercase text-xs tracking-widest">
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {wishlist.map((item) => (
                            <div key={item._id} className="group bg-[#1e293b] border border-gray-800 p-4 rounded-2xl flex flex-col sm:flex-row items-center gap-6 transition-all hover:border-[#12bb9c]/50">
                                {/* Image Container */}
                                <div className="relative w-full sm:w-32 h-32 bg-[#0f172a] rounded-xl overflow-hidden p-2">
                                    <Image src={item.imageCover} alt={item.title} fill className="object-contain" />
                                </div>

                                {/* Content */}
                                <div className="flex-1 text-center sm:text-left">
                                    <h3 className="font-bold text-lg line-clamp-1">{item.title}</h3>
                                    <p className="text-[#12bb9c] font-black mt-1">{item.price} EGP</p>
                                    <button 
                                        onClick={() => removeItem(item._id)}
                                        className="text-red-400 text-xs mt-3 hover:text-red-300 transition-colors flex items-center gap-1 mx-auto sm:mx-0 cursor-pointer"
                                    >
                                        {isRemoving === item._id ? (
                                            <span className="animate-spin w-3 h-3 border-2 border-red-400 border-t-transparent rounded-full"></span>
                                        ) : <i className="fa-solid fa-trash-can"></i>}
                                        Remove Item
                                    </button>
                                </div>

                                {/* Actions */}
                                <div className="w-full sm:w-auto">
                                    <button 
                                        onClick={() => handleAddToCart(item._id)}
                                        className="w-full sm:w-auto bg-transparent border border-[#12bb9c] text-[#12bb9c] hover:bg-[#12bb9c] hover:text-white font-bold py-3 px-8 rounded-xl transition-all text-sm uppercase tracking-widest cursor-pointer"
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}