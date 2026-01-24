'use client';
import React, { useEffect, useState } from "react";
import axios from "axios";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

// Component Imports
import BannerSlider from "@/components/BannerSlider/BannerSlider";
import CategorySlider from "@/components/CategorySlider/CategorySlider";
import FeaturedProducts from "@/components/FeaturedProducts/FeaturedProducts";
import ProductCard from "@/components/ProductCard/ProductCard";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize Lenis Smooth Scroll
  useEffect(() => {
    let lenis;
    
    const initLenis = async () => {
      const Lenis = (await import('lenis')).default;
      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
      });

      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    };

    initLenis();

    return () => {
      lenis?.destroy();
    };
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

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

  useEffect(() => {
    async function getHomeData() {
      try {
        const [prodRes, catRes] = await Promise.all([
          axios.get('https://ecommerce.routemisr.com/api/v1/products'),
          axios.get('https://ecommerce.routemisr.com/api/v1/categories')
        ]);

        setProducts(prodRes.data.data);
        setCategories(catRes.data.data);

        const featured = prodRes.data.data
          .filter(p => p.ratingsAverage >= 4.8)
          .slice(0, 10);
        setBestSellers(featured);

      } catch (err) {
        console.error("Home Data Error", err);
      } finally {
        setTimeout(() => setIsLoading(false), 500);
      }
    }
    getHomeData();
  }, []);

  return (
    <main className="bg-[#f9f8f4] min-h-screen">
      {/* 1. Hero Banner */}
      <div className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-1000 ease-out">
        <BannerSlider />
      </div>

      <div className="max-w-screen-xl mx-auto px-6">
        
        {/* 2. Category Section */}
        <section className="py-16 md:py-24 animate-on-scroll opacity-0 translate-y-8 transition-all duration-1000 ease-out delay-100">
          <div className="flex flex-col mb-8">
            <h2 className="text-3xl md:text-4xl font-serif font-light text-[#001f3f] relative inline-block">
              Shop by Category
              <span className="absolute bottom-0 left-0 w-20 h-[2px] bg-[#12bb9c] mt-2"></span>
            </h2>
            {isLoading && <Skeleton width={150} height={4} className="mt-4" baseColor="#12bb9c20" highlightColor="#12bb9c" />}
          </div>
          <CategorySlider categories={categories} isLoading={isLoading} />
        </section>

        {/* 3. Featured Best Sellers */}
        <section className="py-16 md:py-24 animate-on-scroll opacity-0 translate-y-8 transition-all duration-1000 ease-out delay-200">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl md:text-4xl font-serif font-light text-[#001f3f] relative inline-block">
              Our Best Sellers
              <span className="absolute bottom-0 left-0 w-20 h-[2px] bg-[#12bb9c] mt-2"></span>
            </h2>
          </div>
          <FeaturedProducts products={bestSellers} isLoading={isLoading} />
        </section>

        {/* 4. Regular Grid */}
        <section className="py-16 md:py-24 animate-on-scroll opacity-0 translate-y-8 transition-all duration-1000 ease-out delay-300">
          <h2 className="text-3xl md:text-4xl font-serif font-light mb-10 text-[#001f3f] relative inline-block">
            Discover More
            <span className="absolute bottom-0 left-0 w-20 h-[2px] bg-[#12bb9c] mt-2"></span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {isLoading ? (
              [...Array(8)].map((_, i) => (
                <div key={i} className="bg-white p-4 rounded-xl shadow-sm">
                  <Skeleton height={250} borderRadius={8} />
                  <div className="mt-4">
                    <Skeleton count={2} />
                    <div className="flex justify-between mt-4">
                      <Skeleton width={60} height={20} />
                      <Skeleton width={40} height={20} />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              products.slice(0, 12).map((product, index) => (
                <div 
                  key={product._id}
                  className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 ease-out"
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  <ProductCard product={product} />
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      <style jsx global>{`
        .animate-on-scroll {
          opacity: 0;
        }
        
        .animate-on-scroll.animate-in {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
      `}</style>
    </main>
  );
}