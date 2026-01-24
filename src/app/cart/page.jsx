'use client';
import React, { useContext, useState } from 'react';
import { cartContext } from '@/context/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import styles from './Cart.module.css';

export default function CartPage() {
  const { cartDetails, removeItemFromCart, updateProductCount, numOfCartItems, removeCart } = useContext(cartContext);
  const [loadingItems, setLoadingItems] = useState({});
  const [globalLoading, setGlobalLoading] = useState(false); // For Summary Section

  const handleUpdateCount = async (id, count) => {
    // Start loaders
    setLoadingItems(prev => ({ ...prev, [id]: true }));
    setGlobalLoading(true);

    try {
      
      await updateProductCount(id, count);
    } catch (error) {
      console.error("Update failed", error);
    } finally {
      setLoadingItems(prev => ({ ...prev, [id]: false }));
      setGlobalLoading(false);
    }
  };

  const handleRemove = async (id) => {
    setGlobalLoading(true);
    await removeItemFromCart(id);
    setGlobalLoading(false);
  };

  if (!cartDetails || cartDetails.products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <h1 className="text-2xl font-bold text-[#001f3f] mb-8">Your Shopping Bag is empty</h1>
        <Link href="/" className="bg-[#12bb9c] text-white px-10 py-3 rounded-md font-bold hover:bg-[#0da085] transition cursor-pointer">
          Shop New Arrivals
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pt-32 pb-20 max-w-7xl">
      <div className="flex justify-between items-baseline mb-10 border-b border-gray-100 pb-6">
        <h1 className="text-3xl font-medium text-[#001f3f]">Shopping Bag ({numOfCartItems})</h1>
        <button onClick={removeCart} className="text-gray-400 hover:text-red-500 text-xs font-bold uppercase tracking-widest cursor-pointer transition-colors">
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-8 space-y-10">
          {cartDetails.products.map((item) => (
            <div key={item._id} className="relative flex items-start gap-6 border-b border-gray-100 pb-10 last:border-0">
              
              {/* Loader Overlay for specific item */}
              {loadingItems[item.product._id] && (
                <div className={styles.loadingOverlay}>
                  <i className="fa-solid fa-circle-notch fa-spin text-[#12bb9c] text-2xl"></i>
                </div>
              )}

              <div className="w-28 h-36 relative bg-[#f9f9f9] rounded-sm shrink-0 overflow-hidden">
                <Image src={item.product.imageCover} alt={item.product.title} fill className="object-contain p-2" />
              </div>

              <div className="flex-1 flex flex-col justify-between self-stretch">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h3 className="font-bold text-[#001f3f] text-base leading-tight max-w-sm">
                      {item.product.title}
                    </h3>
                    <p className="text-[#12bb9c] font-bold text-sm">
                      {item.price} EGP
                    </p>
                    
                    <div className={`${styles.quantitySelector} mt-4`}>
                      <button 
                        onClick={() => handleUpdateCount(item.product._id, item.count - 1)}
                        disabled={item.count <= 1 || loadingItems[item.product._id]}
                        className={styles.quantityBtn}
                      >
                        <i className="fa-solid fa-minus text-[10px]"></i>
                      </button>
                      <span className="w-8 text-center font-bold text-[#001f3f] text-sm">{item.count}</span>
                      <button 
                        onClick={() => handleUpdateCount(item.product._id, item.count + 1)}
                        disabled={loadingItems[item.product._id]}
                        className={styles.quantityBtn}
                      >
                        <i className="fa-solid fa-plus text-[10px]"></i>
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-bold text-[#001f3f]">
                      {item.price * item.count} EGP
                    </p>
                  </div>
                </div>

                <button 
                  onClick={() => handleRemove(item.product._id)}
                  className={`${styles.removeButton} w-fit flex items-center gap-2 text-gray-400 hover:text-red-500 text-[10px] font-bold uppercase tracking-widest mt-4 cursor-pointer transition-all`}
                >
                  <i className={`fa-solid fa-trash-can ${styles.trashIcon}`}></i> 
                  <span className="border-b border-transparent hover:border-red-500">Remove Item</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Sidebar with its own loader */}
        <div className="lg:col-span-4 relative">
          <div className="bg-[#fcfcfc] border border-gray-100 rounded-xl p-8 sticky top-32 overflow-hidden">
            
            {/* Sidebar Loader Overlay */}
            {globalLoading && (
              <div className={`${styles.loadingOverlay} ${styles.summaryLoader}`}>
                <i className="fa-solid fa-circle-notch fa-spin text-[#12bb9c] text-2xl"></i>
              </div>
            )}

            <h2 className="text-xl font-bold text-[#001f3f] mb-6">Summary</h2>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Subtotal</span>
                <span className="text-[#001f3f] font-bold">{cartDetails.totalCartPrice} EGP</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Shipping</span>
                <span className="text-[#12bb9c] font-bold">Free</span>
              </div>
              <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
                <span className="text-lg font-bold text-[#001f3f]">Total Price</span>
                <span className="text-2xl font-bold text-[#001f3f]">{cartDetails.totalCartPrice} EGP</span>
              </div>
            </div>
            <Link href="/checkout" className="block w-full bg-[#001f3f] text-white text-center py-4 rounded-md font-bold hover:bg-black transition-all shadow-md cursor-pointer">
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}