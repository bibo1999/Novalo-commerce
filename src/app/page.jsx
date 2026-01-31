'use client';
import React, { useEffect, useState, useContext, useRef } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

// Context & Icons
import { cartContext } from '@/context/CartContext';
import { HiOutlineArrowNarrowRight } from "react-icons/hi";

// Component Imports
import BannerSlider from "@/components/BannerSlider/BannerSlider";
import CategorySlider from "@/components/CategorySlider/CategorySlider";
import FeaturedProducts from "@/components/FeaturedProducts/FeaturedProducts";
import ProductCard from "@/components/ProductCard/ProductCard";
import ServiceFeatures from "@/components/ServiceFeatures/ServiceFeatures";
import CountdownTimer from "@/components/CountdownTimer/CountdownTimer";

export default function Home() {

  
  const { addToCart, setIsCartOpen } = useContext(cartContext);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [dailySells, setDailySells] = useState([]);
  const [featuredCategory, setFeaturedCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // UX State for Dynamic Indicators (Mobile)
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef(null);

  // 1. Smooth Scroll Logic (Lenis)
  useEffect(() => {
    let lenis;
    const initLenis = async () => {
      const Lenis = (await import('lenis')).default;
      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    };
    initLenis();
    return () => lenis?.destroy();
  }, []);

  // 2. Intersection Observer (Triggers 'animate-in' class)
  useEffect(() => {
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [isLoading]);

  // 3. Dynamic Scroll Handler for Daily Best Sells
  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const index = Math.round(scrollLeft / (clientWidth * 0.85));
      setActiveIndex(index);
    }
  };

  // 4. API Data Fetching
  useEffect(() => {
    async function getHomeData() {
      try {
        const [prodRes, catRes] = await Promise.all([
          axios.get('https://ecommerce.routemisr.com/api/v1/products'),
          axios.get('https://ecommerce.routemisr.com/api/v1/categories')
        ]);

        const allProducts = prodRes.data.data;
        const allCategories = catRes.data.data;

        setCategories(allCategories);
        setProducts(allProducts);

        // Daily Best Sells Filtering (Targeting Women's Fashion)
        const womenFashionCat = allCategories.find(cat => cat.name === "Women's Fashion") || allCategories[0];
        setFeaturedCategory(womenFashionCat);

        const filteredDaily = allProducts
          .filter(p => p.category._id === womenFashionCat._id)
          .slice(0, 3);
        setDailySells(filteredDaily.length > 0 ? filteredDaily : allProducts.slice(0, 3));

        // Best Sellers Filtering (Ratings >= 4.8)
        const topRated = allProducts.filter(p => p.ratingsAverage >= 4.8).slice(0, 10);
        setBestSellers(topRated);

      } catch (err) {
        console.error("Data Fetch Error", err);
      } finally {
        setTimeout(() => setIsLoading(false), 500);
      }
    }
    getHomeData();
  }, []);

  return (
    <main className="bg-[#f9f8f4] min-h-screen overflow-x-hidden">
      
      {/* 1. HERO BANNER */}
      <section className="pt-28 md:pt-28 pb-6 animate-on-scroll">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6">
          <div className="relative overflow-hidden rounded-3xl shadow-sm border border-slate-100 bg-white">
            <div className="aspect-video md:aspect-21/9 w-full">
              <BannerSlider />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-screen-xl mx-auto px-4 md:px-6">
        
        {/* 2. SHOP BY CATEGORY */}
        <section className="py-12 md:py-16 animate-on-scroll">
          <div className="flex flex-col mb-10">
            <h2 className="text-3xl md:text-4xl font-serif font-light text-[#001f3f] relative inline-block pb-3">
              Shop by Category
              <span className="absolute bottom-0 left-0 w-20 h-1 bg-[#12bb9c]"></span>
            </h2>
          </div>
          <CategorySlider categories={categories} isLoading={isLoading} />
        </section>

        {/* 3. DAILY BEST SELLS  */}
        <section className="py-16 animate-on-scroll">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl md:text-4xl font-serif font-light text-[#001f3f] relative pb-3">
              Daily Best Sells
              <span className="absolute bottom-0 left-0 w-20 h-1 bg-[#12bb9c]"></span>
            </h2>
            
            {/* Mobile Progress Indicator */}
            <div className="flex md:hidden items-center gap-3">
              <span className="text-xs font-bold text-[#001f3f]">0{Math.min(activeIndex + 1, 4)}</span>
              <div className="w-16 h-0.5 bg-slate-200 relative overflow-hidden">
                <div 
                  className="absolute top-0 left-0 h-full bg-[#12bb9c] transition-all duration-300"
                  style={{ width: `${((Math.min(activeIndex + 1, 4)) / 4) * 100}%` }}
                ></div>
              </div>
              <span className="text-xs font-bold text-slate-300">04</span>
            </div>

            {/* Desktop Static Version */}
            <div className="hidden md:flex flex-col items-end gap-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#12bb9c]">
                  Exclusive Deals
                </span>
                <div className="w-8 h-px bg-[#12bb9c]"></div>
                <span className="text-xs font-bold text-[#001f3f]">Three Products</span>
              </div>
              <p className="text-[9px] text-slate-400 font-medium">
                Limited time offers for The upcoming 2 month
              </p>
            </div>
          </div>

          <div 
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex lg:grid lg:grid-cols-4 gap-6 overflow-x-auto lg:overflow-visible pb-8 lg:pb-0 snap-x snap-mandatory no-scrollbar"
          >
            {/* Promo Card */}
            <div className="relative shrink-0 w-[85%] lg:w-full snap-center rounded-3xl overflow-hidden bg-[#001f3f] p-8 min-h-112.5 flex flex-col justify-end group">
              {featuredCategory?.image && (
                <Image src={featuredCategory.image} alt="promo" fill className="object-cover opacity-40 transition-transform duration-700 group-hover:scale-105" />
              )}
              <div className="relative z-10">
                <span className="text-[#12bb9c] font-bold text-xs uppercase tracking-widest">Today's Deals</span>
                <h3 className="text-3xl font-bold text-white mb-4 mt-2">{featuredCategory?.name}</h3>
                <Link 
                  href={`/categories/${featuredCategory?._id}`} 
                  className="inline-flex items-center gap-2 bg-[#12bb9c] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#0da085] transition-all"
                >
                  Shop Now <HiOutlineArrowNarrowRight />
                </Link>
              </div>
            </div>

            {/* Product Mapping */}
            {isLoading ?
            ( [...Array(3)].map((_, i) => (
            <div key={i} className="shrink-0 w-[85%] lg:w-full">
              <Skeleton height={450} borderRadius={24} />
              </div>)) 
              ) : ( 
              dailySells.map((product) => (
              <div 
              key={product._id} 
              className="shrink-0 w-[85%] lg:w-full snap-center">
                {/* ProductCard */}
                <ProductCard 
                product={product}
                Timer={
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase text-center mb-1">
                        Flash Sale Ends In:
                    </p>
                    <CountdownTimer targetDate="2026-03-20T23:59:59" />
                </div>

                }
                />
                </div>
            ))
            )}
          </div>

          {/* Mobile Dot Indicators */}
          <div className="flex lg:hidden justify-center items-center gap-2 mt-6">
             {[0, 1, 2, 3].map((i) => (
               <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${activeIndex === i ? 'w-8 bg-[#12bb9c]' : 'w-2 bg-slate-200'}`}></div>
             ))}
          </div>
        </section>

        {/* 4. OUR BEST SELLERS */}
        <section className="py-16 animate-on-scroll">
          <h2 className="text-3xl md:text-4xl font-serif font-light text-[#001f3f] mb-10 relative inline-block pb-3">
            Our Best Sellers
            <span className="absolute bottom-0 left-0 w-20 h-1 bg-[#12bb9c]"></span>
          </h2>
          <FeaturedProducts products={bestSellers} isLoading={isLoading} />
        </section>

        {/* 5. DISCOVER MORE */}
        <section className="py-16 md:py-24 animate-on-scroll">
          <h2 className="text-3xl md:text-4xl font-serif font-light mb-10 text-[#001f3f] relative inline-block pb-3">
            Discover More
            <span className="absolute bottom-0 left-0 w-20 h-1 bg-[#12bb9c]"></span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {isLoading ? (
              [...Array(8)].map((_, i) => <div key={i}><Skeleton height={320} borderRadius={16} /></div>)
            ) : (
              products.slice(0, 12).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            )}
          </div>
        </section>

        {/* 6. SERVICES */}
        <ServiceFeatures />
      </div>
    </main>
  );
}