'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet";
import { HiAdjustmentsHorizontal } from "react-icons/hi2";
import { MdOutlineClearAll } from "react-icons/md";
import { cn } from "@/lib/utils";

const FilterUI = ({ 
    categories, 
    tempCategory, 
    setTempCategory, 
    tempPrice, 
    setTempPrice, 
    handleApply, 
    handleReset 
}) => (
    <div className="flex flex-col h-full">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-black uppercase tracking-tighter text-white">Refine Search</h2>
            <button 
                onClick={handleReset}
                className="text-[10px] font-bold text-gray-500 hover:text-[#12bb9c] transition-colors uppercase tracking-widest cursor-pointer"
            >
                Reset
            </button>
        </div>
        
        {/* Filter Accordion */}
        <Accordion type="multiple" defaultValue={["categories", "price"]} className="flex-1 ">
            <AccordionItem value="categories" className="border-gray-800 ">
                <AccordionTrigger className="cursor-pointer text-[11px] font-black uppercase tracking-widest text-gray-500 hover:no-underline">
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
                                    className={cn(
                                        "text-sm cursor-pointer transition-colors",
                                        tempCategory === cat._id ? 'text-[#12bb9c] font-bold' : 'text-gray-400 group-hover:text-white'
                                    )}
                                >
                                    {cat.name}
                                </label>
                            </div>
                        ))}
                    </div>
                </AccordionContent>
            </AccordionItem>

            <AccordionItem value="price" className="border-none">
                <AccordionTrigger className="cursor-pointer text-[11px] font-black uppercase tracking-widest text-gray-500 hover:no-underline">
                    Max Price
                </AccordionTrigger>
                <AccordionContent>
                    <div className="cursor-grabbing pt-6 px-2">
                        <Slider 
                            value={[tempPrice]} 
                            max={50000} 
                            step={500} 
                            onValueChange={(val) => setTempPrice(val[0])}
                        />
                        <div className=" flex justify-between mt-4 text-[10px] font-bold text-[#12bb9c]">
                            <span>0 EGP</span>
                            <span className="bg-[#12bb9c]/10 px-2 py-1 rounded-md">
                                {tempPrice.toLocaleString()} EGP
                            </span>
                        </div>
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>

        {/* Action Buttons */}
        <div className="mt-8 space-y-3">
            <button 
                onClick={handleApply}
                className="w-full bg-[#12bb9c] hover:bg-[#0ea88b] text-white font-black uppercase tracking-[0.2em] py-4 rounded-2xl transition-all active:scale-95 shadow-lg shadow-[#12bb9c]/10 text-[11px] cursor-pointer"
            >
                Apply Filters
            </button>
            
            {(tempCategory !== "" || tempPrice !== 50000) && (
                <button 
                    onClick={handleReset}
                    className="cursor-pointer w-full flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-red-400 hover:text-red-500 transition-colors py-2"
                >
                    <MdOutlineClearAll className="text-lg " />
                    Clear All Active Filters
                </button>
            )}
        </div>
    </div>
);

export default function SidebarFilters({ onApplyFilters, initialCategory = "" }) {
    const [categories, setCategories] = useState([]);
    const [tempCategory, setTempCategory] = useState(initialCategory);
    const [tempPrice, setTempPrice] = useState(50000);
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    useEffect(() => {
        axios.get('https://ecommerce.routemisr.com/api/v1/categories')
            .then(res => setCategories(res.data.data));
    }, []);

    const handleApply = () => {
        onApplyFilters({ category: tempCategory, price: tempPrice });
        setIsSheetOpen(false);
    };

    const handleReset = () => {
        const defaultPrice = 50000;
        setTempCategory("");
        setTempPrice(defaultPrice);
        onApplyFilters({ category: "", price: defaultPrice });
        setIsSheetOpen(false);
    };

    const filterProps = {
        categories, tempCategory, setTempCategory, tempPrice, setTempPrice, handleApply, handleReset
    };

    return (
        <>
            {/* DESKTOP VIEW */}
            <aside className="hidden lg:block sticky top-28 bg-[#1e293b]/20 p-6 rounded-3xl border border-gray-700/30">
                <FilterUI {...filterProps} />
            </aside>

            {/* MOBILE VIEW */}
            <div className="lg:hidden w-full mb-6 px-4">
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                    <SheetTrigger asChild>
                        <button className="w-full flex items-center justify-center gap-3 bg-[#1e293b]/40 border border-gray-700/50 p-4 rounded-2xl text-xs font-black uppercase tracking-widest text-white hover:bg-[#1e293b]/60 transition-all">
                            <HiAdjustmentsHorizontal className="text-xl text-[#12bb9c]" />
                            Filters & Refinement
                        </button>
                    </SheetTrigger>
                    <SheetContent side="left" className="bg-[#0f172a] border-r-gray-800 text-white pt-10">
                        <SheetHeader className="sr-only">
                            <SheetTitle>Filter Menu</SheetTitle>
                            <SheetDescription>Adjust your search criteria</SheetDescription>
                        </SheetHeader>
                        <FilterUI {...filterProps} />
                    </SheetContent>
                </Sheet>
            </div>
        </>
    );
}