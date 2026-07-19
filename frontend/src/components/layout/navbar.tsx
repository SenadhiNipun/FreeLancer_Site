"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { LayoutGrid, Menu, X, Layout, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authService } from "@/services/auth.service";
import { cn } from "@/lib/utils";
import { NotificationBell } from "@/components/notifications/notification-bell";
import { MessageNotificationBell } from "@/components/notifications/message-notification-bell";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dashboardUrl, setDashboardUrl] = useState("/");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const rolesStr = localStorage.getItem("user_roles");

    if (token) {
      setIsLoggedIn(true);
      if (rolesStr) {
        try {
          const roles = JSON.parse(rolesStr) as string[];
          if (roles.includes("SUPER_ADMIN") || roles.includes("ADMIN")) {
            setDashboardUrl("/admin/dashboard");
          } else if (roles.includes("WRITER")) {
            setDashboardUrl("/writer/dashboard");
          } else {
            setDashboardUrl("/customer/dashboard");
          }
        } catch {
          setDashboardUrl("/customer/dashboard");
        }
      }
    }

    const handleScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Features", href: "/#features" },
    { label: "For Writers", href: "/sign-up/writer" },
  ];

  return (
    <nav
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-500",
        scrolled
          ? "bg-white/95 backdrop-blur-md border-b border-border py-3 shadow-sm"
          : "bg-transparent py-5"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group"
        >
          <div className="size-8 rounded-lg bg-primary flex items-center justify-center shadow-md shadow-primary/20 group-hover:scale-105 transition-transform duration-200">
            <LayoutGrid className="size-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-[15px] font-bold text-foreground tracking-tight">
            Project<span className="text-primary">Hub</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted/60 transition-all duration-150"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTAs */}
        <div className="hidden items-center gap-6 md:flex">
          <ThemeToggle />
          {!isLoggedIn ? (
            <div className="flex items-center gap-2">
              <Link href="/sign-in">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 px-4 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded-lg"
                >
                  Sign in
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button
                  size="sm"
                  className="h-9 px-5 text-sm font-semibold bg-primary hover:bg-primary/90 text-white rounded-lg shadow-md shadow-primary/20 transition-all hover:shadow-lg hover:shadow-primary/25"
                >
                  Get started
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <MessageNotificationBell />
              <NotificationBell />
              <Link href={dashboardUrl}>
                <Button
                  size="sm"
                  className="h-9 px-5 text-sm font-semibold bg-primary hover:bg-primary/90 text-white rounded-lg gap-2 shadow-md shadow-primary/20"
                >
                  <Layout className="size-4" />
                  Dashboard
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden rounded-lg p-2 text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-colors"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden border-t border-border bg-card/95 backdrop-blur-xl px-5 py-6 space-y-1 animate-in slide-in-from-top-2 duration-200">
          <div className="flex justify-center mb-6">
            <ThemeToggle />
          </div>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block rounded-lg px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4 mt-4 border-t border-border space-y-2">
            {!isLoggedIn ? (
              <>
                <Link href="/sign-in" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full h-11 font-medium">
                    Sign in
                  </Button>
                </Link>
                <Link href="/sign-up" onClick={() => setIsOpen(false)}>
                  <Button className="w-full h-11 font-semibold bg-primary shadow-md shadow-primary/20">
                    Get started
                  </Button>
                </Link>
              </>
            ) : (
              <Link href={dashboardUrl} onClick={() => setIsOpen(false)}>
                <Button className="w-full h-11 font-semibold gap-2 bg-primary">
                  <Layout className="size-4" />
                  Go to Dashboard
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
