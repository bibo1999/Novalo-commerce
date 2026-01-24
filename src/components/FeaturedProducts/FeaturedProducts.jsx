'use client';
import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import ProductCard from '../ProductCard/ProductCard';
import Skeleton from 'react-loading-skeleton';
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import '../embla-custom.css';

export default function FeaturedProducts({ products, isLoading }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    loop: false
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on('select', onSelect);

    if (products?.length) {
      emblaApi.reInit();
    }
  }, [emblaApi, products, onSelect]);

  /* ---------------- SKELETON ---------------- */
  if (isLoading) {
    return (
      <div className="flex gap-6 py-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="w-[85%] sm:w-[50%] md:w-[33.33%] lg:w-[25%] shrink-0"
          >
            <Skeleton height={360} borderRadius={12} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="relative py-4">

      {/* LEFT ARROW */}
      <button
        onClick={() => emblaApi?.scrollPrev()}
        className="hidden lg:flex absolute -left-6 top-1/2 -translate-y-1/2
        z-20 bg-white shadow-md rounded-full p-2
        cursor-pointer hover:text-[#12bb9c]"
      >
        <IoChevronBack size={20} />
      </button>

      {/* RIGHT ARROW */}
      <button
        onClick={() => emblaApi?.scrollNext()}
        className="hidden lg:flex absolute -right-6 top-1/2 -translate-y-1/2
        z-20 bg-white shadow-md rounded-full p-2
        cursor-pointer hover:text-[#12bb9c]"
      >
        <IoChevronForward size={20} />
      </button>

      {/* SLIDER */}
      <div className="embla overflow-hidden" ref={emblaRef}>
        <div className="embla__container flex">
          {products.map((product) => (
            <div
              key={product._id}
              className="
                embla__slide
                flex-[0_0_85%]
                sm:flex-[0_0_50%]
                md:flex-[0_0_33.33%]
                lg:flex-[0_0_25%]
                px-3
                min-w-0
              "
            >
              <ProductCard product={product} isBestSeller />
            </div>
          ))}
        </div>
      </div>

      {/* DOTS */}
      <div className="flex justify-center mt-8">
        {scrollSnaps.map((_, index) => (
          <button
            key={index}
            onClick={() => emblaApi?.scrollTo(index)}
            className={`h-0.5 flex-1 max-w-20 transition-all
              ${index === selectedIndex
                ? 'bg-[#12bb9c]'
                : 'bg-gray-300 opacity-50'}
            `}
          />
        ))}
      </div>
    </div>
  );
}
