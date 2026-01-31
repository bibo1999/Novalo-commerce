'use client';
import React, { useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import axios from 'axios';
import Image from 'next/image';

export default function BrandSlider() {
    const [brands, setBrands] = useState([]);
    const [emblaRef] = useEmblaCarousel({ loop: true, align: 'start' }, [Autoplay({ delay: 2000 })]);

    useEffect(() => {
        axios.get('https://ecommerce.routemisr.com/api/v1/brands')
            .then(({ data }) => setBrands(data.data))
            .catch(err => console.error("Slider fetch error:", err));
    }, []);

    return (
        <section className="py-10 bg-gray-50 my-10">
            <div className="max-w-screen-xl mx-auto px-4">
                <h2 className="text-2xl font-bold mb-6 text-[#001f3f]">Our Partners</h2>
                <div className="overflow-hidden cursor-grab active:cursor-grabbing" ref={emblaRef}>
                    <div className="flex">
                        {brands.map((brand) => (
                            <div key={brand._id} className="flex-[0_0_40%] md:flex-[0_0_20%] lg:flex-[0_0_15%] min-w-0 px-4">
                                <div className="relative h-24 w-full group">
                                    <Image 
                                        src={brand.image} 
                                        alt={brand.name} 
                                        fill 
                                        sizes="200px"
                                        className="object-contain filter grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}