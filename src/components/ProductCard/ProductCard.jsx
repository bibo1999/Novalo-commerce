'use client';
import React, { useContext, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cartContext } from '@/context/CartContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { HiOutlineShoppingCart, HiOutlineEye } from 'react-icons/hi';
import { AiFillStar, AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { ImSpinner2 } from 'react-icons/im';

export default function ProductCard({ product, isBestSeller, Timer, viewMode = 'grid' }) {
  const { addToCart, setIsCartOpen } = useContext(cartContext);
  const [isAdding, setIsAdding] = useState(false);
  const isList = viewMode === 'list';
  const [isWished, setIsWished] = useState(false);
  const [wishLoading, setWishLoading] = useState(false);

  // Wishlist
  async function handleWishlist(id) {
    if (wishLoading) return;
    
    const token = localStorage.getItem('userToken');
    if (!token) {
      toast.error("Please login first");
      return;
    }

    setWishLoading(true);

    try {
      if (!isWished) {
        // CASE: Add to wishlist
        const { data } = await axios.post(
          `https://ecommerce.routemisr.com/api/v1/wishlist`,
          { productId: id },
          { headers: { token } }
        );
        if (data.status === 'success') {
          setIsWished(true);
          toast.success("Added to wishlist", {
            style: { border: '1px solid #12bb9c', color: '#12bb9c', background: '#0f172a' },
            iconTheme: { primary: '#12bb9c', secondary: '#fff' },
          });
        }
      } else {
        // CASE: Remove from wishlist
        const { data } = await axios.delete(
          `https://ecommerce.routemisr.com/api/v1/wishlist/${id}`,
          { headers: { token } }
        );
        if (data.status === 'success') {
          setIsWished(false);
          toast.success("Removed from wishlist", {
            style: { border: '1px solid #ef4444', color: '#ef4444', background: '#0f172a' },
            iconTheme: { primary: '#ef4444', secondary: '#fff' },
          });
        }
      }
    } catch (error) {
      console.error("Wishlist Error:", error);
      toast.error('Something went wrong');
    } finally {
      setWishLoading(false);
    }
  }

  async function handleAddToCart(id) {
    setIsAdding(true);
    let res = await addToCart(id);
    if (res?.data?.status === 'success') {
      toast.success('Added to cart successfully!');
      setIsCartOpen(true);
    } else {
      toast.error('Failed to add product');
    }
    setIsAdding(false);
  }

  return (
    <div className={`relative w-full transition-all duration-300 group border border-gray-100 rounded-3xl overflow-hidden
      ${isList 
        ? 'flex flex-col md:flex-row items-center gap-8 p-6 bg-[#1e293b]/20 border-gray-700/50 hover:border-[#12bb9c]/50' 
        : 'flex flex-col p-4 bg-white shadow-sm hover:shadow-md'}`}>
      
      {isBestSeller && (
        <div className="absolute top-4 left-4 z-10 bg-[#12bb9c] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
          Best Selling
        </div>
      )}

      {/* Wishlist Button */}
      {!isList && (
        <button 
          onClick={() => handleWishlist(product._id)}
          className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-all cursor-pointer group/wish"
        >
          {wishLoading ? (
            <ImSpinner2 className="animate-spin text-gray-400 text-sm" />
          ) : isWished ? (
            <AiFillHeart className="text-red-500 text-lg" />
          ) : (
            <AiOutlineHeart className="text-gray-400 group-hover/wish:text-red-500 text-lg transition-colors" />
          )}
        </button>
      )}
      {/* Image Section */}
      <Link href={`/productdetails/${product._id}`} className={`shrink-0 ${isList ? 'w-full md:w-64' : 'w-full'}`}>
        <div className={`relative overflow-hidden rounded-2xl bg-gray-50 transition-all
          ${isList ? 'h-64' : 'h-60 mb-4'}`}>
          <Image 
            src={product.imageCover} 
            alt={product.title} 
            fill 
            className="object-contain p-4 transition-transform duration-500 group-hover:scale-110" 
          />
        </div>
      </Link>

      {/* Content Section */}
      <div className={`flex flex-col grow ${isList ? 'text-left' : ''}`}>
        <div className="flex items-center space-x-2 mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <AiFillStar 
                key={i} 
                className={`w-3.5 h-3.5 ${i < Math.floor(product.ratingsAverage) ? 'text-yellow-400' : 'text-gray-200'}`} 
              />
            ))}
          </div>
          <span className="text-[10px] text-gray-400 font-bold">{product.ratingsAverage}</span>
          {isList && <span className="text-[10px] text-gray-500">• {product.category?.name}</span>}
        </div>

        <Link href={`/productdetails/${product._id}`}>
          <h5 className={`font-bold transition-colors line-clamp-2
            ${isList ? 'text-2xl text-white mb-4' : 'text-sm text-[#001f3f] min-h-[40px] group-hover:text-[#12bb9c]'}`}>
            {product.title}
          </h5>
        </Link>

        {isList && (
          <p className="text-gray-400 text-sm mb-6 line-clamp-3 leading-relaxed max-w-2xl">
            {product.description}
          </p>
        )}

        <div className={`mt-auto ${isList ? 'flex flex-col gap-4' : 'pt-4'}`}>
          <div className={`font-black ${isList ? 'text-3xl text-[#12bb9c]' : 'text-lg text-[#001f3f] mb-3'}`}>
            {product.price} <span className="text-xs font-normal opacity-70">EGP</span>
          </div>
          {Timer}
          
          <div className={`flex items-center gap-3 ${isList ? 'justify-start' : 'justify-center'}`}>
            <button 
              disabled={isAdding}
              onClick={() => handleAddToCart(product._id)}
              className={`cursor-pointer bg-[#12bb9c] text-white rounded-xl font-bold hover:bg-[#0da085] transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50
                ${isList ? 'px-8 py-3.5 text-sm' : 'w-full py-2.5 text-xs'}`}
            >
              {isAdding ? <ImSpinner2 className="animate-spin text-sm" /> : (
                <>
                  <HiOutlineShoppingCart className="text-sm" />
                  <span>Add to cart</span>
                </>
              )}
            </button>

            {isList && (
              <Link href={`/productdetails/${product._id}`} 
                className="p-3.5 rounded-xl border border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800 transition-all">
                <HiOutlineEye size={20} />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}