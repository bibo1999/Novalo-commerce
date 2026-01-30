'use client';

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useSearchParams } from 'next/navigation'; 
import { HiOutlineViewGrid, HiOutlineViewList, HiChevronRight } from "react-icons/hi";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SidebarFilters from '@/components/Products/SidebarFilters';
import ProductCard from '@/components/ProductCard/ProductCard';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function AllProducts() {
    const searchParams = useSearchParams();
    const subCategoryId = searchParams.get('sub'); // Here we Capture the sub-category ID from Navbar link

    const [viewMode, setViewMode] = useState('grid');
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [metadata, setMetadata] = useState(null);
    const [totalResults, setTotalResults] = useState(0);

    const [currentPage, setCurrentPage] = useState(1);
    const [sortOrder, setSortOrder] = useState('-price');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [maxPrice, setMaxPrice] = useState(50000);

    const fetchProducts = useCallback(async () => {
        setIsLoading(true);
        try {
            const { data } = await axios.get(`https://ecommerce.routemisr.com/api/v1/products`, {
                params: {
                    page: currentPage,
                    limit: 12,
                    sort: sortOrder,
                    "price[lte]": maxPrice,
                    ...(subCategoryId ? { 'subcategory[in]': subCategoryId } : (selectedCategory && { 'category[in]': selectedCategory }))
                }
            });
            setProducts(data.data);
            setMetadata(data.metadata);
            setTotalResults(data.results);
        } catch (error) {
            console.error("Data fetch error:", error);
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, sortOrder, selectedCategory, maxPrice, subCategoryId]); // subCategoryId dependancy

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    useEffect(() => {
        const originalStyle = window.getComputedStyle(document.body).backgroundColor;
        document.body.style.backgroundColor = "#0f172a";
        return () => {
            document.body.style.backgroundColor = originalStyle;
        };
    }, []);

    const handleFilterApply = (filterData) => {
        setSelectedCategory(filterData.category);
        setMaxPrice(filterData.price);
        setCurrentPage(1);
    };

    return (
        <div className="bg-[#0f172a] min-h-screen pt-28 pb-20 text-white">
            <div className="max-w-screen-xl mx-auto px-4">
                
                {/* nav paths */}
                <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6 font-medium">
                    <span className="hover:text-[#12bb9c] transition-colors cursor-pointer">Home</span>
                    <HiChevronRight className="text-gray-600" />
                    <span className="text-white">All Products</span>
                    {subCategoryId && (
                        <>
                            <HiChevronRight className="text-gray-600" />
                            <span className="text-[#12bb9c]">Filtered Results</span>
                        </>
                    )}
                </nav>

                {/* header banner */}
                <div className="w-full bg-[#1e293b] rounded-3xl p-10 mb-10 border border-gray-700/50 relative overflow-hidden">
                    <div className="relative z-10">
                        <h1 className="text-4xl font-black mb-2 uppercase tracking-tight">
                            {subCategoryId ? "Sub-Category Results" : "Store Catalog"}
                        </h1>
                        <p className="text-gray-400 max-w-md">Browse our latest premium arrivals and exclusive tech gear.</p>
                    </div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#12bb9c]/10 blur-[100px] rounded-full -mr-20 -mt-20"></div>
                </div>

                <div className="flex flex-col lg:flex-row gap-10">
                    <aside className="w-full lg:w-1/4 shrink-0">
                        <SidebarFilters 
                            onApplyFilters={handleFilterApply}
                            initialCategory={selectedCategory}
                        />
                    </aside>

                    <main className="grow">
                        {/* toolbar */}
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 bg-[#1e293b]/40 p-4 rounded-2xl border border-gray-700/30">
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                                Showing <span className="text-[#12bb9c]">{products.length}</span> of {totalResults}
                            </p>

                            <div className="flex items-center gap-4">
                                {subCategoryId && (
                                    <button 
                                        onClick={() => window.location.href = '/productdetails'}
                                        className="text-xs cursor-pointer bg-[#12bb9c]/10 text-[#12bb9c] px-3 py-1 rounded-full border border-[#12bb9c]/30 hover:bg-[#12bb9c]/20 transition"
                                    >
                                        Clear Sub-category ✕
                                    </button>
                                )}
                                <div className="hidden md:flex bg-gray-900/50 rounded-xl p-1 border border-gray-700/50">
                                    <button onClick={() => setViewMode('grid')} 
                                        className={`p-2 rounded-lg transition-all cursor-pointer ${viewMode === 'grid' ? 'bg-[#12bb9c] text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}>
                                        <HiOutlineViewGrid size={20} />
                                    </button>
                                    <button onClick={() => setViewMode('list')} 
                                        className={`p-2 rounded-lg transition-all cursor-pointer ${viewMode === 'list' ? 'bg-[#12bb9c] text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}>
                                        <HiOutlineViewList size={20} />
                                    </button>
                                </div>

                                <Select value={sortOrder} onValueChange={(val) => { setSortOrder(val); setCurrentPage(1); }}>
                                    <SelectTrigger className="w-45 rounded-xl border-gray-700 bg-gray-900/40 text-white">
                                        <SelectValue placeholder="Sort By" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[#1e293b] border-gray-700 text-white">
                                        <SelectItem value="-price">Price: High to Low</SelectItem>
                                        <SelectItem value="price">Price: Low to High</SelectItem>
                                        <SelectItem value="-ratingsAverage">Highly Rated</SelectItem>
                                        <SelectItem value="title">Alphabetical</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Products Render */}
                        {isLoading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                                {[...Array(8)].map((_, i) => (
                                    <div key={i} className="bg-[#1e293b]/20 p-4 rounded-3xl border border-gray-800">
                                        <Skeleton height={220} baseColor="#1e293b" highlightColor="#334155" borderRadius={20} />
                                        <Skeleton className="mt-4" width="70%" baseColor="#1e293b" />
                                        <Skeleton className="mt-2" width="40%" baseColor="#1e293b" />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6' : 'flex flex-col gap-6'}>
                                {products.length > 0 ? (
                                    products.map((item) => (
                                        <ProductCard key={item._id} product={item} viewMode={viewMode} />
                                    ))
                                ) : (
                                    /* THE EMPTY Results */
                                    <div className="text-center py-20 px-4 border-2 border-dashed border-gray-800 rounded-3xl">
                                        <p className="text-gray-500 font-bold uppercase tracking-widest">No matching items found.</p>
                                        <button 
                                            onClick={() => window.location.href = '/productdetails'}
                                            className="mt-6 cursor-pointer text-sm bg-[#12bb9c] hover:bg-[#0fa388] text-white px-6 py-2 rounded-xl transition-all font-bold"
                                        >
                                            Reset Filters
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Pagination */}
                        {!isLoading && metadata?.numberOfPages > 1 && (
                            <div className="mt-16 flex justify-center items-center gap-3">
                                {[...Array(metadata.numberOfPages)].map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => { setCurrentPage(i + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                        className={`w-12 h-12 rounded-2xl font-black transition-all border cursor-pointer ${
                                            currentPage === i + 1 
                                            ? 'bg-[#12bb9c] border-[#12bb9c] text-white shadow-lg shadow-[#12bb9c]/20 scale-110' 
                                            : 'bg-transparent border-gray-700 text-gray-400 hover:border-[#12bb9c] hover:text-[#12bb9c]'
                                        }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}