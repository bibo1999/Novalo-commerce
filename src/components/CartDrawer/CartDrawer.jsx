"use client";
import React, { useContext } from "react";
import { cartContext } from "@/context/CartContext";
import Link from "next/link";
import Image from "next/image";
import styles from "./CartDrawer.module.css";

export default function CartDrawer() {
  const {
    isCartOpen,
    setIsCartOpen,
    cartDetails,
    removeItemFromCart,
    numOfCartItems,
    updateProductCount,
  } = useContext(cartContext);

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-9999 flex justify-end">
      {/* Backdrop using CSS Module */}
      <div
        className={styles.backdrop}
        onClick={() => setIsCartOpen(false)}
      />

      {/* Sidebar Content using CSS Module for Animation */}
      <div className={`relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col ${styles.animateSlideIn}`}>
        
        {/* Header */}
        <div className="p-6 border-b flex justify-between items-center bg-[#001f3f] text-white">
          <div>
            <h2 className="text-xl font-bold">Your Cart</h2>
            <p className="text-[10px] text-[#12bb9c] uppercase tracking-widest font-bold">
              {numOfCartItems} Products Added
            </p>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 hover:bg-white/10 rounded-full transition cursor-pointer"
          >
            <i className="fa-solid fa-xmark text-2xl"></i>
          </button>
        </div>

        {/* Products List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cartDetails?.products?.length > 0 ? (
            cartDetails.products.map((item) => (
              <div
                key={item._id}
                className="flex gap-4 border-b pb-4 border-gray-100 items-center"
              >
                <div className="w-20 h-20 relative shrink-0 bg-gray-50 rounded-lg">
                  <Image
                    src={item.product.imageCover}
                    alt={item.product.title}
                    fill
                    className="object-contain p-2"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-[#001f3f] line-clamp-1">
                    {item.product.title}
                  </h4>
                  <p className="text-[#12bb9c] font-bold mt-1">
                    {item.price} EGP
                  </p>

                  <div className="flex justify-between items-center mt-3">
                    {/* Quantity Controls */}
                    <div className="flex items-center border rounded-full border-gray-200 overflow-hidden">
                      <button
                        onClick={() =>
                          updateProductCount(item.product._id, item.count - 1)
                        }
                        disabled={item.count <= 1}
                        className="px-2 py-1 bg-gray-50 hover:bg-gray-100 text-[#001f3f] transition disabled:opacity-30 cursor-pointer"
                      >
                        <i className="fa-solid fa-minus text-[10px]"></i>
                      </button>
                      <span className="px-3 text-xs font-bold text-[#001f3f]">
                        {item.count}
                      </span>
                      <button
                        onClick={() =>
                          updateProductCount(item.product._id, item.count + 1)
                        }
                        className="px-2 py-1 bg-gray-50 hover:bg-gray-100 text-[#001f3f] transition cursor-pointer"
                      >
                        <i className="fa-solid fa-plus text-[10px]"></i>
                      </button>
                    </div>

                    <button
                      onClick={() => removeItemFromCart(item.product._id)}
                      className="text-red-500 hover:text-red-700 transition cursor-pointer p-1"
                    >
                      <i className="fa-solid fa-trash-can text-sm"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            /* Styled Empty State */
            <div className="h-full flex flex-col items-center justify-center p-10 text-center">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                <i className="fa-solid fa-basket-shopping text-4xl text-gray-200"></i>
              </div>
              <h3 className="text-[#001f3f] font-bold text-lg mb-2">
                Your cart is lonely
              </h3>
              <p className="text-gray-400 text-sm mb-8">
                Looks like you didn't add anything to your cart yet.
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="text-[#12bb9c] font-bold uppercase text-xs tracking-widest hover:underline cursor-pointer"
              >
                Start Shopping <i className="fa-solid fa-arrow-right ml-2"></i>
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        {cartDetails?.products?.length > 0 && (
          <div className="p-6 border-t bg-gray-50 space-y-3">
            <div className="flex justify-between items-center mb-4">
              <span className="font-bold text-gray-400 uppercase text-[10px] tracking-widest">
                Total Price
              </span>
              <span className="text-2xl font-bold text-[#001f3f]">
                {cartDetails?.totalCartPrice} EGP
              </span>
            </div>

            <Link
              href="/cart"
              onClick={() => setIsCartOpen(false)}
              className="block w-full border-2 border-[#12bb9c] text-[#12bb9c] text-center py-3 rounded-xl font-bold hover:bg-[#12bb9c] hover:text-white transition-all cursor-pointer"
            >
              View Your Cart
            </Link>

            <Link
              href="/checkout"
              onClick={() => setIsCartOpen(false)}
              className="block w-full bg-[#12bb9c] text-white text-center py-4 rounded-xl font-bold hover:bg-[#0da085] transition-all shadow-lg active:scale-95 cursor-pointer"
            >
              Proceed To Checkout
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}