import React from 'react';

export default function Loader() {
  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center">
      {/* The Spinner */}
      <div className="relative w-16 h-16">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-[#12bb9c]/20 border-t-[#12bb9c] rounded-full animate-spin"></div>
      </div>
      
     
      <p className="mt-4 text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px] animate-pulse">
        Loading Your Orders...
      </p>
    </div>
  );
}