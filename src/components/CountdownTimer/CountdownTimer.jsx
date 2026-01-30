import { useState, useEffect } from 'react';

export default function CountdownTimer({ targetDate }) {
  const [timeLeft, setTimeLeft] = useState({ Days: 0, Hours: 0, Mins: 0, Sec: 0 });

  useEffect(() => {
    if (!targetDate) return;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      // Checking if the date is valid or not
      if(isNaN(target)) {
        console.error("Invalid targetDate");
        return clearInterval(timer);
        
      }
      const distance = target - now;

      if (distance <= 0){
        setTimeLeft({Days:0, Hours:0, Mins:0, Sec:0 });
        return clearInterval(timer);
      }
        

      setTimeLeft({
        Days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        Hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        Mins: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        Sec: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="grid grid-cols-4 gap-2 mt-4">
      {Object.entries(timeLeft).map(([label, value]) => (
        <div key={label} className="flex flex-col items-center justify-center bg-slate-50 border border-slate-100 rounded-xl py-2">
          <span className="text-sm font-black text-[#12bb9c]">{value}</span>  
          <span className="text-[9px] uppercase text-slate-400 font-bold">{label}</span>
        </div>
      ))}
    </div>
  );
}