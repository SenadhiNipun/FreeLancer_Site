"use client";

import React, { useRef, useState } from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  index?: number;
  gradient?: string;
  tag?: string;
}

export function FeatureCard({
  title,
  description,
  icon: Icon,
  index = 0,
  gradient = "from-primary to-[#7C3AED]",
  tag,
}: FeatureCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMouse({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  };

  const glowX = `${mouse.x * 100}%`;
  const glowY = `${mouse.y * 100}%`;

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setMouse({ x: 0.5, y: 0.5 }); }}
      className="group relative rounded-[2rem] overflow-hidden cursor-default select-none animate-reveal"
      style={{
        transform: hovered
          ? `perspective(1000px) rotateX(${(mouse.y - 0.5) * -8}deg) rotateY(${(mouse.x - 0.5) * 8}deg) translateZ(8px)`
          : "perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)",
        transition: hovered ? "transform 0.08s ease-out" : "transform 0.5s ease-out",
        animationDelay: `${index * 100}ms`
      }}
    >
      <div className="relative h-full glass border-white/10 p-[1px] overflow-hidden group-hover:shadow-2xl group-hover:shadow-primary/10 transition-shadow">
        
        {/* Border glow */}
        <div
          className={cn(
            "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-br",
            gradient
          )}
        />
        
        {/* Inner glass mask */}
        <div className="absolute inset-[1px] rounded-[31px] glass bg-white/40" />

        {/* Dynamic mouse-tracked glow */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            background: `radial-gradient(250px circle at ${glowX} ${glowY}, oklch(0.6 0.2 260 / 0.1), transparent 80%)`,
            opacity: hovered ? 1 : 0,
          }}
        />

        {/* Card content */}
        <div className="relative z-10 p-8">
          <div className="flex items-start justify-between mb-8">
            <div className={cn("size-12 rounded-2xl flex items-center justify-center shadow-xl shadow-black/5 relative overflow-hidden group-hover:scale-110 transition-transform duration-500")}>
              <div className={cn("absolute inset-0 bg-gradient-to-br opacity-90", gradient)} />
              <Icon className="relative z-10 size-6 text-white" strokeWidth={2.5} />
            </div>
            {tag && (
              <span className="glass px-3 py-1 rounded-full text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest border-white/5">
                {tag}
              </span>
            )}
          </div>

          <h3 className="mb-2 text-[17px] font-bold text-foreground tracking-tight leading-snug">
            {title}
          </h3>
          <p className="text-[13px] text-muted-foreground font-medium leading-relaxed">
            {description}
          </p>

          <div className="mt-8 flex items-center gap-2 group/btn">
             <span className={cn("text-[12px] font-bold bg-gradient-to-r bg-clip-text text-transparent opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300", gradient)}>
               Learn more
             </span>
             <div className={cn("size-5 rounded-full glass border-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300", gradient.includes('primary') ? 'text-primary' : 'text-indigo-500')}>
                <ArrowRight className="size-3" strokeWidth={3} />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { ArrowRight } from "lucide-react";
