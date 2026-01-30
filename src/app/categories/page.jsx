'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useTheme } from '@/hooks/useTheme';

export default function AllCategories() {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useTheme("#0f172a", "Categories | Novalo");

    useEffect(() => {
        async function fetchCategories() {
            try {
                const { data } = await axios.get('https://ecommerce.routemisr.com/api/v1/categories');
                setCategories(data.data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchCategories();
    }, []);

    return (
        <div className="bg-[#0f172a] min-h-screen pt-28 pb-20 text-white">
            <div className="max-w-screen-xl mx-auto px-4">
                
                <div className="mb-12">
                    <h1 className="text-4xl font-black uppercase tracking-tight mb-2">
                        Explore <span className="text-[#12bb9c]">Categories</span>
                    </h1>
                    <p className="text-gray-400">Find exactly what you're looking for by browsing our departments.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {isLoading ? (
                        [...Array(8)].map((_, i) => (
                            <div key={i} className="rounded-3xl overflow-hidden bg-[#1e293b]/20 border border-gray-800">
                                <Skeleton height={250} baseColor="#1e293b" highlightColor="#334155" />
                                <div className="p-5 text-center">
                                    <Skeleton width="60%" baseColor="#1e293b" />
                                </div>
                            </div>
                        ))
                    ) : (
                        categories.map((category) => (
                            <Link 
                                href={`/categories/${category._id}`} 
                                key={category._id} 
                                className="group relative rounded-3xl overflow-hidden bg-[#1e293b] border border-gray-700/50 hover:border-[#12bb9c] transition-all duration-300 cursor-pointer shadow-xl hover:-translate-y-2 block"
                            >
                                <div className="h-64 relative overflow-hidden">
                                    <Image 
                                        src={category.image} 
                                        alt={category.name} 
                                        fill 
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    {/* Overlay Gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent opacity-60"></div>
                                    
                                    {/* Optional "View" badge that appears on hover */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="bg-[#12bb9c] text-white text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-full shadow-lg">
                                            View Products
                                        </span>
                                    </div>
                                </div>

                                <div className="p-6 text-center">
                                    <h3 className="text-xl font-bold group-hover:text-[#12bb9c] transition-colors">
                                        {category.name}
                                    </h3>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}