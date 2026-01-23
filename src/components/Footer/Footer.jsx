import React from 'react';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="w-full bg-[#001f3f] py-10 mt-10 text-gray-200">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <h5 className="text-2xl font-semibold text-white">Get the Novalo app</h5>
          <p className="text-gray-400">We will send you a link, open it on your phone to download the app.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <input 
            className="grow p-2 bg-navy-900 border border-gray-700 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500" 
            type="email" 
            placeholder="Email .." 
          />
          <button className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition font-medium">
            Share App Link
          </button>
        </div>

        <hr className="my-6 border-gray-700" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <span className="font-medium">Payment Partners</span>
            <div className="flex gap-2 items-center bg-white/10 p-2 rounded-lg">
              {/* Added brightness filter to logos if they are too dark */}
              <Image src="/assets/images/Amazon_Pay_logo.png" alt="Amazon Pay" width={60} height={24} className="h-6 w-auto object-contain brightness-200" />
              <Image src="/assets/images/MasterCard-Logo.png" alt="MasterCard" width={40} height={24} className="h-6 w-auto object-contain" />
              <Image src="/assets/images/PayPal.png" alt="PayPal" width={60} height={24} className="h-6 w-auto object-contain" />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Get deliveries with Novalo</span>
            <div className="flex gap-2 items-center">
              <Image src="/assets/images/get-it-on-apple-store.png" alt="App Store" width={100} height={32} className="h-8 w-auto object-contain invert brightness-0" />
              <Image src="/assets/images/get-it-on-google-play-badge.png" alt="Google Play" width={110} height={32} className="h-8 w-auto object-contain invert brightness-0" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}