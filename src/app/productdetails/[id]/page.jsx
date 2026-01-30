'use client';

import React, { useState, useEffect, useContext } from 'react'; 
import axios from 'axios';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { useTheme } from '@/hooks/useTheme';
import { cartContext } from '@/context/CartContext'; 
import Skeleton from 'react-loading-skeleton';
import toast from 'react-hot-toast'; 
import 'react-loading-skeleton/dist/skeleton.css';

export default function ProductDetails() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false); 
    const [activeImage, setActiveImage] = useState(0);

    const { addToCart, setIsCartOpen } = useContext(cartContext);

    useTheme("#0f172a", product ? `${product.title} | Novalo` : "Loading Product...");

    useEffect(() => {
        async function getProductDetails() {
            try {
                const { data } = await axios.get(`https://ecommerce.routemisr.com/api/v1/products/${id}`);
                setProduct(data.data);
            } catch (error) {
                console.error("Error fetching product details:", error);
            } finally {
                setIsLoading(false);
            }
        }
        if (id) getProductDetails();
    }, [id]);

    // Handle Add to Cart
    async function handleAddToCart(productId) {
        setIsAdding(true);
        const res = await addToCart(productId);
        
        if (res?.data?.status === 'success') {
            toast.success('Product added to your cart!', {
                style: {
                    borderRadius: '10px',
                    background: '#1e293b',
                    color: '#fff',
                    border: '1px solid #12bb9c'
                },
                iconTheme: {
                    primary: '#12bb9c',
                    secondary: '#fff',
                },
            }
        );
            setIsCartOpen(true);    
    } else {
            toast.error('Failed to add product. Please try again.');
        }
        setIsAdding(false);
    }

    if (isLoading) return <LoadingSkeleton />;

    return (
        <div className="bg-[#0f172a] min-h-screen pt-32 pb-20 text-white">
            <div className="max-w-screen-xl mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    
                    {/* LEFT: Image Gallery */}
                    <div className="lg:col-span-5 space-y-4">
                        <div className="relative aspect-square rounded-3xl overflow-hidden bg-[#1e293b] border border-gray-800">
                            <Image 
                                src={product?.images[activeImage]} 
                                alt={product?.title} 
                                fill 
                                className="object-contain p-8"
                            />
                        </div>
                        <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
                            {product?.images.map((img, index) => (
                                <button 
                                    key={index}
                                    onClick={() => setActiveImage(index)}
                                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                                        activeImage === index ? "border-[#12bb9c]" : "border-gray-800 opacity-50"
                                    }`}
                                >
                                    <Image src={img} alt="thumbnail" fill className="object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT: Product Info */}
                    <div className="lg:col-span-7 flex flex-col justify-center">
                        <span className="text-[#12bb9c] font-bold uppercase tracking-widest text-sm mb-2">
                            {product?.category?.name}
                        </span>
                        <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
                            {product?.title}
                        </h1>
                        
                        <div className="flex items-center gap-4 mb-6">
                            <span className="text-3xl font-bold text-white">
                                {product?.price} EGP
                            </span>
                            <div className="flex items-center text-yellow-400 gap-1 bg-yellow-400/10 px-3 py-1 rounded-full">
                                <i className="fa-solid fa-star text-xs"></i>
                                <span className="text-sm font-bold">{product?.ratingsAverage}</span>
                            </div>
                        </div>

                        <p className="text-gray-400 text-lg leading-relaxed mb-8">
                            {product?.description}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <button 
                                onClick={() => handleAddToCart(product._id)}
                                disabled={isAdding}
                                className="flex-1 bg-[#12bb9c] hover:bg-[#0fa88d] disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-[#12bb9c]/20 uppercase tracking-wider cursor-pointer flex items-center justify-center gap-2"
                            >
                                {isAdding ? (
                                    <span className="animate-spin inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>
                                ) : (
                                    <>
                                        <i className="fa-solid fa-cart-plus"></i>
                                        Add to Cart
                                    </>
                                )}
                            </button>
                            <button className="px-6 py-4 rounded-2xl border border-gray-700 hover:bg-gray-800 transition-all cursor-pointer">
                                <i className="fa-regular fa-heart text-xl"></i>
                            </button>
                        </div>

                        <div className="mt-10 pt-10 border-t border-gray-800 grid grid-cols-2 gap-6">
                            <div>
                                <h4 className="text-gray-500 text-xs uppercase font-bold mb-1">Brand</h4>
                                <p className="font-semibold">{product?.brand?.name}</p>
                            </div>
                            <div>
                                <h4 className="text-gray-500 text-xs uppercase font-bold mb-1">Quantity Available</h4>
                                <p className="font-semibold">{product?.quantity}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function LoadingSkeleton() {
    return (
        <div className="bg-[#0f172a] min-h-screen pt-32 px-4">
            <div className="max-w-screen-xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-5"><Skeleton height={500} borderRadius={24} baseColor="#1e293b" highlightColor="#334155" /></div>
                <div className="lg:col-span-7">
                    <Skeleton width="30%" height={20} baseColor="#1e293b" highlightColor="#334155" />
                    <Skeleton className="my-4" height={60} baseColor="#1e293b" highlightColor="#334155" />
                    <Skeleton count={3} baseColor="#1e293b" highlightColor="#334155" />
                </div>
            </div>
        </div>
    );
}