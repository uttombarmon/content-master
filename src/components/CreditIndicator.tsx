"use client";

import { Zap } from "lucide-react";

interface CreditIndicatorProps {
  credits: number;
  plan: string;
}

export function CreditIndicator({ credits, plan }: CreditIndicatorProps) {
  const maxCredits = plan === "pro" ? 100 : 10;
  const percentage = (credits / maxCredits) * 100;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-amber-400" />
          <span className="text-sm font-bold text-slate-300">Credits Remaining</span>
        </div>
        <span className="text-sm font-black text-white">
          {credits} / {maxCredits}
        </span>
      </div>
      
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
        <div 
          className="h-full bg-linear-to-r from-amber-500 to-orange-500 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(245,158,11,0.3)]"
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">
        {plan === "free" ? "Resets in 24h" : "Unlimited Monthly"}
      </p>
    </div>
  );
}
