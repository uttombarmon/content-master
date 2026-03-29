"use client";

import { useState, useEffect } from "react";
import {
  Clock,
  Trash2,
  Plus,
  Edit3,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Calendar,
  Layers,
  Search,
  Zap,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { Modal } from "@/components/Modal";
import { deletePostAction, updatePostAction } from "@/app/actions/dashboard";
import { createCheckoutSession, createCustomerPortalSession } from "@/app/actions/stripe";
import { useRouter, useSearchParams } from "next/navigation";
import { CreditIndicator } from "@/components/CreditIndicator";

interface Post {
  id: string;
  userId: string;
  platform: string;
  title: string | null;
  body: string;
  keywords: string[] | null;
  hashtags: string[] | null;
  status: string | null;
  seoScore: number | null;
  metadata: any;
  createdAt: Date;
  updatedAt: Date;
}

interface DashboardContentProps {
  initialPosts: Post[];
  userData: {
    id: string;
    name: string;
    email: string;
    credits: number;
    plan: string;
  };
}

export function DashboardContent({
  initialPosts,
  userData,
}: DashboardContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [modalType, setModalType] = useState<"view" | "edit" | "delete" | null>(
    null,
  );
  const [isPending, setIsPending] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [isManaging, setIsManaging] = useState(false);
  const [toastMessage, setToastMessage] = useState<{title: string, type: 'success' | 'error' | 'info'} | null>(null);

  // Edit form state
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");

  useEffect(() => {
    const success = searchParams.get("success");
    const canceled = searchParams.get("canceled");
    const simulated = searchParams.get("simulated");
    const simulatedCancel = searchParams.get("simulated_cancel");

    if (success) {
      setToastMessage({
        title: simulated ? "Simulated Upgrade Successful!" : "Upgrade Successful! Welcome to Pro.",
        type: "success"
      });
      router.replace("/dashboard");
    } else if (canceled) {
      setToastMessage({
        title: simulatedCancel ? "Simulated Cancellation Successful!" : "Checkout canceled.",
        type: "info"
      });
      router.replace("/dashboard");
    }

    if (success || canceled) {
      setTimeout(() => setToastMessage(null), 5000);
    }
  }, [searchParams, router]);

  const handleUpgrade = async () => {
    setIsUpgrading(true);
    try {
      const res = await createCheckoutSession();
      if (res?.url) {
        window.location.href = res.url;
      }
    } catch (e: any) {
      console.error(e);
      alert(e.message || "Failed to start checkout.");
    } finally {
      setIsUpgrading(false);
    }
  };

  const handleManageSubscription = async () => {
    setIsManaging(true);
    try {
      const res = await createCustomerPortalSession();
      if (res?.url) {
        window.location.href = res.url;
      }
    } catch (e: any) {
      console.error(e);
      alert(e.message || "Failed to open customer portal.");
    } finally {
      setIsManaging(false);
    }
  };

  const openModal = (post: Post, type: "view" | "edit" | "delete") => {
    setSelectedPost(post);
    setModalType(type);
    if (type === "edit") {
      setEditTitle(post.title || "");
      setEditBody(post.body || "");
    }
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedPost(null);
  };

  const handleDelete = async () => {
    if (!selectedPost) return;
    setIsPending(true);
    try {
      await deletePostAction(selectedPost.id);
      setPosts(posts.filter((p) => p.id !== selectedPost.id));
      closeModal();
    } catch (e) {
      console.error(e);
      alert("Failed to delete post.");
    } finally {
      setIsPending(false);
    }
  };

  const handleUpdate = async () => {
    if (!selectedPost) return;
    setIsPending(true);
    try {
      await updatePostAction(selectedPost.id, {
        title: editTitle,
        body: editBody,
      });
      setPosts(
        posts.map((p) =>
          p.id === selectedPost.id
            ? { ...p, title: editTitle, body: editBody }
            : p,
        ),
      );
      closeModal();
    } catch (e) {
      console.error(e);
      alert("Failed to update post.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <>
      {toastMessage && (
        <div className={`fixed top-24 right-4 z-50 px-6 py-4 rounded-xl shadow-2xl border font-bold text-sm backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-300 ${
          toastMessage.type === 'success' 
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
            : toastMessage.type === 'error'
            ? 'bg-rose-500/10 border-rose-500/20 text-rose-400'
            : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'
        }`}>
          {toastMessage.title}
        </div>
      )}
      <div className="grid gap-8 lg:grid-cols-12 mb-12">
        {/* Main Stats Area */}
        <div className="lg:col-span-8 space-y-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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
                  <TrendingUp className="h-6 w-6 text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Reach Trend
                  </p>
                  <p className="text-3xl font-black text-white">+14%</p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass rounded-2xl border-white/5 bg-slate-900/20 overflow-hidden shadow-2xl">
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
                  <h3 className="text-xl font-bold text-white mb-2">
                    No posts yet
                  </h3>
                  <p className="text-slate-400 mb-6">
                    Generate your first SEO-optimized social post.
                  </p>
                  <Link href="/generate" className="button-premium">
                    Initialize Generation
                  </Link>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead className="text-[10px] font-black uppercase tracking-widest text-slate-500 bg-white/2">
                    <tr>
                      <th className="px-6 py-4">Topic & Platform</th>
                      <th className="px-6 py-4 text-center">SEO Score</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {posts.map((post) => (
                      <tr
                        key={post.id}
                        className="group hover:bg-white/2 transition-colors"
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 shrink-0 rounded-lg bg-indigo-500/10 flex items-center justify-center text-[10px] font-black text-indigo-400 border border-indigo-500/10 uppercase tracking-tighter">
                              {post.platform.substring(0, 3)}
                            </div>
                            <div className="min-w-0">
                              <button
                                onClick={() => openModal(post, "view")}
                                className="text-sm font-bold text-white truncate max-w-[200px] hover:text-indigo-400 transition-colors text-left"
                              >
                                {post.title || "Untitled Generation"}
                              </button>
                              <p className="text-xs text-slate-500 uppercase tracking-wider">
                                {post.platform}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex flex-col items-center gap-1.5">
                            <span className="text-sm font-black text-emerald-400">
                              {post.seoScore}%
                            </span>
                            <div className="h-1 w-12 bg-slate-800 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-emerald-500"
                                style={{ width: `${post.seoScore}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-sm text-slate-500 font-medium font-mono text-center">
                          {new Date(post.createdAt).toLocaleDateString(
                            undefined,
                            { month: "short", day: "numeric" },
                          )}
                        </td>
                        <td className="px-6 py-5 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => openModal(post, "edit")}
                              className="icon-button"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => openModal(post, "delete")}
                              className="icon-button-danger"
                            >
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

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass p-8 rounded-2xl border-indigo-500/20 bg-linear-to-br from-indigo-500/8 to-rose-500/8 shadow-2xl relative overflow-hidden">
            <Sparkles className="absolute -top-4 -right-4 h-24 w-24 text-indigo-500/5 rotate-12" />
            <CreditIndicator credits={userData.credits} plan={userData.plan} />

            <div className="mt-8 space-y-4">
              <h4 className="flex items-center gap-2 text-sm font-black text-white uppercase tracking-wider">
                <Zap className="h-4 w-4 text-indigo-400" />
                Plan Benefits
              </h4>
              <div className="space-y-3">
                {userData.plan === "free"
                  ? [
                      "10 AI Generations / day",
                      "Standard SEO Audit",
                      "Social Post History",
                      "Basic Templates",
                    ].map((feat, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 text-sm text-slate-400 font-medium"
                      >
                        <CheckCircle2 className="h-4 w-4 text-indigo-400 shrink-0" />
                        {feat}
                      </div>
                    ))
                  : [
                      "100 AI Generations / day",
                      "Deep SEO Audit",
                      "Priority Processing",
                      "Custom Brand Identity",
                    ].map((feat, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 text-sm text-slate-400 font-medium"
                      >
                        <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0" />
                        {feat}
                      </div>
                    ))}
              </div>

              {userData.plan === "free" ? (
                <button
                  onClick={handleUpgrade}
                  disabled={isUpgrading}
                  className="w-full mt-6 rounded-xl bg-linear-to-r from-indigo-600 to-rose-600 py-4 font-black text-white hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-indigo-600/20 uppercase tracking-widest text-xs flex items-center justify-center gap-2"
                >
                  {isUpgrading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Zap className="h-4 w-4 fill-white" />
                  )}
                  {isUpgrading ? "Redirecting..." : "Upgrade to Pro — $29/mo"}
                </button>
              ) : (
                <button
                  onClick={handleManageSubscription}
                  disabled={isManaging}
                  className="w-full mt-6 rounded-xl bg-white/5 border border-white/10 py-4 font-black text-white hover:bg-white/10 active:scale-[0.98] transition-all shadow-xl uppercase tracking-widest text-xs flex items-center justify-center gap-2"
                >
                  {isManaging && <Loader2 className="h-4 w-4 animate-spin" />}
                  Manage Subscription
                </button>
              )}
              <p className="text-center text-[10px] text-slate-500 font-bold uppercase tracking-tighter">
                {userData.plan === "free"
                  ? "Cancel anytime • Secure payment by Stripe"
                  : "Manage billing via Stripe Customer Portal"}
              </p>
            </div>
          </div>

          <div className="glass p-6 rounded-2xl border-white/5 bg-slate-900/40">
            <h4 className="text-sm font-bold text-white mb-4">
              Quick Insights
            </h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-medium uppercase tracking-tighter">
                  Top Platform
                </span>
                <span className="text-indigo-400 font-black tracking-widest">
                  LinkedIn
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-medium uppercase tracking-tighter">
                  Last 7 Days
                </span>
                <span className="text-rose-400 font-black tracking-widest">
                  +24% Growth
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <Modal
        isOpen={modalType === "view"}
        onClose={closeModal}
        title="View Post Details"
      >
        {selectedPost && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-slate-950 border border-white/10">
              <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">
                Title
              </h4>
              <p className="text-lg font-bold text-white leading-snug">
                {selectedPost.title}
              </p>
            </div>
            <div className="p-6 rounded-xl bg-slate-950 border border-white/10">
              <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">
                Generated Content
              </h4>
              <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                {selectedPost.body}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">
                  Keywords
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedPost.keywords?.map((kw, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded text-[10px] uppercase font-bold"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">
                  Hashtags
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedPost.hashtags?.map((ht, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded text-[10px] font-bold"
                    >
                      #{ht}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={modalType === "edit"}
        onClose={closeModal}
        title="Edit Content"
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase">
              Title
            </label>
            <input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="input-premium w-full bg-slate-950"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase">
              Body Content
            </label>
            <textarea
              value={editBody}
              onChange={(e) => setEditBody(e.target.value)}
              rows={8}
              className="input-premium w-full bg-slate-950 resize-none"
            />
          </div>
          <button
            onClick={handleUpdate}
            disabled={isPending}
            className="button-premium w-full flex items-center justify-center gap-2 py-4"
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Save Changes
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={modalType === "delete"}
        onClose={closeModal}
        title="Confirm Deletion"
        width="max-w-md"
      >
        <div className="text-center space-y-6 py-4">
          <div className="mx-auto h-16 w-16 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-rose-500" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xl font-bold text-white">
              Permanently delete post?
            </h4>
            <p className="text-slate-400 text-sm">
              This action is irreversible and the content will be lost.
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={closeModal}
              className="flex-1 px-6 py-3 rounded-xl bg-white/5 text-white font-bold hover:bg-white/10 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={isPending}
              className="flex-1 px-6 py-3 rounded-xl bg-rose-600 text-white font-bold hover:bg-rose-500 transition-all shadow-lg shadow-rose-600/20 flex items-center justify-center gap-2"
            >
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
