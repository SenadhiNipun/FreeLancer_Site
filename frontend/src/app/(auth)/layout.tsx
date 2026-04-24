import React from "react";
import { LayoutGrid } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row">
      {/* Brand Section */}
      <div className="hidden w-1/2 flex-col justify-between bg-primary p-12 text-primary-foreground lg:flex">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold tracking-tight">
          <div className="rounded-lg bg-white p-2 text-primary">
            <LayoutGrid className="size-6" />
          </div>
          Project Hub
        </Link>
        <div className="space-y-6">
          <h2 className="text-4xl font-bold leading-tight">
            Managing your projects <br /> has never been easier.
          </h2>
          <p className="text-lg opacity-80 max-w-md text-balance leading-relaxed">
            Join thousands of professionals using Project Hub to facilitate 
            seamless coordination and task management.
          </p>
        </div>
        <div className="text-sm opacity-60">
          © 2026 Project Hub Inc. All rights reserved.
        </div>
      </div>

      {/* Form Section */}
      <div className="flex flex-1 items-center justify-center bg-muted/30 p-6 sm:p-12">
        <div className="w-full max-w-[400px]">
          <div className="mb-8 flex justify-center lg:hidden">
            <Link href="/" className="flex items-center gap-2 text-2xl font-bold">
              <div className="rounded-lg bg-primary p-2 text-white">
                <LayoutGrid className="size-6" />
              </div>
              Project Hub
            </Link>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
