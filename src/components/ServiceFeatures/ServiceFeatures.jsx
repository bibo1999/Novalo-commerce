import { MdAccessTime, MdOutlineLocalOffer, MdCached } from "react-icons/md";
import { FiPackage } from "react-icons/fi";

const features = [
  { 
    icon: MdAccessTime, 
    title: "10 minute grocery now", 
    desc: "Get your order delivered to your doorstep at the earliest." 
  },
  { 
    icon: MdOutlineLocalOffer, 
    title: "Best Prices & Offers", 
    desc: "Cheaper prices than your local supermarket, great cashback offers." 
  },
  { 
    icon: FiPackage, 
    title: "Wide Assortment", 
    desc: "Choose from 5000+ products across food, personal care, and more." 
  },
  { 
    icon: MdCached, 
    title: "Easy Returns", 
    desc: "Not satisfied? Return it at the doorstep & get a refund within hours." 
  },
];

export default function ServiceFeatures() {
  return (
    <section className="py-16 md:py-24 border-t border-slate-100 mt-10">
  <div className="max-w-screen-xl mx-auto px-6 lg:px-8">
    
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-12">
      {features.map((f, i) => (
        <div 
          key={i} 
          className="group flex items-start md:flex-col gap-4 p-5 md:p-6 lg:p-8 rounded-2xl bg-white md:bg-transparent border border-slate-50 md:border-none shadow-sm md:shadow-none transition-all duration-300 hover:shadow-md hover:bg-slate-50/50"
        >
          {/* Icon Container */}
          <div className="shrink-0 w-14 h-14 md:w-16 md:h-16 flex items-center justify-center rounded-2xl bg-[#12bb9c]/10 transition-colors group-hover:bg-[#12bb9c]/20">
            <f.icon className="text-2xl md:text-3xl text-[#12bb9c] transition-transform duration-300 group-hover:scale-110" />
          </div>

          <div className="flex flex-col gap-2 md:gap-4">
            <h3 className="text-sm md:text-xl font-bold text-[#001f3f] leading-tight">
              {f.title}
            </h3>
            <p className="text-xs md:text-base text-slate-500 leading-relaxed">
              {f.desc}
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>
  );
}