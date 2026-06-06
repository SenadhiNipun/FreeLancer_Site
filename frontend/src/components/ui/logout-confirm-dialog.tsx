"use client";

import { LogOut, X } from "lucide-react";

interface LogoutConfirmDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function LogoutConfirmDialog({ open, onConfirm, onCancel }: LogoutConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Dialog */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 space-y-5">
        {/* Close button */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 size-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="size-4" />
        </button>

        {/* Icon */}
        <div className="flex justify-center">
          <div className="size-14 rounded-full bg-red-50 border border-red-100 flex items-center justify-center">
            <LogOut className="size-6 text-red-500" strokeWidth={1.75} />
          </div>
        </div>

        {/* Text */}
        <div className="text-center space-y-1.5">
          <h2 className="text-base font-semibold text-foreground">Sign out?</h2>
          <p className="text-sm text-muted-foreground">
            You will be returned to the sign-in page.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 h-10 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 h-10 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
