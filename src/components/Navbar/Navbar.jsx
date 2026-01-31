"use client";
import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { authenticationContext } from "@/context/UserContext";
import { cartContext } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function Navbar() {
  const { userData, logOut } = useContext(authenticationContext);
  const { numOfCartItems, setIsCartOpen } = useContext(cartContext);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  const [activeMenu, setActiveMenu] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [isSubLoading, setIsSubLoading] = useState(false);

  // Wishlist state
  const [wishlistCount, setWishlistCount] = useState(0);

  useEffect(() => {
    setMounted(true);
    fetchCategories();
    getWishlistCount();

    // Listen for custom event to update count when items are added/removed elsewhere
    window.addEventListener('wishlistUpdated', getWishlistCount);
    return () => window.removeEventListener('wishlistUpdated', getWishlistCount);
  }, []);

  async function getWishlistCount() {
    const token = localStorage.getItem('userToken');
    if (!token) return;
    try {
      const { data } = await axios.get(`https://ecommerce.routemisr.com/api/v1/wishlist`, {
        headers: { token }
      });
      // Handle different API response structures
      setWishlistCount(data.count || data.data?.length || 0);
    } catch (error) {
      console.error("Error fetching wishlist count", error);
    }
  }

  async function fetchCategories() {
    try {
      const { data } = await axios.get(
        "https://ecommerce.routemisr.com/api/v1/categories",
      );
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
      const { data } = await axios.get(
        `https://ecommerce.routemisr.com/api/v1/categories/${category._id}/subcategories`,
      );
      setSubCategories(data.data);
    } catch (err) {
      setSubCategories([]);
    } finally {
      setIsSubLoading(false);
    }
  }

  const toggleMenu = (menuName) =>
    setActiveMenu(activeMenu === menuName ? null : menuName);
  
  const closeAll = () => setActiveMenu(null);

  const handleSignOut = () => {
    if (typeof logOut === "function") {
      logOut();
      closeAll();
      router.push("/login");
    }
  };

  if (!mounted)
    return <nav className="bg-[#001f3f] h-20 w-full fixed top-0 z-50"></nav>;

  return (
    <nav
      className="bg-[#001f3f] antialiased fixed w-full top-0 z-50 shadow-lg text-white"
      onMouseLeave={() => setActiveMenu(null)}
    >
      <div className="max-w-screen-xl px-4 mx-auto py-4">
        <div className="flex items-center justify-between relative">
          
          {/* 1. LEFT: Logo */}
          <div className="flex shrink-0">
            <Link href="/" onClick={closeAll}>
              <div className="h-12 w-36 relative">
                <Image
                  src="/assets/logo.svg"
                  alt="Logo"
                  fill
                  className="object-contain brightness-200"
                  priority
                />
              </div>
            </Link>
          </div>

          {/* 2. MIDDLE: Desktop Nav */}
          <div className="hidden lg:flex grow justify-center">
            <ul className="flex items-center gap-10 list-none m-0 p-0">
              <li>
                <Link href="/" className="text-[13px] uppercase tracking-wider font-semibold hover:text-[#12bb9c] transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/productdetails" className="text-[13px] uppercase tracking-wider font-semibold hover:text-[#12bb9c] transition">
                  Products
                </Link>
              </li>
              <li onMouseEnter={() => setActiveMenu("categories")}>
                <div className={`text-[13px] uppercase tracking-wider font-semibold transition flex items-center gap-1 cursor-pointer ${activeMenu === "categories" ? "text-[#12bb9c]" : "hover:text-[#12bb9c]"}`}>
                  Categories
                  <i className="fa-solid fa-chevron-down text-[10px] ml-1"></i>
                </div>
              </li>
              <li>
                <Link href="/allorders" className="text-[13px] uppercase tracking-wider font-semibold hover:text-[#12bb9c] transition">
                  Orders
                </Link>
              </li>
            </ul>
          </div>

          {/* 3. RIGHT: Icons */}
          <div className="flex items-center space-x-2 shrink-0">
            
            {/* Wishlist Icon */}
            <div className="relative">
              <Link
                href="/wishlist"
                className="relative cursor-pointer inline-flex items-center p-2 hover:bg-white/10 rounded-lg transition-colors text-sm font-medium"
              >
                <i className="fa-regular fa-heart text-xl lg:mr-1"></i>
                <span className="hidden sm:inline">Wishlist</span>
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#12bb9c] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#001f3f]">
                    {wishlistCount}
                  </span>
                )}
              </Link>
            </div>

            {/* Cart Icon */}
            <div className="relative">
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative cursor-pointer inline-flex items-center p-2 hover:bg-white/10 rounded-lg transition-colors text-sm font-medium"
              >
                <i className="fa-solid fa-cart-shopping text-lg lg:mr-1"></i>
                <span className="hidden sm:inline">My Cart</span>
                {numOfCartItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#12bb9c] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#001f3f]">
                    {numOfCartItems}
                  </span>
                )}
              </button>
            </div>

            {/* User Icon */}
            <div className="relative">
              <button
                onClick={() => toggleMenu("user")}
                className="cursor-pointer inline-flex items-center p-2 hover:bg-white/10 rounded-lg transition-colors text-sm font-medium"
              >
                <i className="fa-regular fa-user text-lg mr-2"></i>
                {userData?.name ? `Hi, ${userData.name.split(" ")[0]}` : "Account"}
              </button>
              
              {activeMenu === "user" && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl overflow-hidden z-50 border border-gray-200 text-gray-800">
                  <div className="bg-gray-50 px-4 py-2 text-[10px] text-gray-400 uppercase font-bold tracking-widest border-b">Settings</div>
                  {userData ? (
                    <>
                      <Link
      href="/profile"
      onClick={closeAll}
      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-[#12bb9c] hover:text-white transition-all duration-200"
    >
      <i className="fa-regular fa-circle-user w-5"></i>
      My Account
    </Link>
    
    <Link
      href="/wishlist"
      onClick={closeAll}
      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-[#12bb9c] hover:text-white transition-all duration-200"
    >
      <i className="fa-regular fa-heart w-5"></i>
      My Wishlist
    </Link>
    
    <Link
      href="/allorders"
      onClick={closeAll}
      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-[#12bb9c] hover:text-white transition-all duration-200"
    >
      <i className="fa-solid fa-box-open w-5"></i>
      My Orders
    </Link>
    
    <button
      onClick={handleSignOut}
      className="cursor-pointer w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 border-t border-gray-100 hover:bg-red-50 font-semibold transition-all duration-200"
    >
      <i className="fa-solid fa-arrow-right-from-bracket w-5"></i>
      Sign Out
    </button>
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

            {/* Mobile Toggle */}
            <button onClick={() => toggleMenu("mobile")} className="lg:hidden p-2 hover:bg-white/10 rounded-md transition">
              <i className={`fa-solid ${activeMenu === "mobile" ? "fa-xmark" : "fa-bars"} text-xl`}></i>
            </button>
          </div>
        </div>

        {/* MOBILE MENU CONTENT */}
        <div className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${activeMenu === "mobile" ? "max-h-screen opacity-100 py-6" : "max-h-0 opacity-0"}`}>
          <ul className="flex flex-col space-y-4 px-2">
            <li><Link href="/" onClick={closeAll} className="block text-lg font-medium hover:text-[#12bb9c]">Home</Link></li>
            <li><Link href="/productdetails" onClick={closeAll} className="block text-lg font-medium hover:text-[#12bb9c]">Products</Link></li>
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

        {/* MEGA MENU (Categories) */}
        {activeMenu === "categories" && (
          <div className="absolute left-0 top-full w-full bg-white text-gray-800 shadow-2xl border-t border-gray-100 hidden lg:block" onMouseLeave={closeAll}>
            <div className="max-w-screen-xl mx-auto grid grid-cols-12 min-h-95">
              <div className="col-span-3 border-r border-gray-100 p-6 bg-gray-50/50">
                <h3 className="font-bold text-[#001f3f] text-[11px] uppercase mb-4 tracking-widest opacity-60">Categories</h3>
                <div className="space-y-1">
                  {categories.length > 0 ? categories.map((cat) => (
                    <Link
                      key={cat._id}
                      href={`/categories/${cat._id}`}
                      onMouseEnter={() => handleCategoryHover(cat)}
                      onClick={closeAll}
                      className={`block px-4 py-2 rounded-lg text-sm transition-all ${hoveredCategory?._id === cat._id ? "bg-[#12bb9c] text-white shadow-md" : "hover:bg-gray-200 text-gray-700"}`}
                    >
                      {cat.name}
                    </Link>
                  )) : <Skeleton count={6} height={35} />}
                </div>
              </div>
              
              <div className="col-span-5 p-8">
                <h3 className="font-bold text-[#001f3f] text-[11px] uppercase mb-6 tracking-widest opacity-60">{hoveredCategory?.name} Sub-category</h3>
                {isSubLoading ? <Skeleton count={8} height={22} className="mb-2" /> : (
                  <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                    {subCategories.length > 0 ? subCategories.map((sub) => (
                      <Link key={sub._id} href={`/productdetails?sub=${sub._id}`} onClick={closeAll} className="text-sm text-gray-500 hover:text-[#12bb9c] transition-colors flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-200"></span> {sub.name}
                      </Link>
                    )) : <p className="text-xs text-gray-400 italic">No sub-categories available</p>}
                  </div>
                )}
              </div>

              <div className="col-span-4 p-8 flex items-center justify-center">
                <Link href={`/categories/${hoveredCategory?._id}`} onClick={closeAll} className="relative w-full h-70 group/img overflow-hidden rounded-2xl shadow-lg">
                  <Image src={hoveredCategory?.image || "/placeholder.png"} fill className="object-cover transition-transform duration-500 group-hover/img:scale-110" alt="category" />
                  <div className="absolute inset-0 bg-linear-to-t from-[#001f3f]/80 to-transparent flex flex-col justify-end p-6">
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