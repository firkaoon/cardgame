import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CardProps {
  value: number;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  isPlayed?: boolean;
}

export default function Card({ value, onClick, className, disabled, isPlayed }: CardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    e.currentTarget.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    if (disabled) return;
    setIsHovered(true);
  };

  return (
    <motion.div
      className={cn(
        "relative w-16 h-24 rounded-2xl bg-white/10 backdrop-blur border border-white/20 cursor-pointer transition-all duration-300",
        "hover:bg-white/20 hover:border-white/40 hover:shadow-xl",
        "focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-transparent",
        disabled && "opacity-50 cursor-not-allowed",
        isPlayed && "opacity-30",
        className
      )}
      onClick={disabled ? undefined : onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        transformStyle: 'preserve-3d',
      }}
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-white/10" />
      <div className="relative z-10 flex items-center justify-center h-full text-2xl font-bold text-white">
        {value}
      </div>
      
      {isHovered && !disabled && (
        <motion.div
          className="absolute inset-0 rounded-2xl bg-blue-500/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}
    </motion.div>
  );
}


