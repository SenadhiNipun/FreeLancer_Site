"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { LayoutGrid, Menu, X, LogOut, Layout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authService } from "@/services/auth.service";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dashboardUrl, setDashboardUrl] = useState("/");

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
        } catch (e) {
          setDashboardUrl("/customer/dashboard");
        }
      }
    }
  }, []);

  const handleLogout = () => {
    authService.logout();
  };

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-border/50 bg-background/70 backdrop-blur-xl transition-all duration-300">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight hover:opacity-90 transition-opacity">
            <div className="rounded-xl bg-primary p-2 shadow-lg shadow-primary/20">
              <LayoutGrid className="size-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              Project Hub
            </span>
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden items-center gap-8 md:flex">
          <Link href="/#features" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            Features
          </Link>
          {!isLoggedIn && (
            <Link href="/sign-up/writer" className="relative group text-sm font-medium text-muted-foreground hover:text-accent transition-colors">
              Join as Writer
              <span className="absolute -top-1 -right-4 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
              </span>
            </Link>
          )}

          <div className="flex items-center gap-4 ml-2">
            {!isLoggedIn ? (
              <>
                <Link href="/sign-in">
                  <Button variant="ghost" size="sm" className="font-semibold">Sign In</Button>
                </Link>
                <Link href="/sign-up">
                  <Button size="sm" className="bg-primary hover:bg-primary/90 text-white shadow-md shadow-primary/10 px-6">
                    Get Started
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href={dashboardUrl}>
                  <Button variant="ghost" size="sm" className="font-semibold gap-2">
                    <Layout className="size-4" /> Dashboard
                  </Button>
                </Link>
                <Button 
                  onClick={handleLogout}
                  variant="outline" 
                  size="sm" 
                  className="border-primary/20 hover:bg-destructive/5 hover:text-destructive hover:border-destructive/30 transition-all gap-2"
                >
                  <LogOut className="size-4" /> Sign Out
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center justify-center rounded-lg p-2 text-muted-foreground hover:bg-muted/50 transition-colors"
          >
            {isOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-lg p-6 space-y-6 animate-in slide-in-from-top-4 duration-300">
          <div className="space-y-4">
            <Link href="/#features" className="block text-lg font-medium py-2 text-muted-foreground hover:text-primary" onClick={() => setIsOpen(false)}>
              Features
            </Link>
            {!isLoggedIn && (
              <Link href="/sign-up/writer" className="block text-lg font-medium py-2 text-accent" onClick={() => setIsOpen(false)}>
                Join as Writer
              </Link>
            )}
          </div>
          <div className="flex flex-col gap-3 pt-4 border-t border-border">
            {!isLoggedIn ? (
              <>
                <Link href="/sign-in" className="w-full" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full h-12">Sign In</Button>
                </Link>
                <Link href="/sign-up" className="w-full" onClick={() => setIsOpen(false)}>
                  <Button className="w-full h-12 bg-primary shadow-lg shadow-primary/20">Get Started</Button>
                </Link>
              </>
            ) : (
              <>
                <Link href={dashboardUrl} className="w-full" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full h-12 gap-2"><Layout className="size-5" /> My Dashboard</Button>
                </Link>
                <Button 
                  onClick={handleLogout}
                  className="w-full h-12 bg-destructive/10 text-destructive hover:bg-destructive/20 gap-2 border-none"
                >
                  <LogOut className="size-5" /> Sign Out
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
