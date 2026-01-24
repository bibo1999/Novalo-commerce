"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

// Payment import
import Visa from "react-payment-logos/dist/flat/Visa";
import Mastercard from "react-payment-logos/dist/flat/Mastercard";
import Paypal from "react-payment-logos/dist/flat/Paypal";

export default function Footer() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getCategories() {
      try {
        const { data } = await axios.get(
          "https://ecommerce.routemisr.com/api/v1/categories",
        );
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
      {/* TOP FOOTER */}
      <div className="max-w-screen-xl mx-auto grid grid-cols-3 md:grid-cols-12 gap-8 md:gap-12 items-start">
        {/* LOGO + TEXT */}
        <div className="col-span-3 order-1 md:order-2 md:col-span-6 flex flex-col items-center text-center px-4">
          <div className="mb-8">
            <div className="h-12 w-36 relative">
              <Image
                src="/assets/logo.svg"
                alt="Logo"
                fill
                className="object-contain brightness-200"
                priority
              />
            </div>
          </div>

          <p className="text-[11px] leading-relaxed max-w-md text-gray-400 font-light italic">
            Elevating your everyday with intentionally designed products. At
            Novalo, we blend modern innovation with a commitment to sustainable
            quality and community care.
          </p>

          <div className="flex gap-6 mt-8 text-lg">
            <i className="fa-brands fa-instagram hover:text-[#12bb9c] cursor-pointer transition-colors" />
            <i className="fa-brands fa-pinterest hover:text-[#12bb9c] cursor-pointer transition-colors" />
            <i className="fa-brands fa-facebook hover:text-[#12bb9c] cursor-pointer transition-colors" />
            <i className="fa-brands fa-tiktok hover:text-[#12bb9c] cursor-pointer transition-colors" />
          </div>
        </div>

        {/* SHOP CATEGORIES */}
        <div className="col-span-1 order-2 md:order-1 md:col-span-3 flex flex-col gap-2">
          <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-4">
            Shop
          </h4>

          {isLoading ? (
            <Skeleton
              count={6}
              baseColor="#002a54"
              highlightColor="#003566"
              height={20}
              className="mb-2"
            />
          ) : (
            categories.map((cat) => (
              <Link
                key={cat._id}
                href={`/categories/${cat._id}`}
                className="text-[10px] uppercase hover:text-[#12bb9c] transition-colors tracking-wider"
              >
                {cat.name}
              </Link>
            ))
          )}
        </div>

        {/* COMPANY + HELP */}
        <div className="col-span-2 order-3 md:order-3 md:col-span-3 grid grid-cols-2 gap-8">
          <div className="flex flex-col gap-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-4">
              Company
            </h4>
            <Link
              href="/about"
              className="text-[10px] uppercase hover:text-[#12bb9c]"
            >
              About
            </Link>
            <Link
              href="/stores"
              className="text-[10px] uppercase hover:text-[#12bb9c]"
            >
              Stores
            </Link>
            <Link
              href="/careers"
              className="text-[10px] uppercase hover:text-[#12bb9c]"
            >
              Careers
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-4">
              Help
            </h4>
            <Link
              href="/contact"
              className="text-[10px] uppercase hover:text-[#12bb9c]"
            >
              Contact
            </Link>
            <Link
              href="/faq"
              className="text-[10px] uppercase hover:text-[#12bb9c]"
            >
              FAQ
            </Link>
            <Link
              href="/returns"
              className="text-[10px] uppercase hover:text-[#12bb9c]"
            >
              Returns
            </Link>
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="max-w-screen-xl mx-auto mt-20 pt-8 border-t border-white/10">
        {/*  MOBILE PAYMENT LAYOUT  */}
        <div className="md:hidden flex flex-col items-center gap-6">
          {/* Visa | Mastercard | Paypal */}
          <div className="flex justify-center items-center gap-5 opacity-70">
            <div className="w-10">
              <Visa />
            </div>
            <div className="w-10">
              <Mastercard />
            </div>
            <div className="w-10">
              <Paypal />
            </div>
          </div>

          {/* App Downloads side-by-side */}
          <div className="flex justify-center gap-4 w-full">
            {/* Apple */}
            <a
              href="#"
              className="bg-dark text-white rounded-base inline-flex items-center px-4 py-3 w-1/2 max-w-42.5 justify-center"
            >
              <svg
                className="w-7 h-7 me-2"
                viewBox="0 0 384 512"
                fill="currentColor"
              >
                <path d="M318.7 268.7c-.2-36.7..." />
              </svg>
              <div className="text-left">
                <div className="text-xs">Download on</div>
                <div className="text-sm font-bold">Mac App Store</div>
              </div>
            </a>

            {/* Android */}
            <a
              href="#"
              className="bg-dark text-white rounded-base inline-flex items-center px-4 py-3 w-1/2 max-w-42.5 justify-center"
            >
              <svg
                className="w-7 h-7 me-2"
                viewBox="0 0 512 512"
                fill="currentColor"
              >
                <path d="M325.3 234.3L104.6..." />
              </svg>
              <div className="text-left">
                <div className="text-xs">Get it on</div>
                <div className="text-sm font-bold">Google Play</div>
              </div>
            </a>
          </div>
        </div>

        {/*  DESKTOP PAYMENT LAYOUT  */}
        <div className="hidden md:flex justify-between items-center gap-6">
          <div className="flex flex-wrap justify-center items-center gap-5 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="w-10">
              <Visa />
            </div>
            <div className="w-10">
              <Mastercard />
            </div>
            <div className="w-10">
              <Paypal />
            </div>

            <div className="flex gap-4">
              <a
                href="#"
                className="bg-dark hover:bg-dark-strong text-white rounded-base inline-flex items-center px-4 py-3"
              >
                <svg
                  className="w-7 h-7 me-2"
                  viewBox="0 0 384 512"
                  fill="currentColor"
                >
                  <path d="M318.7 268.7c-.2-36.7..." />
                </svg>
                <div>
                  <div className="text-xs">Download on</div>
                  <div className="text-sm font-bold">Mac App Store</div>
                </div>
              </a>

              <a
                href="#"
                className="bg-dark hover:bg-dark-strong text-white rounded-base inline-flex items-center px-4 py-3"
              >
                <svg
                  className="w-7 h-7 me-2"
                  viewBox="0 0 512 512"
                  fill="currentColor"
                >
                  <path d="M325.3 234.3L104.6..." />
                </svg>
                <div>
                  <div className="text-xs">Get it on</div>
                  <div className="text-sm font-bold">Google Play</div>
                </div>
              </a>
            </div>
          </div>

          {/*Desktop LEGAL */}
          <div className="text-[10px] uppercase tracking-[0.2em] text-gray-500 flex gap-6">
            <Link href="/terms" className="hover:text-[#12bb9c]">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-[#12bb9c]">
              Privacy
            </Link>
            <span>© 2026 Novalo - EG</span>
          </div>
        </div>
        {/* MOBILE LEGAL */}
        <div className="md:hidden text-[10px] uppercase tracking-[0.2em] text-gray-500 flex flex-wrap justify-center gap-6 text-center mt-6">
          <Link
            href="/terms"
            className="hover:text-[#12bb9c] transition-colors"
          >
            Terms & Conditions
          </Link>
          <Link
            href="/privacy"
            className="hover:text-[#12bb9c] transition-colors"
          >
            Privacy Policy
          </Link>
          <span className="text-gray-600">© 2026 Novalo - EG</span>
        </div>
      </div>
    </footer>
  );
}
