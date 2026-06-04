"use client";

import React from "react";
import { Sun, Moon, Laptop } from "lucide-react";
import { useTheme } from "@/components/providers/theme-provider";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-0.5 p-0.5 bg-muted rounded-lg border border-border">
      {[
        { value: "light",  icon: Sun,     title: "Light" },
        { value: "dark",   icon: Moon,    title: "Dark" },
        { value: "system", icon: Laptop,  title: "System" },
      ].map(({ value, icon: Icon, title }) => (
        <button key={value} onClick={() => setTheme(value as any)} title={title}
          className={cn(
            "size-7 rounded-md flex items-center justify-center transition-colors",
            theme === value ? "bg-white dark:bg-slate-700 shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
          )}>
          <Icon className="size-3.5" />
        </button>
      ))}
    </div>
  );
}
