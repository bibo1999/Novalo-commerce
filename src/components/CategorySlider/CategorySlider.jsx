'use client';
import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';
import Link from 'next/link';
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

export default function CategorySlider({ categories, isLoading }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    align: 'start', 
    loop: true 
  });
  
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelect);
    emblaApi.reInit(); 
  }, [emblaApi, categories, onSelect]);

  return (
    <div className="relative group/arrows"> {/* Isolated group for arrow visibility */}
      {/* Navigation Arrows with cursor-pointer */}
      <button 
        onClick={scrollPrev}
        className="absolute left-[-20px] top-1/2 -translate-y-1/2 z-20 bg-white shadow-md rounded-full p-2 text-[#001f3f] hover:text-[#12bb9c] transition-colors hidden md:flex items-center justify-center border border-gray-100 cursor-pointer"
      >
        <IoChevronBack size={20} />
      </button>
      
      <button 
        onClick={scrollNext}
        className="absolute right-[-20px] top-1/2 -translate-y-1/2 z-20 bg-white shadow-md rounded-full p-2 text-[#001f3f] hover:text-[#12bb9c] transition-colors hidden md:flex items-center justify-center border border-gray-100 cursor-pointer"
      >
        <IoChevronForward size={20} />
      </button>

      <div className="embla category-slider py-4" ref={emblaRef}>
        <div className="embla__container flex">
          {categories.map((cat) => (
            /* The 'group' class here isolates the hover to THIS slide only */
            <div className="embla__slide flex-[0_0_70%] md:flex-[0_0_27%] mr-6 group" key={cat._id}>
              <Link href={`/categories/${cat._id}`} className="block text-center no-underline">
                <div className="relative aspect-square overflow-hidden bg-gray-100 mb-4 rounded-sm">
                  <Image 
                    src={cat.image} 
                    alt={cat.name} 
                    fill 
                    /* Only the image inside the hovered 'group' will scale */
                    className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                    sizes="(max-width: 768px) 70vw, 25vw"
                  />
                </div>
                <h3 className="text-[11px] uppercase tracking-[2px] font-bold text-[#001f3f] group-hover:text-[#12bb9c] transition-colors">
                  {cat.name}
                </h3>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}