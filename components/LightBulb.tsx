
import React from 'react';

interface LightBulbProps {
  isOn: boolean;
  isPulling: boolean;
  onPull: () => void;
}

export const LightBulb: React.FC<LightBulbProps> = ({ isOn, isPulling, onPull }) => {
  return (
    <div className="relative flex flex-col items-center select-none">
      {/* Wire from ceiling */}
      <div className="w-1 h-32 bg-zinc-800" />

      {/* The Bulb Socket */}
      <div className="w-12 h-8 bg-zinc-700 rounded-t-lg -mt-1 relative z-10" />

      {/* The Bulb itself */}
      <div className="relative -mt-1 cursor-pointer group" onClick={onPull}>
        <svg 
          width="100" 
          height="130" 
          viewBox="0 0 100 130" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className={`transition-all duration-[1500ms] ease-in-out ${isOn ? "animate-bulb-breath" : ""}`}
        >
          {/* Bulb Outer Glass */}
          <path 
            d="M50 120C25.1472 120 5 99.8528 5 75C5 50.1472 25.1472 30 50 30C74.8528 30 95 50.1472 95 75C95 99.8528 74.8528 120 50 120Z" 
            fill={isOn ? "rgba(251, 191, 36, 0.4)" : "rgba(39, 39, 42, 0.4)"}
            className="transition-all duration-[1500ms] ease-in-out"
          />
          <path 
            d="M50 120C25.1472 120 5 99.8528 5 75C5 50.1472 25.1472 30 50 30C74.8528 30 95 50.1472 95 75C95 99.8528 74.8528 120 50 120Z" 
            stroke={isOn ? "#fbbf24" : "#3f3f46"} 
            strokeWidth="3"
            className="transition-all duration-[1500ms] ease-in-out"
          />
          
          {/* Filament */}
          <path 
            d="M35 70 Q50 40 65 70" 
            stroke={isOn ? "#fffbeb" : "#52525b"} 
            strokeWidth="2.5" 
            fill="none"
            className="transition-all duration-[1500ms] ease-in-out"
          />
          <path 
            d="M35 70 L40 90 M65 70 L60 90" 
            stroke={isOn ? "#fffbeb" : "#52525b"} 
            strokeWidth="1.5"
            className="transition-all duration-[1500ms] ease-in-out"
          />
          
          {/* Internal Glow */}
          <circle 
            cx="50" 
            cy="75" 
            r="35" 
            fill="url(#bulbGlow)" 
            className={`transition-opacity duration-[1500ms] ease-in-out ${isOn ? "opacity-100 animate-pulse" : "opacity-0"}`} 
          />

          <defs>
            <radialGradient id="bulbGlow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#d97706" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>

        {/* Outer Halo Glow Layers */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div 
            className={`absolute top-0 left-0 w-[200px] h-[200px] -translate-x-1/2 -translate-y-1/2 bg-amber-400/40 rounded-full blur-[40px] transition-all duration-[1500ms] ease-in-out ${isOn ? "opacity-100 scale-100" : "opacity-0 scale-50"}`} 
          />
          <div 
            className={`absolute top-0 left-0 w-[500px] h-[500px] -translate-x-1/2 -translate-y-1/2 bg-amber-500/10 rounded-full blur-[100px] transition-all duration-[2000ms] ease-in-out animate-glow-shimmer ${isOn ? "opacity-100 scale-100" : "opacity-0 scale-75"}`} 
          />
          <div 
            className={`absolute top-0 left-0 w-[800px] h-[800px] -translate-x-1/2 -translate-y-1/2 bg-amber-600/5 rounded-full blur-[150px] transition-all duration-[2500ms] ease-in-out ${isOn ? "opacity-100" : "opacity-0"}`} 
          />
        </div>
      </div>

      {/* Pull Rope */}
      <div 
        className={`absolute top-0 left-[calc(50%+80px)] flex flex-col items-center transition-transform duration-300 ease-out cursor-pointer hover:brightness-125 group/rope`}
        style={{ transform: `translateY(${isPulling ? '30px' : '0px'})` }}
        onClick={onPull}
      >
        {/* Rope String */}
        <div className={`w-0.5 h-80 transition-all duration-150 ${isPulling ? 'bg-amber-100 scale-x-150' : 'bg-zinc-600 group-hover/rope:bg-zinc-500'} shadow-sm`} />
        
        {/* Rope Handle */}
        <div className={`w-5 h-10 rounded-b-2xl rounded-t-sm shadow-xl border-b-2 flex flex-col items-center transition-all duration-150 ${
          isPulling 
            ? 'bg-amber-200 border-amber-400 scale-110 shadow-amber-500/50' 
            : 'bg-zinc-500 border-zinc-700 group-hover/rope:bg-zinc-400'
        }`}>
            {/* Grip Ridges */}
            <div className={`w-full h-1 mt-1.5 transition-colors ${isPulling ? 'bg-amber-400/50' : 'bg-zinc-600/50'}`} />
            <div className={`w-full h-1 mt-1 transition-colors ${isPulling ? 'bg-amber-400/50' : 'bg-zinc-600/50'}`} />
            <div className={`w-full h-1 mt-1 transition-colors ${isPulling ? 'bg-amber-400/50' : 'bg-zinc-600/50'}`} />
        </div>

        {/* Action Glow (Only visible when pulling) */}
        <div className={`absolute -bottom-2 w-8 h-12 bg-amber-400/30 blur-md rounded-full transition-opacity duration-150 ${isPulling ? 'opacity-100' : 'opacity-0'}`} />
      </div>
    </div>
  );
};
