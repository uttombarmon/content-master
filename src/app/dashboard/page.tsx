import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { socialContent } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import Link from "next/link";
import { 
  BarChart3, 
  Clock, 
  MoreVertical, 
  ExternalLink, 
  Trash2, 
  Plus, 
  Layers,
  Search
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

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
              Content Dashboard
            </h1>
            <p className="text-slate-400">
              Manage your AI-generated social media strategy.
            </p>
          </div>
          <Link
            href="/generate"
            className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-indigo-500 hover:scale-[1.02] shadow-lg shadow-indigo-500/20"
          >
            <Plus className="h-4 w-4" />
            New Post
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-8">
          <div className="glass p-6 rounded-2xl border-white/5 bg-slate-900/40">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                <Layers className="h-6 w-6 text-indigo-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Total Posts</p>
                <p className="text-2xl font-bold text-white">{posts.length}</p>
              </div>
            </div>
          </div>
          <div className="glass p-6 rounded-2xl border-white/5 bg-slate-900/40">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-rose-500/10 flex items-center justify-center">
                <Search className="h-6 w-6 text-rose-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">SEO Optimized</p>
                <p className="text-2xl font-bold text-white">100%</p>
              </div>
            </div>
          </div>
          <div className="glass p-6 rounded-2xl border-white/5 bg-slate-900/40">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Published</p>
                <p className="text-2xl font-bold text-white">0</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content List */}
        <div className="glass rounded-2xl border-white/5 bg-slate-900/20 overflow-hidden">
          <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Clock className="h-5 w-5 text-indigo-400" />
              Recent Generations
            </h2>
          </div>

          <div className="overflow-x-auto">
            {posts.length === 0 ? (
              <div className="p-20 text-center">
                <div className="mx-auto h-20 w-20 rounded-full bg-slate-900 flex items-center justify-center mb-6">
                  <Plus className="h-10 w-10 text-slate-600" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No posts yet</h3>
                <p className="text-slate-400 mb-6">Generate your first SEO-optimized social post to see it here.</p>
                <Link
                  href="/generate"
                  className="inline-flex items-center gap-2 rounded-xl bg-white/5 px-6 py-3 text-sm font-bold text-white border border-white/10 hover:bg-white/10 transition-all"
                >
                  Start Generating
                </Link>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead className="text-sm text-slate-500 bg-white/1">
                  <tr>
                    <th className="px-6 py-4 font-medium uppercase tracking-wider">Topic / Platform</th>
                    <th className="px-6 py-4 font-medium uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 font-medium uppercase tracking-wider">Generated On</th>
                    <th className="px-6 py-4 font-medium uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {posts.map((post) => (
                    <tr key={post.id} className="group hover:bg-white/2 transition-colors">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-xs font-bold text-indigo-400 border border-indigo-500/20 uppercase">
                            {post.platform.substring(0, 2)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white line-clamp-1">{post.title}</p>
                            <p className="text-xs text-slate-500 uppercase">{post.platform}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-2.5 py-1 text-xs font-bold text-indigo-400 border border-indigo-500/20">
                          <div className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                          {post.status}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-sm text-slate-400">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="h-9 w-9 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                            <ExternalLink className="h-4 w-4" />
                          </button>
                          <button className="h-9 w-9 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
