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
      {/* Grid: 1 column on mobile, 2 on tablet, 4 on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
        {features.map((f, i) => (
          <div 
            key={i} 
            className="group flex items-start md:flex-col gap-4 p-5 md:p-0 rounded-2xl bg-white md:bg-transparent border border-slate-50 md:border-none shadow-sm md:shadow-none transition-all duration-300 hover:shadow-md"
          >
            {/* Icon Container with subtle background on mobile */}
            <div className="flex-shrink-0 w-12 h-12 md:w-auto md:h-auto flex items-center justify-center rounded-xl bg-[#12bb9c]/10 md:bg-transparent">
              <f.icon className="text-2xl md:text-4xl text-[#12bb9c] transition-transform duration-300 group-hover:scale-110" />
            </div>

            <div className="flex flex-col gap-1 md:gap-3">
              <h3 className="text-sm md:text-lg font-bold text-[#001f3f] leading-tight">
                {f.title}
              </h3>
              <p className="text-xs md:text-sm text-slate-500 leading-relaxed">
                {f.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}