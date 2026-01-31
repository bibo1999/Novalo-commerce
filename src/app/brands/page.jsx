'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import BrandSlider from '@/components/BrandSlider/BrandSlider'; 
import { ReactLenis, useLenis } from 'lenis/react';

export default function Brands() {
    const [brands, setBrands] = useState([]);
    const [visibleCount, setVisibleCount] = useState(12);
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalLoading, setIsModalLoading] = useState(false);
    const [showTopBtn, setShowTopBtn] = useState(false);

    const lenis = useLenis(({ scroll }) => {
        if (scroll > 400) {
            setShowTopBtn(true);
        } else {
            setShowTopBtn(false);
        }
    });

    useEffect(() => {
        async function getBrands() {
            try {
                const { data } = await axios.get('https://ecommerce.routemisr.com/api/v1/brands');
                setBrands(data.data);
            } catch (error) { console.error(error); } 
            finally { setIsLoading(false); }
        }
        getBrands();
    }, []);

    const handleShowMore = () => setVisibleCount(prev => prev + 12);

    const scrollToTop = () => {
        lenis?.scrollTo(0, { lerp: 0.07 });
    };

    async function getSpecificBrand(id) {
        setIsModalLoading(true);
        setSelectedBrand(true); 
        try {
            const { data } = await axios.get(`https://ecommerce.routemisr.com/api/v1/brands/${id}`);
            setSelectedBrand(data.data);
        } catch (error) { setSelectedBrand(null); } 
        finally { setIsModalLoading(false); }
    }

    if (isLoading) return (
        <div className="h-screen flex items-center justify-center">
            <i className="fas fa-spinner fa-spin text-4xl text-[#12bb9c]"></i>
        </div>
    );

    return (
        <ReactLenis root options={{ lerp: 0.1, duration: 1.5 }}>
            <div className="max-w-screen-xl mx-auto py-20 px-4">
                <BrandSlider />

                <div className="text-center my-16">
                    <h1 className="text-5xl font-black text-[#12bb9c] uppercase tracking-tighter">All Brands</h1>
                    <div className="w-24 h-1 bg-[#12bb9c] mx-auto mt-4 rounded-full"></div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {brands.slice(0, visibleCount).map((brand) => (
                        <div 
                            key={brand._id}
                            onClick={() => getSpecificBrand(brand._id)}
                            className="bg-white border border-gray-100 rounded-2xl p-6 cursor-pointer hover:shadow-2xl hover:shadow-[#12bb9c]/10 transition-all group animate-in fade-in slide-in-from-bottom-5 duration-700"
                        >
                            <div className="relative h-32 w-full mb-4">
                                <Image 
                                    src={brand.image} 
                                    alt={brand.name} 
                                    fill
                                    sizes="(max-width: 768px) 50vw, 25vw"
                                    className="object-contain filter grayscale group-hover:grayscale-0 transition-all duration-500 scale-90 group-hover:scale-100"
                                />
                            </div>
                            <h3 className="font-bold text-center text-gray-800 group-hover:text-[#12bb9c] transition-colors">{brand.name}</h3>
                        </div>
                    ))}
                </div>

                {visibleCount < brands.length && (
                    <div className="mt-20 flex justify-center">
                        <button 
                            onClick={handleShowMore}
                            className="cursor-pointer px-12 py-4 bg-[#12bb9c] text-white font-black rounded-xl hover:bg-[#0ea88d] transition-all shadow-lg shadow-[#12bb9c]/30 active:scale-95"
                        >
                            EXPLORE MORE
                        </button>
                    </div>
                )}

                <button
                    onClick={scrollToTop}
                    className={`cursor-pointer fixed bottom-8 right-8 z-40 w-14 h-14 bg-[#12bb9c] text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-500 transform ${
                        showTopBtn ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
                    } hover:scale-110 active:scale-90`}
                >
                    <i className="fas fa-chevron-up text-xl"></i>
                </button>

                {selectedBrand && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-6" onClick={() => setSelectedBrand(null)}>
                        <div className="bg-white rounded-3xl max-w-lg w-full p-10 relative shadow-2xl" onClick={(e) => e.stopPropagation()}>
                            {isModalLoading ? (
                                <div className="py-20 text-center"><i className="fas fa-circle-notch fa-spin text-5xl text-[#12bb9c]"></i></div>
                            ) : (
                                <div className="text-center">
                                    <div className="relative w-48 h-48 mx-auto mb-6">
                                        {selectedBrand.image && <Image src={selectedBrand.image} alt={selectedBrand.name} fill className="object-contain" />}
                                    </div>
                                    <h2 className="text-4xl font-black text-[#12bb9c] mb-2">{selectedBrand.name}</h2>
                                    <p className="text-gray-400 mb-8 uppercase tracking-widest text-sm">{selectedBrand.slug}</p>
                                    <button onClick={() => setSelectedBrand(null)} className="cursor-pointer w-full py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-all">Close Details</button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </ReactLenis>
    );
}