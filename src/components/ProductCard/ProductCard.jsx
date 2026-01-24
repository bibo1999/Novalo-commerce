'use client';
import React, { useContext, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cartContext } from '@/context/CartContext';
import toast from 'react-hot-toast';

export default function ProductCard({ product, isBestSeller }) {
  const { addToCart, setIsCartOpen } = useContext(cartContext);
  const [isAdding, setIsAdding] = useState(false);

  async function handleAddToCart(id) {
    setIsAdding(true);
    let res = await addToCart(id);
    if (res?.data?.status === 'success') {
      toast.success('Added to cart successfully!');
      setIsCartOpen(true); //Open drawer automatically
    } else {
      toast.error('Failed to add product');
    }
    setIsAdding(false);
  }

  return (
    <div className="relative w-full max-w-sm bg-white p-4 border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow group">
      
      {isBestSeller && (
        <div className="absolute top-2 left-2 z-10 bg-[#12bb9c] text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-sm uppercase tracking-wider">
          Best Selling
        </div>
      )}

      <Link href={`/productdetails/${product._id}`}>
        <div className="relative h-64 w-full mb-4 overflow-hidden rounded-lg bg-gray-50">
          <Image 
            src={product.imageCover} 
            alt={product.title} 
            fill
            className="object-contain p-2 transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </Link>

      <div>
        <div className="flex items-center space-x-2 mb-3">
          <div className="flex items-center text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className={`w-4 h-4 ${i < Math.floor(product.ratingsAverage) ? 'fill-current' : 'text-gray-300'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z"/>
              </svg>
            ))}
          </div>
          <span className="bg-gray-100 text-gray-600 text-[10px] font-medium px-2 py-0.5 rounded">
            {product.ratingsAverage}
          </span>
        </div>

        <Link href={`/productdetails/${product._id}`}>
          <h5 className="text-sm font-semibold text-[#001f3f] line-clamp-2 min-h-10 hover:text-[#12bb9c] transition-colors">
            {product.title}
          </h5>
        </Link>

        <div className="flex items-center justify-between mt-4">
          <span className="text-xl font-bold text-[#001f3f]">
            EGP {product.price}
          </span>
          <button 
            disabled={isAdding}
            onClick={() => handleAddToCart(product._id)}
            type="button" 
            className="inline-flex items-center text-white bg-[#12bb9c] hover:bg-[#0da085] font-medium rounded-lg text-xs px-3 py-2 transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            {isAdding ? <i className="fa-solid fa-spinner fa-spin me-1"></i> : <svg className="w-4 h-4 me-1.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 4h1.5L9 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8.5-3h9.25L19 7H7.312"/></svg>}
            Add
          </button>
        </div>
      </div>
    </div>
  );
}