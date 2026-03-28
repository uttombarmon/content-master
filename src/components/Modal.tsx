"use client";

import { useEffect, ReactNode } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  width?: string;
}

export function Modal({ isOpen, onClose, title, children, width = "max-w-2xl" }: ModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleEscape);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      <div className={`relative w-full ${width} glass overflow-hidden rounded-3xl border border-white/10 bg-slate-900/90 shadow-2xl animate-in fade-in zoom-in-95 duration-300`}>
        <div className="flex items-center justify-between border-b border-white/5 px-8 py-6">
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <button 
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white transition-all"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="max-h-[80vh] overflow-y-auto p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
