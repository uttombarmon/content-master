"use client";

import { useState } from "react";
import { 
  Clock, 
  ExternalLink, 
  Trash2, 
  Plus, 
  Edit3,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Calendar,
  Layers,
  Search
} from "lucide-react";
import Link from "next/link";
import { Modal } from "@/components/Modal";
import { deletePostAction, updatePostAction } from "@/app/actions/dashboard";

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
}

export function DashboardContent({ initialPosts }: DashboardContentProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [modalType, setModalType] = useState<"view" | "edit" | "delete" | null>(null);
  const [isPending, setIsPending] = useState(false);

  // Edit form state
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");

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
      setPosts(posts.filter(p => p.id !== selectedPost.id));
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
      await updatePostAction(selectedPost.id, { title: editTitle, body: editBody });
      setPosts(posts.map(p => p.id === selectedPost.id ? { ...p, title: editTitle, body: editBody } : p));
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
              <h3 className="text-xl font-bold text-white mb-2">No posts yet</h3>
              <p className="text-slate-400 mb-6">Generate your first SEO-optimized social post to see it here.</p>
              <Link
                href="/generate"
                className="inline-flex items-center gap-2 rounded-xl bg-white/5 px-6 py-3 text-sm font-bold text-white border border-white/10 hover:bg-white/10 transition-all font-mono uppercase tracking-widest"
              >
                Initialize Generation
              </Link>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead className="text-[10px] font-black uppercase tracking-widest text-slate-500 bg-white/2">
                <tr>
                  <th className="px-6 py-4">Content Topic & Platform</th>
                  <th className="px-6 py-4 text-center">SEO Score</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {posts.map((post) => (
                  <tr key={post.id} className="group hover:bg-white/2 transition-colors">
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
                          <p className="text-xs text-slate-500 uppercase tracking-wider">{post.platform}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col items-center gap-1.5">
                        <span className="text-sm font-black text-emerald-400">{post.seoScore}%</span>
                        <div className="h-1 w-12 bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-emerald-500" 
                            style={{ width: `${post.seoScore}%` }} 
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-500 font-medium">
                      {new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => openModal(post, "edit")}
                          className="h-9 w-9 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all border border-white/5"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => openModal(post, "delete")}
                          className="h-9 w-9 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all border border-white/5"
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

      {/* View Modal */}
      <Modal 
        isOpen={modalType === "view"} 
        onClose={closeModal} 
        title="View Generation"
      >
        {selectedPost && (
          <div className="space-y-6">
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 block">Optimized Title</label>
              <div className="text-lg font-bold text-white bg-white/5 p-4 rounded-xl border border-white/10 italic">
                {selectedPost.title}
              </div>
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 block">Post Content</label>
              <div className="text-slate-300 leading-relaxed whitespace-pre-line bg-slate-950/50 p-6 rounded-xl border border-white/5">
                {selectedPost.body}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 block">Keywords</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedPost.keywords?.map((kw, i) => (
                      <span key={i} className="px-2 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded text-[10px] font-bold uppercase tracking-wider">
                        {kw}
                      </span>
                    ))}
                  </div>
               </div>
               <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 block">Hashtags</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedPost.hashtags?.map((ht, i) => (
                      <span key={i} className="px-2 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded text-[10px] font-bold">
                        #{ht}
                      </span>
                    ))}
                  </div>
               </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Modal */}
      <Modal 
        isOpen={modalType === "edit"} 
        onClose={closeModal} 
        title="Edit Generation"
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-indigo-300">Title</label>
            <input 
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-950/50 p-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-indigo-300">Body Content</label>
            <textarea 
              value={editBody}
              onChange={(e) => setEditBody(e.target.value)}
              rows={10}
              className="w-full rounded-xl border border-white/10 bg-slate-950/50 p-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none"
            />
          </div>
          <button 
            onClick={handleUpdate}
            disabled={isPending}
            className="w-full rounded-xl bg-indigo-600 py-4 font-bold text-white shadow-lg shadow-indigo-600/20 transition-all hover:bg-indigo-500 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            {isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal 
        isOpen={modalType === "delete"} 
        onClose={closeModal} 
        title="Delete Confirmation"
        width="max-w-md"
      >
        <div className="text-center space-y-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-500/10 border border-rose-500/20">
            <AlertCircle className="h-8 w-8 text-rose-500" />
          </div>
          <div>
            <h4 className="text-xl font-bold text-white mb-2">Delete this post?</h4>
            <p className="text-slate-400 text-sm">
              This action cannot be undone. You will lose this generated content forever.
            </p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={closeModal}
              className="flex-1 rounded-xl bg-white/5 py-3 font-bold text-white transition-all hover:bg-white/10"
            >
              Cancel
            </button>
            <button 
              onClick={handleDelete}
              disabled={isPending}
              className="flex-1 rounded-xl bg-rose-600 py-3 font-bold text-white shadow-lg shadow-rose-600/20 transition-all hover:bg-rose-500 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              {isPending ? "Deleting..." : "Delete Permanently"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
