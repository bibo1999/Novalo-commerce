'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard/ProductCard';
import Skeleton from 'react-loading-skeleton';
import { useTheme } from '@/hooks/useTheme';

export default function CategoryProducts() {
    const { id } = useParams();
    const [products, setProducts] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [categoryName, setCategoryName] = useState('');
    const [selectedSub, setSelectedSub] = useState(null); 
    const [isLoading, setIsLoading] = useState(true);

    useTheme("#0f172a", "Sub-Categories | Novalo");

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [catRes, subRes, prodRes] = await Promise.all([
                axios.get(`https://ecommerce.routemisr.com/api/v1/categories/${id}`),
                axios.get(`https://ecommerce.routemisr.com/api/v1/categories/${id}/subcategories`),
                axios.get(`https://ecommerce.routemisr.com/api/v1/products`, { params: { 'category[in]': id } })
            ]);

            setCategoryName(catRes.data.data.name);
            setSubCategories(subRes.data.data || []);
            setProducts(prodRes.data.data || []);
        } catch (error) {
            console.error("Fetch error:", error);
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const filteredProducts = useMemo(() => {
        if (!selectedSub) return products;
        return products.filter(item => item.subcategory?.[0]?.name === selectedSub);
    }, [products, selectedSub]);

    return (
        <div className="bg-[#0f172a] min-h-screen pt-28 pb-20 text-white">
            <div className="max-w-screen-xl mx-auto px-4">
                <h1 className="text-4xl font-black uppercase tracking-tight mb-6">
                    {isLoading ? <Skeleton width={200} baseColor="#1e293b" /> : categoryName}
                </h1>

                {/* Sub-category Filter Section */}
                <div className="flex flex-wrap gap-3 mb-10">
                    <button
                        onClick={() => setSelectedSub(null)}
                        className={`px-6 py-2 rounded-full border text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                            !selectedSub 
                            ? "bg-[#12bb9c] border-[#12bb9c] text-white shadow-[0_0_15px_rgba(18,187,156,0.3)]" 
                            : "bg-[#1e293b]/50 border-gray-700 text-gray-400 hover:border-[#12bb9c]"
                        }`}
                    >
                        All
                    </button>

                    {subCategories.map((sub) => (
                        <button
                            key={sub._id}
                            onClick={() => setSelectedSub(sub.name)}
                            className={`px-6 py-2 rounded-full border text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                                selectedSub === sub.name
                                ? "bg-[#12bb9c] border-[#12bb9c] text-white shadow-[0_0_15px_rgba(18,187,156,0.3)]"
                                : "bg-[#1e293b]/50 border-gray-700 text-gray-400 hover:border-[#12bb9c]"
                            }`}
                        >
                            {sub.name}
                        </button>
                    ))}
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    {isLoading ? (
                         [...Array(4)].map((_, i) => <Skeleton key={i} height={350} baseColor="#1e293b" borderRadius={24} />)
                    ) : filteredProducts.length > 0 ? (
                        filteredProducts.map((item) => <ProductCard key={item._id} product={item} viewMode="grid" />)
                    ) : (
                        <div className="col-span-full py-20 text-center opacity-50">
                            <p>No products found in this specific sub-category.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}