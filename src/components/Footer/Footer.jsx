'use client';
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

// Payment import
import Visa from 'react-payment-logos/dist/flat/Visa';
import Mastercard from 'react-payment-logos/dist/flat/Mastercard';
import Paypal from 'react-payment-logos/dist/flat/Paypal';


export default function Footer() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getCategories() {
      try {
        const { data } = await axios.get('https://ecommerce.routemisr.com/api/v1/categories');
        setCategories(data.data.slice(0, 8)); 
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    getCategories();
  }, []);

  return (
    <footer className="bg-[#001f3f] text-gray-300 py-16 px-4 mt-20 border-t border-white/5">
      <div className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
        
        {/* LEFT SIDE: Clickable Categories */}
        <div className="md:col-span-3 flex flex-col gap-2">
          <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-4">Shop Categories</h4>
          {isLoading ? (
            <Skeleton count={6} baseColor="#002a54" highlightColor="#003566" height={20} className="mb-2" />
          ) : (
            categories.map((cat) => (
              <Link 
                key={cat._id} 
                href={`/categories/${cat._id}`} 
                className="text-xs uppercase hover:text-[#12bb9c] transition-colors tracking-wider"
              >
                {cat.name}
              </Link>
            ))
          )}
        </div>

        {/* MIDDLE: Logo & Centered Text */}
        <div className="md:col-span-6 flex flex-col items-center text-center px-4">
          <div className="mb-8">
            <Image 
              src="/assets/logo.svg" 
              alt="Logo" 
              width={120} 
              height={40} 
              className="brightness-200 h-10 w-auto" 
            />
          </div>
          <p className="text-[11px] leading-relaxed max-w-md text-gray-400 font-light italic">
            We are grateful to be operating on the traditional, ancestral, and unceded lands 
            of our communities. We are dedicated to bringing quality products to your home 
            with sustainability and care at our core.
          </p>
          
          {/* Social Icons */}
          <div className="flex gap-6 mt-8 text-lg">
            <i className="fa-brands fa-instagram hover:text-[#12bb9c] cursor-pointer transition-colors"></i>
            <i className="fa-brands fa-pinterest hover:text-[#12bb9c] cursor-pointer transition-colors"></i>
            <i className="fa-brands fa-facebook hover:text-[#12bb9c] cursor-pointer transition-colors"></i>
            <i className="fa-brands fa-tiktok hover:text-[#12bb9c] cursor-pointer transition-colors"></i>
          </div>
        </div>

        {/* RIGHT SIDE: Navigation Links */}
        <div className="md:col-span-3 grid grid-cols-2 gap-8 md:flex md:flex-row md:justify-between w-full">
          <div className="flex flex-col gap-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-2">Company</h4>
            <Link href="/about" className="text-xs uppercase hover:text-[#12bb9c] transition-colors">About</Link>
            <Link href="/stores" className="text-xs uppercase hover:text-[#12bb9c] transition-colors">Stores</Link>
            <Link href="/careers" className="text-xs uppercase hover:text-[#12bb9c] transition-colors">Careers</Link>
          </div>
          <div className="flex flex-col gap-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-2">Help</h4>
            <Link href="/contact" className="text-xs uppercase hover:text-[#12bb9c] transition-colors">Contact Us</Link>
            <Link href="/faq" className="text-xs uppercase hover:text-[#12bb9c] transition-colors">FAQ</Link>
            <Link href="/returns" className="text-xs uppercase hover:text-[#12bb9c] transition-colors">Returns</Link>
          </div>
        </div>
      </div>

      {/* BOTTOM BAR: Payments and Legal */}
      <div className="max-w-screen-xl mx-auto mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
        
        {/* Flat Payment Logos */}
        <div className="flex flex-wrap justify-center items-center gap-5 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
          <div className="w-10"><Visa /></div>
          <div className="w-10"><Mastercard /></div>
          <div className="w-10"><Paypal /></div>
           <div className="items-center justify-center space-y-4 sm:flex sm:space-y-0 sm:space-x-4 rtl:space-x-reverse">
        <a href="#" className="w-full sm:w-auto bg-dark hover:bg-dark-strong focus:ring-4 focus:outline-none focus:ring-neutral-quaternary text-white rounded-base inline-flex items-center justify-center px-4 py-3">
            <svg className="me-2 w-7 h-7" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="apple" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="currentColor" d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"></path></svg>
            <div className="text-left rtl:text-right">
                <div className="text-xs">Download on the</div>
                <div className="text-sm font-bold">Mac App Store</div>
            </div>
        </a>
        <a href="#" className="w-full sm:w-auto bg-dark hover:bg-dark-strong focus:ring-4 focus:outline-none focus:ring-neutral-quaternary text-white rounded-base inline-flex items-center justify-center px-4 py-3">
            <svg className="me-2 w-7 h-7" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google-play" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z"></path></svg>
            <div className="text-left rtl:text-right">
                <div className="text-xs">Get in on</div>
                <div className="text-sm font-bold">Google Play</div>
            </div>
        </a>
    </div>
        </div>

        {/* Legal Links */}
        <div className="text-[10px] uppercase tracking-[0.2em] text-gray-500 flex flex-wrap justify-center gap-6">
          <Link href="/terms" className="hover:text-[#12bb9c] transition-colors">Terms & Conditions</Link>
          <Link href="/privacy" className="hover:text-[#12bb9c] transition-colors">Privacy Policy</Link>
          <span className="text-gray-600">© 2026 Novalo - EG</span>
        </div>
      </div>
    </footer>
  );
}