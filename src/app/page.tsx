import Link from "next/link";
import { ArrowRight, CheckCircle2, Globe, Zap, Shield, BarChart3 } from "lucide-react";

export default function Home() {
  return (
    <div className="relative flex flex-col overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 md:pt-32 md:pb-24">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium text-indigo-300">
            <Zap className="h-4 w-4 fill-current" />
            <span>AI-Powered SEO for Social Media</span>
          </div>
          
          <h1 className="mt-8 text-5xl font-extrabold tracking-tight sm:text-7xl lg:text-8xl">
            Content that <br />
            <span className="gradient-text">Dominates Search</span>
          </h1>
          
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400 sm:text-xl">
            Stop guessing. Generate social media content with built-in SEO intelligence,
            OpenGraph excellence, and real-time performance tracking.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/generate"
              className="group flex items-center gap-2 rounded-xl bg-indigo-600 px-8 py-4 text-lg font-bold text-white transition-all hover:bg-indigo-500 hover:scale-[1.02] active:scale-[0.98]"
            >
              Start Generating
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/dashboard"
              className="rounded-xl border border-white/10 bg-white/5 px-8 py-4 text-lg font-bold text-white transition-all hover:bg-white/10"
            >
              View Dashboard
            </Link>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-1/2 left-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/20 blur-[120px]" />
        <div className="absolute top-1/4 right-1/4 -z-10 h-[300px] w-[300px] rounded-full bg-rose-500/10 blur-[100px]" />
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-slate-950/50">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: Globe,
                title: "Global SEO",
                description: "Multi-platform optimization for Facebook, LinkedIn, YouTube, and more.",
              },
              {
                icon: BarChart3,
                title: "Real-time Audits",
                description: "Instant SEO scoring and keyword density analysis for your posts.",
              },
              {
                icon: Shield,
                title: "OG Mastery",
                description: "Automated OpenGraph and JSON-LD generation for maximum reach.",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="glass p-8 transition-all hover:border-white/20 hover:bg-white/[0.07]"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-bold">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core DNA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center gap-12 lg:flex-row">
            <div className="flex-1">
              <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
                SEO is in <br />
                <span className="text-indigo-400">Our DNA</span>
              </h2>
              <div className="mt-8 space-y-4">
                {[
                  "Automated Schema.org Markup",
                  "Semantically Structured Content",
                  "High-Performance Metadata API",
                  "AI-Driven Keyword Extraction",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-indigo-500" />
                    <span className="text-slate-300 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 w-full lg:max-w-xl">
              <div className="glass aspect-video overflow-hidden border-indigo-500/30 p-4">
                <div className="flex h-full flex-col gap-4 rounded-lg bg-slate-900/50 p-6">
                  <div className="h-4 w-3/4 animate-pulse rounded bg-indigo-500/20" />
                  <div className="h-4 w-1/2 animate-pulse rounded bg-indigo-500/10" />
                  <div className="mt-auto flex justify-between">
                    <div className="h-8 w-24 rounded bg-indigo-500/40" />
                    <div className="h-8 w-32 rounded bg-indigo-500/20" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
