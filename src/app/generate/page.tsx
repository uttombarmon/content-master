"use client";

import { useState, useTransition } from "react";
import { SEOAnalyzer } from "@/components/SEOAnalyzer";
import { PenTool, CheckCircle, Globe, Share2, Loader2, Zap } from "lucide-react";
import { generateAction } from "@/app/actions/generate";

export default function GeneratePage() {
  const [content, setContent] = useState("");
  const [platform, setPlatform] = useState("facebook");
  const [isPending, startTransition] = useTransition();
  const [generatedData, setGeneratedData] = useState<any>(null);

  const handleGenerate = () => {
    const formData = new FormData();
    formData.append("platform", platform);
    formData.append("topic", content);

    startTransition(async () => {
      try {
        const result = await generateAction(formData);
        setContent(result.body);
        setGeneratedData(result);
      } catch (e) {
        console.error("failed", e);
      }
    });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl gradient-text">
          Optimize Your Reach
        </h1>
        <p className="mt-4 text-lg text-slate-400">
          Craft SEO-perfect posts with real-time feedback and AI-powered suggestions.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Editor Section */}
        <div className="lg:col-span-12 xl:col-span-7 space-y-8">
          <div className="glass space-y-6 p-8 border-white/10 bg-slate-900/50">
            <div className="flex flex-wrap items-center gap-4">
              {["facebook", "instagram", "linkedin", "youtube"].map((p) => (
                <button
                  key={p}
                  disabled={isPending}
                  onClick={() => setPlatform(p)}
                  className={`
                    rounded-lg px-4 py-2 text-sm font-bold capitalize transition-all
                    ${platform === p 
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 scale-105" 
                      : "bg-white/5 text-slate-400 border border-white/5 hover:bg-white/10"
                    }
                    disabled:opacity-50 disabled:cursor-not-allowed
                  `}
                >
                  {p}
                </button>
              ))}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-indigo-300">Content Description / Topic</label>
              <textarea
                value={content}
                disabled={isPending}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What are we talking about today? Add keywords and hashtags..."
                className="
                  min-h-[250px] w-full rounded-xl border border-white/10 bg-slate-950/50 p-6 
                  text-lg placeholder-slate-600 focus:border-indigo-500/50 focus:outline-none 
                  focus:ring-2 focus:ring-indigo-500/20 transition-all
                  disabled:opacity-50
                "
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">
                {content.length} characters
              </span>
              <button 
                onClick={handleGenerate}
                disabled={isPending || !content}
                className="flex items-center gap-2 rounded-xl bg-linear-to-r from-indigo-600 to-rose-600 px-8 py-3 font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <PenTool className="h-4 w-4" />
                )}
                {isPending ? "Generating..." : "Generate with AI"}
              </button>
            </div>
          </div>

          {generatedData && (
            <div className="glass p-8 border-white/10 bg-slate-900/50 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-indigo-300">
                <Zap className="h-5 w-5" />
                Generated Content Details
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">Optimized Title</label>
                  <div className="text-lg font-semibold text-white bg-white/5 p-4 rounded-lg border border-white/5">
                    {generatedData.title || "No title generated"}
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">Target Keywords</label>
                    <div className="flex flex-wrap gap-2">
                      {generatedData.keywords?.map((kw: string, i: number) => (
                        <span key={i} className="px-3 py-1 bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 rounded-full text-sm">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">Hashtags</label>
                    <div className="flex flex-wrap gap-2">
                      {generatedData.hashtags?.map((ht: string, i: number) => (
                        <span key={i} className="px-3 py-1 bg-rose-500/10 text-rose-300 border border-rose-500/20 rounded-full text-sm font-medium">
                          #{ht.replace(/^#/, "")}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {generatedData.metadata?.seoExplanation && (
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">AI SEO Strategy</label>
                    <div className="bg-slate-950/50 p-4 rounded-lg border border-white/5 text-sm text-slate-300 leading-relaxed italic">
                      {generatedData.metadata.seoExplanation}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
             {[
               { icon: Share2, label: "Publish Fast" },
               { icon: Globe, label: "Global Reach" },
               { icon: CheckCircle, label: "SEO Approved" }
             ].map((feature, i) => (
               <div key={i} className="glass p-4 text-center border-white/5 bg-slate-900/40">
                 <feature.icon className="mx-auto h-5 w-5 text-indigo-400 mb-2" />
                 <span className="text-sm font-medium text-slate-300">{feature.label}</span>
               </div>
             ))}
          </div>
        </div>

        {/* Audit Sidebar */}
        <div className="lg:col-span-12 xl:col-span-5 space-y-6">
          <SEOAnalyzer 
            content={content} 
            aiScore={generatedData?.seoScore} 
            aiFeedback={generatedData?.metadata?.seoExplanation}
          />
          
          <div className="glass p-6 border-white/10 bg-slate-900/50">
             <h4 className="font-bold mb-4 flex items-center gap-2">
               <Globe className="h-4 w-4 text-indigo-400" />
               Live OG Preview
             </h4>
             <div className="aspect-video rounded-lg bg-slate-950/80 border border-white/5 flex items-center justify-center relative overflow-hidden group">
               <div className="text-slate-600 text-sm">Preview will appear here...</div>
               <div className="absolute inset-0 bg-indigo-500/0 group-hover:bg-indigo-500/5 transition-colors" />
             </div>
             <p className="mt-4 text-xs text-slate-500 italic text-center">
               This is how your post will look on {platform} search results.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
