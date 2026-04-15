import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

export const Radar: React.FC = () => {
  const [rotation, setRotation] = useState(0);
  const [blips, setBlips] = useState<{ id: number; x: number; y: number; opacity: number }[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => (prev + 2) % 360);
    }, 50);

    const blipInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        const newBlip = {
          id: Date.now(),
          x: 30 + Math.random() * 40,
          y: 30 + Math.random() * 40,
          opacity: 1,
        };
        setBlips((prev) => [...prev.slice(-5), newBlip]);
      }
    }, 2000);

    return () => {
      clearInterval(interval);
      clearInterval(blipInterval);
    };
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-black/20 rounded-lg overflow-hidden border border-white/5">
      <div className="absolute top-2 right-4 text-[10px] font-mono text-accent-cyan opacity-60 uppercase tracking-widest">Zone-4</div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[8px] font-mono text-accent-cyan opacity-40 text-center">
        TARGET:<br />OIL_PUMP_01
      </div>
      
      {/* Radar Circles */}
      <div className="relative w-48 h-48 border border-accent-cyan/20 rounded-full flex items-center justify-center">
        <div className="w-32 h-32 border border-accent-cyan/15 rounded-full" />
        <div className="w-16 h-16 border border-accent-cyan/10 rounded-full" />
        
        {/* Crosshair */}
        <div className="absolute w-full h-px bg-accent-cyan/10" />
        <div className="absolute h-full w-px bg-accent-cyan/10" />

        {/* Sweeper */}
        <motion.div 
          className="absolute w-1/2 h-1/2 origin-bottom-right"
          style={{ 
            rotate: rotation,
            background: 'conic-gradient(from 0deg at 100% 100%, transparent 0deg, rgba(0, 242, 255, 0.2) 90deg, transparent 91deg)'
          }}
        />

        {/* Blips */}
        {blips.map((blip) => (
          <motion.div
            key={blip.id}
            initial={{ opacity: 1, scale: 0 }}
            animate={{ opacity: 0, scale: 2 }}
            transition={{ duration: 4, ease: "easeOut" }}
            className="absolute w-1.5 h-1.5 bg-accent-cyan rounded-full shadow-[0_0_8px_#00f2ff]"
            style={{ left: `${blip.x}%`, top: `${blip.y}%` }}
          />
        ))}
      </div>
    </div>
  );
};
