'use client';

import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { authenticationContext } from "@/context/UserContext";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { userData, logOut } = useContext(authenticationContext);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  
  const [activeMenu, setActiveMenu] = useState(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleMenu = (menuName) => {
    setActiveMenu(activeMenu === menuName ? null : menuName);
  };

  const closeAll = () => setActiveMenu(null);

  // New Logout handler with redirect
  const handleSignOut = () => {
    if (typeof logOut === 'function') {
        logOut();
        closeAll();
        router.push('/login');
    } else {
        console.error("logOut function is missing from Context Provider");
    }
};

  if (!mounted) return <nav className="bg-[#001f3f] h-20 w-full fixed top-0 z-50"></nav>;

  return (
    <nav className="bg-[#001f3f] antialiased fixed w-full top-0 z-50 shadow-lg text-white">
      <div className="max-w-screen-xl px-4 mx-auto py-4">
        <div className="flex items-center justify-between">
          
          <div className="flex items-center space-x-8">
            <div className="shrink-0">
              <Link href="/" onClick={closeAll} className="flex items-center">
                <Image 
                  className="w-auto h-8 brightness-200" 
                  src="/assets/logo.svg" 
                  alt="Logo" 
                  width={150} 
                  height={32} 
                />
              </Link>
            </div>

            <ul className="hidden lg:flex items-center justify-start gap-6 md:gap-8 py-3 list-none m-0 p-0">
              <li>
                <Link href="/" className="text-sm font-medium text-gray-200 hover:text-[#12bb9c] transition no-underline">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-sm font-medium text-gray-200 hover:text-[#12bb9c] transition no-underline">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/allorders" className="text-sm font-medium text-gray-200 hover:text-[#12bb9c] transition no-underline">
                  Orders
                </Link>
              </li>
            </ul>
          </div>

          <div className="flex items-center space-x-2">
            
            {/* 1. Cart Dropdown Section */}
            <div className="relative">
              <button
                onClick={() => toggleMenu('cart')}
                className="inline-flex items-center rounded-lg justify-center p-2 hover:bg-white/10 text-sm font-medium text-white transition-colors"
              >
                <svg className="w-5 h-5 lg:me-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="hidden sm:flex">My Cart</span>
              </button>

              {activeMenu === 'cart' && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl py-2 text-gray-800 z-50 border border-gray-200">
                  <div className="px-4 py-2 font-bold border-b text-navy-900">Cart Summary</div>
                  <div className="p-4 text-center text-sm text-gray-500 font-medium">Your cart is empty</div>
                  <div className="px-2">
                    <Link 
                      href="/cart" 
                      onClick={closeAll}
                      className="block text-center bg-[#12bb9c] text-white py-2 rounded no-underline hover:opacity-90 transition font-semibold"
                    >
                      View Cart
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* 2. Account Dropdown Section */}
            <div className="relative">
              <button
                onClick={() => toggleMenu('user')}
                className="inline-flex items-center rounded-lg justify-center p-2 hover:bg-white/10 text-sm font-medium text-white transition-colors"
              >
                <svg className="w-5 h-5 me-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Account
              </button>

              {activeMenu === 'user' && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl overflow-hidden z-50 border border-gray-200">
                  <ul className="text-gray-800 text-sm list-none p-0 m-0">
                    {userData ? (
                      <>
                        <li className="border-b bg-gray-50 px-4 py-2 text-xs text-gray-500 uppercase font-bold tracking-wider">User Menu</li>
                        <li><Link href="/profile" onClick={closeAll} className="block px-4 py-2 hover:bg-gray-100 no-underline text-gray-800">My Account</Link></li>
                        <li><Link href="/allorders" onClick={closeAll} className="block px-4 py-2 hover:bg-gray-100 no-underline text-gray-800">My Orders</Link></li>
                        <li>
                           <button 
                             onClick={handleSignOut} 
                             className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 border-t font-semibold transition-colors"
                           >
                             Sign Out
                           </button>
                        </li>
                      </>
                    ) : (
                      <>
                        <li className="border-b bg-gray-50 px-4 py-2 text-xs text-gray-500 uppercase font-bold tracking-wider">Welcome</li>
                        <li><Link href="/login" onClick={closeAll} className="block px-4 py-2 hover:bg-gray-100 no-underline text-gray-800 font-medium">Login</Link></li>
                        <li><Link href="/register" onClick={closeAll} className="block px-4 py-2 hover:bg-gray-100 no-underline text-gray-800 font-medium">Register</Link></li>
                      </>
                    )}
                  </ul>
                </div>
              )}
            </div>

            {/* 3. Mobile Hamburger Menu */}
            <button 
              onClick={() => toggleMenu('menu')}
              className="lg:hidden p-2 hover:bg-white/10 rounded-md transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
        </div>

        {activeMenu === 'menu' && (
          <div className="lg:hidden mt-4 bg-[#001f3f]/90 border border-white/10 rounded-lg p-4 space-y-3">
            <Link href="/" onClick={closeAll} className="block text-gray-200 hover:text-[#12bb9c] no-underline font-medium">Home</Link>
            <Link href="/products" onClick={closeAll} className="block text-gray-200 hover:text-[#12bb9c] no-underline font-medium">Products</Link>
            <Link href="/allorders" onClick={closeAll} className="block text-gray-200 hover:text-[#12bb9c] no-underline font-medium">Orders</Link>
          </div>
        )}
      </div>
    </nav>
  );
}