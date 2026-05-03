"use client";

import React, { useState, useEffect } from "react";
import { differenceInSeconds } from "date-fns";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface CountdownTimerProps {
  deadline: string;
}

export function CountdownTimer({ deadline }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const diff = differenceInSeconds(new Date(deadline), new Date());
      setTimeLeft(diff > 0 ? diff : 0);
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [deadline]);

  const days = Math.floor(timeLeft / (3600 * 24));
  const hours = Math.floor((timeLeft % (3600 * 24)) / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  const isUrgent = timeLeft < 3600 * 24; // Less than 24 hours
  const isOverdue = timeLeft <= 0;

  return (
    <div className={cn(
      "flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-xl border transition-all duration-500",
      isOverdue 
        ? "bg-rose-50 text-rose-600 border-rose-100" 
        : isUrgent 
          ? "bg-orange-50 text-orange-600 border-orange-100 animate-pulse" 
          : "bg-emerald-50 text-emerald-600 border-emerald-100"
    )}>
      <Clock className={cn("size-3.5", isUrgent && !isOverdue && "animate-spin-slow")} />
      {isOverdue ? (
        "OVERDUE"
      ) : (
        <div className="flex items-center gap-1">
          <span className="opacity-70 uppercase text-[9px] tracking-tight mr-0.5">Ends in:</span>
          {days > 0 && <span>{days}d </span>}
          <span>{hours.toString().padStart(2, "0")}:</span>
          <span>{minutes.toString().padStart(2, "0")}:</span>
          <span>{seconds.toString().padStart(2, "0")}</span>
        </div>
      )}
    </div>
  );
}
