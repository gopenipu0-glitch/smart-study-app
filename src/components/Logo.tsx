import React from 'react';
import { cn } from '../lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function Logo({ className, size = 'md' }: LogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-24 h-24',
    xl: 'w-48 h-48'
  };

  return (
    <div className={cn("relative rounded-full bg-gradient-to-br from-[#2196f3] to-[#ffc107] flex items-center justify-center overflow-hidden shadow-lg", sizeClasses[size], className)}>
      {/* Rotating Circle */}
      <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-[#2196f3] border-r-[#ffc107] animate-[spin_6s_linear_infinite]" />
      
      {/* Book */}
      <div className="absolute w-[35%] h-[45%] bg-white rounded-[2px] left-[20%] top-[27.5%] shadow-sm flex justify-center">
        <div className="w-[1px] h-full bg-slate-200" />
      </div>

      {/* Bulb */}
      <div className="absolute w-[35%] h-[35%] bg-[#ffeb3b] rounded-full right-[17.5%] top-[25%] shadow-inner flex flex-col items-center">
        <div className="absolute -bottom-[25%] w-[30%] h-[35%] bg-[#555] rounded-[2px]" />
      </div>

      {/* Growth Bars */}
      <div className="absolute bottom-[20%] right-[15%] flex items-end gap-[2px]">
        <div className="w-[4px] h-[10px] bg-[#2196f3]" />
        <div className="w-[4px] h-[15px] bg-[#2196f3]" />
        <div className="w-[4px] h-[22px] bg-[#2196f3]" />
      </div>
    </div>
  );
}
