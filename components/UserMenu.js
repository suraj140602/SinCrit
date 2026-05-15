"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";

// Simple Lucide-style SVG Icons
const Icon = ({ path }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {path.split("|").map((d, i) => <path key={i} d={d} />)}
  </svg>
);

export default function UserMenu() {
  const router = useRouter();
  const { user, profile, signOut, isManager } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef();

  // Close dropdown if clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // If the AuthContext is still loading, show a little spinner
  if (user === undefined) return <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-blue-500 animate-spin" />;

  // If no user is logged in, show a Sign In button
  if (!user) {
    return (
      <button onClick={() => router.push("/auth")}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)]">
        Sign In
      </button>
    );
  }

  // Get user initials for the fallback avatar
  const initials = profile?.full_name 
    ? profile.full_name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) 
    : "U";

  return (
    <div className="relative" ref={menuRef}>
      {/* Avatar Button */}
      <button onClick={() => setIsOpen(!isOpen)} 
        className="flex items-center gap-2 hover:opacity-80 transition-opacity focus:outline-none">
        {profile?.avatar_url ? (
          <img src={profile.avatar_url} alt="User" className="w-9 h-9 rounded-full object-cover ring-2 ring-white/10" />
        ) : (
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-xs font-bold ring-2 ring-white/10">
            {initials}
          </div>
        )}
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }} 
            animate={{ opacity: 1, y: 0, scale: 1 }} 
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-3 w-56 bg-[#0d1017] border border-white/10 rounded-2xl shadow-2xl py-2 z-50 origin-top-right"
          >
            <div className="px-4 py-2 border-b border-white/5 mb-2">
              <p className="text-sm font-bold text-white truncate">{profile?.full_name || "AppForge User"}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
              <div className="flex gap-2 mt-2">
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest ${isManager ? 'bg-purple-500/10 text-purple-400' : 'bg-blue-500/10 text-blue-400'}`}>
                  {profile?.role || "Developer"}
                </span>
                {profile?.is_premium && (
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest bg-amber-500/10 text-amber-400">
                    Pro
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col px-2">
              <button onClick={() => { router.push("/dashboard"); setIsOpen(false); }} className="flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors text-left w-full">
                <Icon path="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z|M9 22V12h6v10" /> Dashboard
              </button>
              <button onClick={() => { router.push("/builder"); setIsOpen(false); }} className="flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors text-left w-full">
                <Icon path="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0017 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 00-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06z" /> Builder Canvas
              </button>
              <button onClick={() => { router.push("/account"); setIsOpen(false); }} className="flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors text-left w-full">
                <Icon path="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2|M12 11a4 4 0 100-8 4 4 0 000 8z" /> Account Settings
              </button>
            </div>

            <div className="h-px bg-white/5 my-2 mx-2" />

            <div className="px-2">
              <button onClick={async () => { await signOut(); router.push("/auth"); setIsOpen(false); }} className="flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors text-left w-full">
                <Icon path="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4|M16 17l5-5-5-5|M21 12H9" /> Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}