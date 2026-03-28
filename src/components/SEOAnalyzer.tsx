"use client";

import { useState, useEffect } from "react";
import { AlertCircle, CheckCircle2, BarChart, Info, Zap } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SEOIssue {
  type: "error" | "warning" | "success";
  message: string;
}

interface SEOAnalyzerProps {
  content: string;
  aiScore?: number;
  aiFeedback?: string;
}

export function SEOAnalyzer({ content, aiScore, aiFeedback }: SEOAnalyzerProps) {
  const [score, setScore] = useState(0);
  const [issues, setIssues] = useState<SEOIssue[]>([]);

  useEffect(() => {
    // If we have an AI score, we use it as the base
    if (aiScore !== undefined) {
      setScore(aiScore);
    } else {
      analyzeContent(content);
    }
  }, [content, aiScore]);

  const analyzeContent = (text: string) => {
    if (!text) {
      setScore(0);
      setIssues([]);
      return;
    }
    const newIssues: SEOIssue[] = [];
    let currentScore = 0;

    if (text.length > 20) {
      newIssues.push({ type: "success", message: "Content length is optimal." });
      currentScore += 30;
    } else {
      newIssues.push({ type: "warning", message: "Content is too short for social reach." });
    }

    if (text.includes("#")) {
      newIssues.push({ type: "success", message: "Hashtags detected. Good for discoverability." });
      currentScore += 20;
    } else {
      newIssues.push({ type: "warning", message: "Consider adding relevant hashtags." });
    }

    const keywordMatch = text.match(/(SEO|Social|Marketing|Content)/gi);
    if (keywordMatch && keywordMatch.length >= 2) {
      newIssues.push({ type: "success", message: "Keywords density is healthy." });
      currentScore += 30;
    } else {
      newIssues.push({ type: "error", message: "Missing primary keywords." });
    }

    if (text.length > 280) {
      newIssues.push({ type: "warning", message: "Content exceeds Twitter/X limits." });
    } else {
      currentScore += 20;
    }

    setScore(Math.min(currentScore, 100));
    setIssues(newIssues);
  };

  return (
    <div className="glass overflow-hidden border-white/10 bg-slate-900/50">
      <div className="flex items-center justify-between border-b border-white/10 p-6">
        <h3 className="flex items-center gap-2 text-lg font-bold">
          <BarChart className="h-5 w-5 text-indigo-400" />
          SEO Audit
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-400">Score:</span>
          <span className={cn(
            "text-2xl font-black",
            score > 70 ? "text-green-400" : score > 40 ? "text-yellow-400" : "text-rose-400"
          )}>
            {score}
          </span>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {issues.length > 0 ? (
          issues.map((issue, i) => (
            <div
              key={i}
              className={cn(
                "flex items-start gap-3 rounded-lg border p-4 text-sm transition-all",
                issue.type === "success" && "border-green-500/20 bg-green-500/5 text-green-300",
                issue.type === "warning" && "border-yellow-500/20 bg-yellow-500/5 text-yellow-300",
                issue.type === "error" && "border-rose-500/20 bg-rose-500/5 text-rose-300"
              )}
            >
              {issue.type === "success" ? (
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
              ) : issue.type === "warning" ? (
                <Info className="mt-0.5 h-4 w-4 shrink-0" />
              ) : (
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              )}
              <p>{issue.message}</p>
            </div>
          ))
        ) : content ? (
            <div className="flex items-center gap-3 rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-4 text-sm text-indigo-300">
              <Zap className="h-4 w-4 shrink-0" />
              <p>AI has analyzed your content for optimal SEO performance.</p>
            </div>
        ) : (
          <div className="text-center py-4 text-slate-500 italic text-sm">
            Enter content to begin audit...
          </div>
        )}

        {(aiFeedback || content) && (
          <div className="mt-6 rounded-xl bg-indigo-500/10 p-4 border border-indigo-500/20">
            <h4 className="flex items-center gap-2 font-bold text-indigo-300 mb-2">
              <Zap className="h-4 w-4" />
              AI Suggestion
            </h4>
            <p className="text-sm text-slate-400 leading-relaxed whitespace-pre-line">
              {aiFeedback || (score < 100 
                ? "Try incorporating more semantically related terms like 'Audience Engagement' or 'Algorithm Optimization' to improve reach."
                : "Excellent! Your content is highly optimized for search engine crawlability and user engagement.")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
