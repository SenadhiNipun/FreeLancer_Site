"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  PlusCircle, 
  ShoppingBag, 
  Wallet, 
  MessageSquare, 
  Star, 
  User, 
  LifeBuoy,
  LogOut,
  LayoutGrid
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { authService } from "@/services/auth.service";

export function CustomerSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/customer/dashboard" },
    { label: "Create Task", icon: PlusCircle, href: "/customer/create-task" },
    { label: "My Orders", icon: ShoppingBag, href: "/customer/orders" },
    { label: "Payments", icon: Wallet, href: "/customer/payments" },
    { label: "Messages", icon: MessageSquare, href: "/customer/messages" },
    { label: "Reviews", icon: Star, href: "/customer/reviews" },
    { label: "Profile", icon: User, href: "/customer/profile" },
    { label: "Support", icon: LifeBuoy, href: "/customer/support" },
  ];

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-72 border-r border-border/50 bg-card/50 backdrop-blur-xl">
      <div className="flex h-full flex-col px-6 py-8">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight mb-12">
          <div className="rounded-xl bg-primary p-2 shadow-lg shadow-primary/20">
            <LayoutGrid className="size-5 text-white" />
          </div>
          <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            Project Hub
          </span>
        </Link>

        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 group",
                  isActive 
                    ? "bg-primary text-white shadow-lg shadow-primary/20" 
                    : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
                )}
              >
                <item.icon className={cn("size-5", isActive ? "text-white" : "group-hover:text-primary")} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-8 border-t border-border/50">
          <Button 
            onClick={() => authService.logout()}
            variant="ghost" 
            className="w-full justify-start gap-3 rounded-xl px-4 py-6 text-sm font-medium text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="size-5" />
            Sign Out
          </Button>
        </div>
      </div>
    </aside>
  );
}
