"use client";

import React, { useRef, useState } from "react";
import { LucideIcon, ArrowRight } from "lucide-react";
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
  gradient = "from-violet-500 to-indigo-600",
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

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setMouse({ x: 0.5, y: 0.5 }); }}
      className="group relative rounded-[1.75rem] overflow-hidden cursor-default select-none animate-reveal"
      style={{
        transform: hovered
          ? `perspective(1000px) rotateX(${(mouse.y - 0.5) * -6}deg) rotateY(${(mouse.x - 0.5) * 6}deg) translateZ(6px)`
          : "perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)",
        transition: hovered ? "transform 0.08s ease-out" : "transform 0.5s ease-out",
        animationDelay: `${index * 80}ms`,
      }}
    >
      <div className="relative h-full overflow-hidden rounded-[1.75rem] transition-shadow duration-500 group-hover:shadow-[0_16px_48px_oklch(0_0_0/0.1)]"
        style={{
          background: "oklch(1 0 0 / 0.82)",
          backdropFilter: "blur(16px)",
          border: "1px solid oklch(0.88 0.018 260 / 0.5)",
          boxShadow: "0 2px 12px oklch(0 0 0 / 0.05), inset 0 1px 0 oklch(1 0 0 / 0.7)"
        }}>

        {/* Gradient border glow on hover */}
        <div className={cn(
          "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[1.75rem] bg-gradient-to-br pointer-events-none",
          gradient
        )}
          style={{ padding: "1px", WebkitMask: "linear-gradient(white 0 0) content-box, linear-gradient(white 0 0)", WebkitMaskComposite: "xor", maskComposite: "exclude" }} />

        {/* Mouse-tracked spotlight */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 rounded-[1.75rem]"
          style={{
            background: `radial-gradient(280px circle at ${mouse.x * 100}% ${mouse.y * 100}%, oklch(0.58 0.22 265 / 0.07), transparent 80%)`,
            opacity: hovered ? 1 : 0,
          }}
        />

        {/* Card content */}
        <div className="relative z-10 p-8">
          {/* Icon + tag row */}
          <div className="flex items-start justify-between mb-7">
            <div className={cn(
              "size-12 rounded-2xl flex items-center justify-center relative overflow-hidden shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
            )}>
              <div className={cn("absolute inset-0 bg-gradient-to-br", gradient)} />
              <Icon className="relative z-10 size-6 text-white" strokeWidth={2.5} />
            </div>
            {tag && (
              <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground/60"
                style={{ background: "oklch(0 0 0 / 0.04)", border: "1px solid oklch(0.88 0.018 260 / 0.5)" }}>
                {tag}
              </span>
            )}
          </div>

          <h3 className="text-[17px] font-bold text-foreground tracking-tight leading-snug mb-3">
            {title}
          </h3>
          <p className="text-[13px] text-muted-foreground font-medium leading-relaxed">
            {description}
          </p>

          {/* Learn more — appears on hover */}
          <div className="mt-7 flex items-center gap-2 overflow-hidden">
            <span className={cn(
              "text-[12px] font-bold bg-gradient-to-r bg-clip-text text-transparent opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300",
              gradient
            )}>
              Learn more
            </span>
            <div className="size-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300"
              style={{ background: "oklch(0.58 0.22 265 / 0.1)", border: "1px solid oklch(0.58 0.22 265 / 0.15)" }}>
              <ArrowRight className="size-3 text-primary" strokeWidth={2.5} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
