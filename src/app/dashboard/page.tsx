import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { socialContent, user } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import Link from "next/link";
import { CreditIndicator } from "@/components/CreditIndicator";
import { DashboardContent } from "@/components/DashboardContent";
import {
  BarChart3,
  Layers,
  Search,
  Zap,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  Plus,
} from "lucide-react";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const posts = await db.query.socialContent.findMany({
    where: eq(socialContent.userId, session.user.id),
    orderBy: [desc(socialContent.createdAt)],
  });

  const userData = await db.query.user.findFirst({
    where: eq(user.id, session.user.id),
  });

  if (!userData) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-10">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-white mb-2 flex items-center gap-3">
              Content Dashboard
              {userData.plan === "pro" && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-500 border border-amber-500/20 uppercase tracking-tighter">
                  <Zap className="h-3 w-3 fill-amber-500" />
                  PRO
                </span>
              )}
            </h1>
            <p className="text-slate-400">
              Manage your AI-generated social media strategy.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/generate"
              className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-indigo-500 hover:scale-[1.02] shadow-xl shadow-indigo-600/20"
            >
              <Plus className="h-4 w-4" />
              New Post
            </Link>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-12 mb-12">
          {/* Main Stats */}
          <div className="lg:col-span-12 space-y-8">
            {/* <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="glass p-6 rounded-2xl border-white/5 bg-slate-900/40 hover:bg-slate-900/60 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-indigo-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Layers className="h-6 w-6 text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Total Posts
                    </p>
                    <p className="text-3xl font-black text-white">
                      {posts.length}
                    </p>
                  </div>
                </div>
              </div>
              <div className="glass p-6 rounded-2xl border-white/5 bg-slate-900/40 hover:bg-slate-900/60 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-rose-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Search className="h-6 w-6 text-rose-400" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      SEO Score Avg
                    </p>
                    <p className="text-3xl font-black text-white">92%</p>
                  </div>
                </div>
              </div>
              <div className="glass p-6 rounded-2xl border-white/5 bg-slate-900/40 hover:bg-slate-900/60 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <BarChart3 className="h-6 w-6 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Reach Trend
                    </p>
                    <p className="text-3xl font-black text-white">+14%</p>
                  </div>
                </div>
              </div>
            </div> */}

            {/* Content List & Modals (Client Side) */}
            <DashboardContent
              initialPosts={posts}
              userData={{
                id: userData.id,
                name: userData.name,
                email: userData.email,
                credits: userData.credits,
                plan: userData.plan,
              }}
            />
          </div>

          {/* Sidebar Plans & Credits */}
          {/* <div className="lg:col-span-4 space-y-6">
            <div className="glass p-8 rounded-2xl border-indigo-500/20 bg-linear-to-br from-indigo-500/8 to-rose-500/8 shadow-2xl relative overflow-hidden">
              <Sparkles className="absolute -top-4 -right-4 h-24 w-24 text-indigo-500/5 rotate-12" />
              <CreditIndicator credits={userData.credits} plan={userData.plan} />
              
              <div className="mt-8 space-y-4">
                <h4 className="flex items-center gap-2 text-sm font-black text-white uppercase tracking-wider">
                  <TrendingUp className="h-4 w-4 text-indigo-400" />
                  Upgrade Your Potential
                </h4>
                <div className="space-y-3">
                  {[
                    "100 AI Generations / day",
                    "Advanced SEO Deep Audit",
                    "Competitor Insight Analysis",
                    "Priority AI Processing",
                    "Custom Brand Voice Mode"
                  ].map((feat, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-slate-400 font-medium">
                      <CheckCircle2 className="h-4 w-4 text-indigo-400 shrink-0" />
                      {feat}
                    </div>
                  ))}
                </div>
                
                <button className="w-full mt-6 rounded-xl bg-linear-to-r from-indigo-600 to-rose-600 py-4 font-black text-white hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-indigo-600/20 uppercase tracking-widest text-xs">
                  Upgrade to Pro — $29/mo
                </button>
                <p className="text-center text-[10px] text-slate-500 font-bold uppercase tracking-tighter">
                  Cancel anytime • Secure payment by Stripe
                </p>
              </div>
            </div>

            <div className="glass p-6 rounded-2xl border-white/5 bg-slate-900/40">
              <h4 className="text-sm font-bold text-white mb-4">Quick Insights</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-medium">Top Platform</span>
                  <span className="text-indigo-400 font-black tracking-widest uppercase">LinkedIn</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-medium">Avg Engagement</span>
                  <span className="text-indigo-400 font-black tracking-widest uppercase">High</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-medium">Last 7 Days</span>
                  <span className="text-rose-400 font-black tracking-widest uppercase">Trending Up</span>
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}
