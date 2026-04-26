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
  glowColor?: string;   // tailwind color for the glow — e.g. "indigo"
  tag?: string;
}

export function FeatureCard({
  title,
  description,
  icon: Icon,
  index = 0,
  gradient = "from-indigo-500 to-violet-600",
  glowColor = "indigo",
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
      className="group relative rounded-2xl overflow-hidden cursor-default select-none"
      style={{
        transform: hovered
          ? `perspective(1000px) rotateX(${(mouse.y - 0.5) * -8}deg) rotateY(${(mouse.x - 0.5) * 8}deg) translateZ(8px)`
          : "perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)",
        transition: hovered ? "transform 0.08s ease-out" : "transform 0.5s ease-out",
      }}
    >
      {/* ── Dark card body ── */}
      <div className="relative h-full rounded-2xl bg-[#0D0D14] border border-white/8 p-[1px] overflow-hidden">

        {/* Gradient border frame */}
        <div
          className={cn(
            "absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br",
            gradient
          )}
        />
        {/* Inner mask to create border effect */}
        <div className="absolute inset-[1px] rounded-[15px] bg-[#0D0D14]" />

        {/* Mouse-tracked glow spotlight */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300"
          style={{
            background: `radial-gradient(320px circle at ${glowX} ${glowY}, rgba(99,102,241,0.10) 0%, transparent 70%)`,
            opacity: hovered ? 1 : 0,
          }}
        />

        {/* Noise texture overlay */}
        <div
          className="absolute inset-0 rounded-2xl opacity-[0.025] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundSize: "128px 128px",
          }}
        />

        {/* Card content */}
        <div className="relative z-10 p-7">
          {/* Top row */}
          <div className="flex items-start justify-between mb-7">
            {/* Icon with gradient bg */}
            <div
              className={cn(
                "relative size-12 rounded-xl flex items-center justify-center overflow-hidden",
                "shadow-lg transition-transform duration-300 group-hover:scale-110"
              )}
            >
              {/* Gradient fill */}
              <div className={cn("absolute inset-0 bg-gradient-to-br opacity-90", gradient)} />
              {/* Glass sheen */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
              <Icon className="relative z-10 size-5 text-white" strokeWidth={2.5} />
            </div>

            {tag && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold text-white/40 uppercase tracking-widest">
                {tag}
              </span>
            )}
          </div>

          {/* Text */}
          <h3 className="mb-2.5 text-[15px] font-semibold text-white/90 leading-snug">
            {title}
          </h3>
          <p className="text-sm text-white/40 leading-relaxed">
            {description}
          </p>

          {/* Bottom link */}
          <div className="mt-8 flex items-center gap-1.5">
            <span
              className={cn(
                "text-xs font-semibold bg-gradient-to-r bg-clip-text text-transparent transition-all duration-200",
                "opacity-0 group-hover:opacity-100 translate-x-0",
                gradient
              )}
            >
              Learn more
            </span>
            <svg
              className={cn(
                "size-3.5 transition-all duration-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5",
                "bg-gradient-to-r bg-clip-text",
                gradient
              )}
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="url(#arrow-grad)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <defs>
                <linearGradient id="arrow-grad" x1="0" y1="0" x2="16" y2="0" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#6366f1" />
                  <stop offset="1" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Bottom gradient accent bar */}
        <div
          className={cn(
            "absolute bottom-0 inset-x-0 h-px bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-500",
            gradient
          )}
        />
      </div>
    </div>
  );
}
