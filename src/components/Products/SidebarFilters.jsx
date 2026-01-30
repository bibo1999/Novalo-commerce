'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";

export default function SidebarFilters({ onApplyFilters, initialCategory = "" }) {
    const [categories, setCategories] = useState([]);
    
    // State to hold any Selection before clicking Apply
    const [tempCategory, setTempCategory] = useState(initialCategory);
    const [tempPrice, setTempPrice] = useState(50000);

    useEffect(() => {
        axios.get('https://ecommerce.routemisr.com/api/v1/categories')
            .then(res => setCategories(res.data.data));
    }, []);
    // Handle Apply filter
    const handleApply = () => {
        onApplyFilters({
            category: tempCategory,
            price: tempPrice
        });
    };

    const handleReset = () => {
        setTempCategory("");
        setTempPrice(50000);
        onApplyFilters({ category: "", price: 50000 });
    };

    return (
        <div className="sticky top-28 bg-[#1e293b]/20 p-6 rounded-3xl border border-gray-700/30">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-black uppercase tracking-tighter">Refine Search</h2>
                <button 
                    onClick={handleReset}
                    className="text-[10px] font-bold text-gray-500 hover:text-[#12bb9c] transition-colors uppercase tracking-widest cursor-pointer"
                >
                    Reset
                </button>
            </div>
            
            <Accordion type="multiple" defaultValue={["categories", "price"]}>
                {/* Categories */}
                <AccordionItem value="categories" className="border-gray-800">
                    <AccordionTrigger className="text-[11px] font-black uppercase tracking-widest text-gray-500 hover:no-underline">
                        Categories
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-3 pt-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                            {categories.map((cat) => (
                                <div 
                                    key={cat._id} 
                                    className="flex items-center gap-3 group cursor-pointer"
                                    onClick={() => setTempCategory(cat._id)}
                                >
                                    <Checkbox 
                                        id={cat._id} 
                                        checked={tempCategory === cat._id}
                                        onCheckedChange={() => setTempCategory(cat._id)}
                                    />
                                    <label 
                                        htmlFor={cat._id}
                                        className={`text-sm cursor-pointer transition-colors ${
                                            tempCategory === cat._id ? 'text-[#12bb9c] font-bold' : 'text-gray-400 group-hover:text-white'
                                        }`}
                                    >
                                        {cat.name}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* Price Range */}
                <AccordionItem value="price" className="border-none">
                    <AccordionTrigger className="text-[11px] font-black uppercase tracking-widest text-gray-500 hover:no-underline">
                        Max Price
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="pt-6 px-2">
                            <Slider 
                                value={[tempPrice]} 
                                max={50000} 
                                step={500} 
                                onValueChange={(val) => setTempPrice(val[0])}
                            />
                            <div className="flex justify-between mt-4 text-[10px] font-bold text-[#12bb9c]">
                                <span>0 EGP</span>
                                <span className="bg-[#12bb9c]/10 px-2 py-1 rounded-md">
                                    {tempPrice.toLocaleString()} EGP
                                </span>
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

            {/* Apply Filter Button */}
            <button 
                onClick={handleApply}
                className="w-full mt-8 bg-[#12bb9c] hover:bg-[#0ea88b] text-white font-black uppercase tracking-[0.2em] py-4 rounded-2xl transition-all active:scale-95 shadow-lg shadow-[#12bb9c]/10 text-[11px] cursor-pointer"
            >
                Apply Filters
            </button>
        </div>
    );
}