"use client";

import Link from "next/link";
import { Search, PenTool, LayoutDashboard, User, LogOut } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export function Header() {
  const session = authClient.useSession();
  const isPending = session.isPending;
  const sessionData = session.data;
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-slate-950/50 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500 to-rose-500 glow">
            <Search className="h-6 w-6 text-white" />
          </div>
          <Link href="/" className="text-xl font-bold tracking-tight gradient-text">
            ContentMaster
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
          <Link href="/" className="transition-colors hover:text-indigo-400">
            Home
          </Link>
          <Link href="/generate" className="transition-colors hover:text-indigo-400">
            Generate
          </Link>
          <Link href="/dashboard" className="transition-colors hover:text-indigo-400">
            Dashboard
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          {isPending ? (
            <div className="h-8 w-24 animate-pulse rounded-lg bg-white/5" />
          ) : sessionData ? (
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
                 <div className="h-8 w-8 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                    <User className="h-4 w-4 text-indigo-400" />
                 </div>
                 <span className="hidden sm:inline">{sessionData?.user?.name}</span>
               </div>
               <button
                 onClick={handleLogout}
                 className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-sm font-medium text-slate-400 hover:bg-white/10 hover:text-white transition-all"
               >
                 <LogOut className="h-4 w-4" />
                 <span className="hidden sm:inline">Logout</span>
               </button>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 text-sm font-medium border border-white/10 transition-all hover:bg-white/10 hover:border-white/20"
              >
                <User className="h-4 w-4" />
                Login
              </Link>
              <Link
                href="/signup"
                className="hidden sm:flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-indigo-500/20 transition-all hover:bg-indigo-500 hover:scale-[1.02]"
              >
                <PenTool className="h-4 w-4" />
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
