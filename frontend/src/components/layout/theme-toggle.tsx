"use client";

import React from "react";
import { Sun, Moon, Laptop } from "lucide-react";
import { useTheme } from "@/components/providers/theme-provider";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-1 p-1 glass rounded-2xl border-white/5">
      <button
        onClick={() => setTheme("light")}
        className={cn(
          "size-9 rounded-xl flex items-center justify-center transition-all",
          theme === "light" ? "bg-primary text-white shadow-lg shadow-primary/20 scale-110" : "text-muted-foreground/60 hover:text-foreground"
        )}
        title="Light Mode"
      >
        <Sun className="size-4.5" />
      </button>
      <button
        onClick={() => setTheme("dark")}
        className={cn(
          "size-9 rounded-xl flex items-center justify-center transition-all",
          theme === "dark" ? "bg-primary text-white shadow-lg shadow-primary/20 scale-110" : "text-muted-foreground/60 hover:text-foreground"
        )}
        title="Dark Mode"
      >
        <Moon className="size-4.5" />
      </button>
      <button
        onClick={() => setTheme("system")}
        className={cn(
          "size-9 rounded-xl flex items-center justify-center transition-all",
          theme === "system" ? "bg-primary text-white shadow-lg shadow-primary/20 scale-110" : "text-muted-foreground/60 hover:text-foreground"
        )}
        title="System Preference"
      >
        <Laptop className="size-4.5" />
      </button>
    </div>
  );
}
