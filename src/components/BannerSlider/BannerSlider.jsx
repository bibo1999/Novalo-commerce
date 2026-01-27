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
      title: "Fashion Sale"
    },
    {
      id: 2,
      image: "/assets/images/Banner2.png",
      title: "New Collection"
    }
  ];

  return (
    <section className="w-full h-full relative bg-[#f9f8f4]">
      <div className="embla h-full" ref={emblaRef}>
        <div className="embla__container h-full">
          {slides.map((slide) => (
            <div
              key={slide.id}
              className="embla__slide flex-[0_0_100%] h-full relative"
            >
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                priority
                quality={100}
                className="object-cover md:object-center"
                sizes="(max-width: 768px) 100vw, 1280px"
              />

              <div className="absolute inset-0 bg-linear-to-t from-black/10 to-transparent pointer-events-none" />
            </div>
          ))}
        </div>

        <div className="absolute bottom-4 md:bottom-8 left-0 right-0 z-20 flex justify-center gap-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => emblaApi?.scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`h-1 rounded-full transition-all duration-500 ${
                index === selectedIndex
                  ? 'w-12 md:w-20 bg-[#12bb9c]' 
                  : 'w-6 md:w-10 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}