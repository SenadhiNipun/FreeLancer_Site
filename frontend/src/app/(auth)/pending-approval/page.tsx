"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Clock, CheckCircle2, Mail, ShieldCheck, ArrowLeft } from "lucide-react";

const STEPS = [
  { icon: CheckCircle2, label: "Account created",       done: true  },
  { icon: Mail,         label: "Email verified",        done: true  },
  { icon: ShieldCheck,  label: "Admin review",          done: false },
  { icon: CheckCircle2, label: "Access granted",        done: false },
];

function PendingApprovalContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  return (
    <div className="space-y-8 text-center">
      {/* Animated icon */}
      <div className="flex justify-center">
        <div className="relative">
          <div className="size-20 rounded-full bg-amber-50 border-2 border-amber-200 flex items-center justify-center">
            <Clock className="size-9 text-amber-500" strokeWidth={1.5} />
          </div>
          <span className="absolute inset-0 rounded-full border-2 border-amber-300 animate-ping opacity-30" />
        </div>
      </div>

      {/* Heading */}
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-foreground">Application Under Review</h1>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
          Your writer application has been submitted and is currently being reviewed by our team.
        </p>
        {email && (
          <p className="text-xs text-muted-foreground">
            Submitted as <span className="font-medium text-foreground">{email}</span>
          </p>
        )}
      </div>

      {/* Progress steps */}
      <div className="bg-slate-50 border border-border rounded-xl p-5 text-left space-y-3">
        {STEPS.map(({ icon: Icon, label, done }, i) => (
          <div key={label} className="flex items-center gap-3">
            <div className={`size-7 rounded-full flex items-center justify-center flex-shrink-0 ${
              done ? "bg-green-100 text-green-600" : i === 2 ? "bg-amber-100 text-amber-500" : "bg-slate-100 text-slate-400"
            }`}>
              <Icon className="size-3.5" />
            </div>
            <span className={`text-sm ${done ? "text-foreground font-medium" : i === 2 ? "text-amber-700 font-medium" : "text-muted-foreground"}`}>
              {label}
            </span>
            {i === 2 && (
              <span className="ml-auto text-xs text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                In progress
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Info box */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-left">
        <p className="text-xs font-semibold text-blue-800 mb-1">What happens next?</p>
        <p className="text-xs text-blue-700 leading-relaxed">
          Our admin team will review your profile and qualifications. Once approved, you will be able to sign in and start accepting tasks. This usually takes 1–2 business days.
        </p>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <Link
          href={email ? `/sign-in` : "/sign-in"}
          className="flex items-center justify-center gap-2 w-full h-10 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="size-4" />
          Back to Sign In
        </Link>
        <p className="text-xs text-muted-foreground">
          Questions?{" "}
          <a href="mailto:support@projecthub.com" className="text-primary hover:underline">
            Contact support
          </a>
        </p>
      </div>
    </div>
  );
}

export default function PendingApprovalPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center py-12">
        <Clock className="size-6 text-amber-500 animate-pulse" />
      </div>
    }>
      <PendingApprovalContent />
    </Suspense>
  );
}
