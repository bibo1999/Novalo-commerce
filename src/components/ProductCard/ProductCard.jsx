'use client';
import React, { useContext, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cartContext } from '@/context/CartContext';
import toast from 'react-hot-toast';
import { AiFillStar } from 'react-icons/ai';
import { HiOutlineShoppingCart } from 'react-icons/hi';
import { ImSpinner2 } from 'react-icons/im';

export default function ProductCard({ product, isBestSeller }) {
  const { addToCart, setIsCartOpen } = useContext(cartContext);
  const [isAdding, setIsAdding] = useState(false);

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
    <div className="relative w-full bg-white p-4 border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all group h-full flex flex-col">
      {isBestSeller && (
        <div className="absolute top-2 left-2 z-10 bg-[#12bb9c] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
          Best Selling
        </div>
      )}

      <Link href={`/productdetails/${product._id}`}>
        <div className="relative h-60 w-full mb-4 overflow-hidden rounded-xl bg-gray-50">
          <Image 
            src={product.imageCover} 
            alt={product.title} 
            fill 
            className="object-contain p-4 transition-transform duration-500 group-hover:scale-110" 
          />
        </div>
      </Link>

      <div className="flex flex-col flex-grow">
        <div className="flex items-center space-x-2 mb-2">
          <div className="flex items-center text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <AiFillStar 
                key={i} 
                className={`w-3.5 h-3.5 ${i < Math.floor(product.ratingsAverage) ? 'text-yellow-400' : 'text-gray-200'}`} 
              />
            ))}
          </div>
          <span className="text-[10px] text-gray-400 font-bold">{product.ratingsAverage}</span>
        </div>

        <Link href={`/productdetails/${product._id}`}>
          <h5 className="text-sm font-bold text-[#001f3f] line-clamp-2 min-h-[40px] group-hover:text-[#12bb9c] transition-colors">
            {product.title}
          </h5>
        </Link>

        <div className="mt-auto pt-4">
          <div className="text-lg font-black text-[#001f3f] mb-3">EGP {product.price}</div>
          <button 
            disabled={isAdding}
            onClick={() => handleAddToCart(product._id)}
            className="cursor-pointer w-full bg-[#12bb9c] text-white py-2.5 rounded-xl text-xs font-bold hover:bg-[#0da085] transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
          >
            {isAdding ? (
              <ImSpinner2 className="animate-spin text-sm" />
            ) : (
              <>
                <HiOutlineShoppingCart className="text-sm" />
                <span >Add to cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}