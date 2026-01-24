'use client';
import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { authenticationContext } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function Navbar() {
  const { userData, logOut } = useContext(authenticationContext);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  const [activeMenu, setActiveMenu] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [isSubLoading, setIsSubLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      const { data } = await axios.get('https://ecommerce.routemisr.com/api/v1/categories');
      setCategories(data.data);
      if (data.data.length > 0) setHoveredCategory(data.data[0]);
    } catch (err) {
      console.error("Error fetching categories", err);
    }
  }

  async function handleCategoryHover(category) {
    if (hoveredCategory?._id === category._id) return;
    setHoveredCategory(category);
    setIsSubLoading(true);
    try {
      const { data } = await axios.get(`https://ecommerce.routemisr.com/api/v1/categories/${category._id}/subcategories`);
      setSubCategories(data.data);
    } catch (err) {
      setSubCategories([]);
    } finally {
      setIsSubLoading(false);
    }
  }

  const toggleMenu = (menuName) => setActiveMenu(activeMenu === menuName ? null : menuName);
  const closeAll = () => setActiveMenu(null);

  const handleSignOut = () => {
    if (typeof logOut === 'function') {
      logOut();
      closeAll();
      router.push('/login');
    }
  };

  if (!mounted) return <nav className="bg-[#001f3f] h-20 w-full fixed top-0 z-50"></nav>;

  return (
    <nav className="bg-[#001f3f] antialiased fixed w-full top-0 z-50 shadow-lg text-white" onMouseLeave={() => setActiveMenu(null)}>
      <div className="max-w-screen-xl px-4 mx-auto py-4">
        <div className="flex items-center justify-between relative">
          
          {/* 1. LEFT: Logo */}
          <div className="flex shrink-0">
            <Link href="/" onClick={closeAll}>
              <Image className="w-auto h-8 brightness-200" src="/assets/logo.svg" alt="Logo" width={120} height={32} priority />
            </Link>
          </div>

          {/* 2. MIDDLE: Center Navigation Links (Hidden on Mobile) */}
          <div className="hidden lg:flex flex-grow justify-center">
            <ul className="flex items-center gap-10 list-none m-0 p-0">
              <li><Link href="/" className="text-[13px] uppercase tracking-wider font-semibold hover:text-[#12bb9c] transition">Home</Link></li>
              <li><Link href="/products" className="text-[13px] uppercase tracking-wider font-semibold hover:text-[#12bb9c] transition">Products</Link></li>
              <li onMouseEnter={() => setActiveMenu('categories')}>
                <button className={`text-[13px] uppercase tracking-wider font-semibold transition flex items-center gap-1 ${activeMenu === 'categories' ? 'text-[#12bb9c]' : 'hover:text-[#12bb9c]'}`}>
                  Categories <i className="fa-solid fa-chevron-down text-[10px] ml-1"></i>
                </button>
              </li>
              <li><Link href="/allorders" className="text-[13px] uppercase tracking-wider font-semibold hover:text-[#12bb9c] transition">Orders</Link></li>
            </ul>
          </div>

          {/* 3. RIGHT: Icons */}
          <div className="flex items-center space-x-2 shrink-0">
            {/* Cart Icon */}
            <div className="relative">
              <button onClick={() => toggleMenu('cart')} className="inline-flex items-center p-2 hover:bg-white/10 rounded-lg transition-colors text-sm font-medium">
                <svg className="w-5 h-5 lg:me-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                <span className="hidden sm:inline">My Cart</span>
              </button>
              {activeMenu === 'cart' && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl py-2 text-gray-800 z-50 border border-gray-200">
                  <div className="px-4 py-2 font-bold border-b text-[#001f3f]">Cart Summary</div>
                  <div className="p-8 text-center text-sm text-gray-400">Your cart is empty</div>
                  <div className="px-2 pb-1">
                    <Link href="/cart" onClick={closeAll} className="block text-center bg-[#12bb9c] text-white py-2 rounded font-semibold hover:opacity-90 transition">View Cart</Link>
                  </div>
                </div>
              )}
            </div>

            {/* User Icon */}
            <div className="relative">
              <button onClick={() => toggleMenu('user')} className="inline-flex items-center p-2 hover:bg-white/10 rounded-lg transition-colors text-sm font-medium">
                <svg className="w-5 h-5 me-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                {userData?.name ? `Hi, ${userData.name.split(' ')[0]}` : 'Account'}
              </button>
              {activeMenu === 'user' && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl overflow-hidden z-50 border border-gray-200 text-gray-800">
                  <div className="bg-gray-50 px-4 py-2 text-[10px] text-gray-400 uppercase font-bold tracking-widest border-b">Settings</div>
                  {userData ? (
                    <>
                      <Link href="/profile" onClick={closeAll} className="block px-4 py-2 hover:bg-gray-100 transition">My Account</Link>
                      <Link href="/allorders" onClick={closeAll} className="block px-4 py-2 hover:bg-gray-100 transition">My Orders</Link>
                      <button onClick={handleSignOut} className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 border-t font-semibold transition">Sign Out</button>
                    </>
                  ) : (
                    <>
                      <Link href="/login" onClick={closeAll} className="block px-4 py-2 hover:bg-gray-100 font-medium">Login</Link>
                      <Link href="/register" onClick={closeAll} className="block px-4 py-2 hover:bg-gray-100 font-medium">Register</Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Hamburger Button */}
            <button onClick={() => toggleMenu('mobile')} className="lg:hidden p-2 hover:bg-white/10 rounded-md transition">
                <i className={`fa-solid ${activeMenu === 'mobile' ? 'fa-xmark' : 'fa-bars'} text-xl`}></i>
            </button>
          </div>
        </div>

        {/* MOBILE MENU CONTENT */}
        <div className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${activeMenu === 'mobile' ? 'max-h-screen opacity-100 py-6' : 'max-h-0 opacity-0'}`}>
            <ul className="flex flex-col space-y-4 px-2">
                <li><Link href="/" onClick={closeAll} className="block text-lg font-medium hover:text-[#12bb9c]">Home</Link></li>
                <li><Link href="/products" onClick={closeAll} className="block text-lg font-medium hover:text-[#12bb9c]">Products</Link></li>
                <li><Link href="/categories" onClick={closeAll} className="block text-lg font-medium hover:text-[#12bb9c]">Categories</Link></li>
                <li><Link href="/allorders" onClick={closeAll} className="block text-lg font-medium hover:text-[#12bb9c]">My Orders</Link></li>
                <hr className="border-white/10" />
                {!userData && (
                    <div className="flex flex-col space-y-3 pt-2">
                        <Link href="/login" onClick={closeAll} className="text-center bg-[#12bb9c] py-3 rounded-lg font-bold">Login</Link>
                        <Link href="/register" onClick={closeAll} className="text-center border border-white py-3 rounded-lg">Register</Link>
                    </div>
                )}
            </ul>
        </div>

        {/* MEGA MENU OVERLAY (Desktop Only) */}
        {activeMenu === 'categories' && (
          <div className="absolute left-0 top-full w-full bg-white text-gray-800 shadow-2xl border-t border-gray-100 hidden lg:block" onMouseLeave={closeAll}>
            <div className="max-w-screen-xl mx-auto grid grid-cols-12 min-h-[380px]">
              <div className="col-span-3 border-r border-gray-100 p-6 bg-gray-50/50">
                <h3 className="font-bold text-[#001f3f] text-[11px] uppercase mb-4 tracking-widest opacity-60">Categories</h3>
                <div className="space-y-1">
                  {categories.length > 0 ? categories.map(cat => (
                    <Link key={cat._id} href={`/categories/${cat._id}`} onMouseEnter={() => handleCategoryHover(cat)} onClick={closeAll}
                      className={`block px-4 py-2 rounded-lg text-sm transition-all ${hoveredCategory?._id === cat._id ? 'bg-[#12bb9c] text-white shadow-md' : 'hover:bg-gray-200 text-gray-700'}`}>
                      {cat.name}
                    </Link>
                  )) : <Skeleton count={6} height={35} />}
                </div>
              </div>

              <div className="col-span-5 p-8">
                <h3 className="font-bold text-[#001f3f] text-[11px] uppercase mb-6 tracking-widest opacity-60">{hoveredCategory?.name} Brands</h3>
                {isSubLoading ? <Skeleton count={8} height={22} className="mb-2" /> : (
                  <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                    {subCategories.length > 0 ? subCategories.map(sub => (
                      <Link key={sub._id} href={`/products?sub=${sub._id}`} onClick={closeAll} className="text-sm text-gray-500 hover:text-[#12bb9c] transition-colors flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-200"></span> {sub.name}
                      </Link>
                    )) : <p className="text-xs text-gray-400 italic">No sub-categories available</p>}
                  </div>
                )}
              </div>

              <div className="col-span-4 p-8 flex items-center justify-center">
                <Link href={`/categories/${hoveredCategory?._id}`} onClick={closeAll} className="relative w-full h-[280px] group/img overflow-hidden rounded-2xl shadow-lg">
                  <Image src={hoveredCategory?.image || '/placeholder.png'} fill className="object-cover transition-transform duration-500 group-hover/img:scale-110" alt="category visual" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#001f3f]/80 to-transparent flex flex-col justify-end p-6">
                    <span className="text-white text-xs uppercase tracking-[0.2em] font-bold mb-1 opacity-80">Explore</span>
                    <h4 className="text-white font-bold text-xl">{hoveredCategory?.name}</h4>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}