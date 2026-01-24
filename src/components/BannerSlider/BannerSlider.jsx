'use client';
import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';
import '../embla-custom.css';

export default function BannerSlider() {
  const autoplay = Autoplay({ delay: 5000, stopOnInteraction: false });
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [autoplay]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelect);
    emblaApi.reInit();
  }, [emblaApi, onSelect]);

  const slides = [
    {
      id: 1,
      image: "/assets/images/Banner1.png",
      width: 1920,
      height: 1080
    },
    {
      id: 2,
      image: "/assets/images/Banner2.png",
      width: 1920,
      height: 1080
    }
  ];

  return (
    <section className="w-full relative overflow-hidden bg-[#f9f8f4]">
      <div className="embla" ref={emblaRef}>
        <div className="embla__container">

          {slides.map((slide) => (
            <div
              key={slide.id}
              className="embla__slide flex-[0_0_100%] relative"
            >
              {/* IMAGE DEFINES HEIGHT */}
              <Image
  src={slide.image}
  alt={slide.title}
  width={1920}
  height={1080}
  priority
  quality={100}
  sizes="100vw"
/>

              {/* OVERLAY */}
              <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-center text-center p-4">
              </div>
            </div>
          ))}

        </div>

        {/* INDICATORS */}
        <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => emblaApi?.scrollTo(index)}
              className={`h-[2px] transition-all duration-500 ${
                index === selectedIndex
                  ? 'w-24 bg-[#12bb9c]'
                  : 'w-12 bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
