"use client";

import { Share2, Globe, X, Copy, Check, UserPlus } from "lucide-react";
import { useState, useEffect } from "react";

interface ShareButtonsProps {
  content: string;
  title?: string;
}

export function ShareButtons({ content, title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLinks = [
    {
      name: "X (Twitter)",
      icon: X,
      color: "hover:text-[#ffffff]",
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(content)}`,
    },
    {
      name: "Facebook",
      icon: Globe,
      color: "hover:text-[#4267B2]",
      url: `https://www.facebook.com/sharer/sharer.php?quote=${encodeURIComponent(content)}&u=${encodeURIComponent(currentUrl)}`,
    },
    {
      name: "LinkedIn",
      icon: UserPlus,
      color: "hover:text-[#0077b5]",
      url: `https://www.linkedin.com/sharing/share-offsite/?text=${encodeURIComponent(content)}`,
    },
  ];

  const handleNativeShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: title || "Generated SEO Content",
          text: content,
          url: currentUrl,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2 pr-4 border-r border-white/10">
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 transition-all hover:bg-white/10 active:scale-95 border border-white/5"
        >
          {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copied!" : "Copy Post"}
        </button>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Share Real-Time:</span>
        {shareLinks.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-slate-400 transition-all hover:scale-110 ${link.color}`}
            title={`Share on ${link.name}`}
          >
            <link.icon className="h-5 w-5" />
          </a>
        ))}
        
        {typeof navigator !== "undefined" && "share" in navigator && (
          <button
            onClick={handleNativeShare}
            className="text-slate-400 transition-all hover:scale-110 hover:text-indigo-400"
            title="System Share"
          >
            <Share2 className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
}
