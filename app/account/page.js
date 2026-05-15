"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../../utils/supabase";

// ── Icon primitive ──────────────────────────────────────────
const I = ({ path, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {path.split("|").map((d, i) => <path key={i} d={d} />)}
  </svg>
);

const TABS = [
  { id: "profile",  label: "Profile",  icon: "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2|M12 11a4 4 0 100-8 4 4 0 000 8z" },
  { id: "billing",  label: "Billing",  icon: "M20 12V22H4V12|M22 7H2v5h20V7z|M12 22V7|M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z|M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z" },
  { id: "security", label: "Security", icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" },
  { id: "danger",   label: "Danger",   icon: "M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z|M12 9v4|M12 17h.01" },
];

const Field = ({ label, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">{label}</label>
    {children}
  </div>
);

const Input = ({ value, onChange, placeholder, type = "text", disabled }) => (
  <input type={type} value={value} onChange={e => onChange?.(e.target.value)} placeholder={placeholder}
    disabled={disabled}
    className="w-full bg-[#0e1117] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-600 outline-none focus:border-blue-500/50 transition-all disabled:opacity-40 disabled:cursor-not-allowed" />
);

const SaveBtn = ({ loading, onClick, label = "Save Changes" }) => (
  <button onClick={onClick} disabled={loading}
    className="px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold rounded-xl text-sm transition-all shadow-[0_0_16px_rgba(59,130,246,0.25)]">
    {loading ? "Saving..." : label}
  </button>
);

export default function AccountPage() {
  const router = useRouter();
  const [tab, setTab]         = useState("profile");
  const [user, setUser]       = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [msg, setMsg]         = useState({ text: "", type: "" }); // type: success | error

  // Profile fields
  const [fullName, setFullName] = useState("");
  const [bio, setBio]           = useState("");
  const [website, setWebsite]   = useState("");
  const [role, setRole]         = useState("developer");
  const [avatarUrl, setAvatarUrl] = useState("");

  // Security
  const [oldPass, setOldPass]  = useState("");
  const [newPass, setNewPass]  = useState("");
  const [confPass, setConfPass] = useState("");

  const fileRef = useRef();

  // ── Boot ──
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { router.push("/auth"); return; }
      setUser(session.user);

      const { data } = await supabase.from("profiles").select("*").eq("id", session.user.id).single();
      if (data) {
        setProfile(data);
        setFullName(data.full_name || "");
        setBio(data.bio || "");
        setWebsite(data.website || "");
        setRole(data.role || "developer");
        setAvatarUrl(data.avatar_url || "");
      }
      setLoading(false);
    });
  }, []);

  const flash = (text, type = "success") => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: "", type: "" }), 4000);
  };

  // ── Save profile ──
  const saveProfile = async () => {
    setSaving(true);
    const { error } = await supabase.from("profiles").update({
      full_name: fullName, bio, website, role, avatar_url: avatarUrl,
    }).eq("id", user.id);
    setSaving(false);
    if (error) flash(error.message, "error");
    else flash("Profile updated successfully!");
  };

  // ── Avatar upload ──
  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSaving(true);
    const path = `avatars/${user.id}/${Date.now()}_${file.name}`;
    const { error: upErr } = await supabase.storage.from("apk-builds").upload(path, file);
    if (upErr) { flash(upErr.message, "error"); setSaving(false); return; }
    const { data: { publicUrl } } = supabase.storage.from("apk-builds").getPublicUrl(path);
    setAvatarUrl(publicUrl);
    await supabase.from("profiles").update({ avatar_url: publicUrl }).eq("id", user.id);
    setSaving(false);
    flash("Avatar updated!");
  };

  // ── Change password ──
  const changePassword = async () => {
    if (newPass !== confPass) { flash("Passwords don't match", "error"); return; }
    if (newPass.length < 8)   { flash("Min 8 characters", "error"); return; }
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password: newPass });
    setSaving(false);
    if (error) flash(error.message, "error");
    else { flash("Password changed!"); setOldPass(""); setNewPass(""); setConfPass(""); }
  };

  // ── Upgrade / Billing ──
  const handleUpgrade = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      });
      const { url, alreadyPremium } = await res.json();
      if (alreadyPremium) { flash("You're already on Pro! 🎉"); setSaving(false); return; }
      if (url) window.location.href = url;
    } catch { flash("Checkout failed. Try again.", "error"); }
    setSaving(false);
  };

  // ── Delete account ──
  const handleDeleteAccount = async () => {
    const confirmed = prompt('Type "DELETE" to permanently delete your account:');
    if (confirmed !== "DELETE") return;
    await supabase.auth.signOut();
    router.push("/auth");
  };

  if (loading) return (
    <div className="min-h-screen bg-[#050609] flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const initials = fullName ? fullName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "??";

  return (
    <div className="min-h-screen bg-[#050609] text-white">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[#050609]/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 text-gray-400 hover:text-white text-sm font-medium transition-colors">
            <I path="M19 12H5|M12 19l-7-7 7-7" size={16} />
            Dashboard
          </button>
          <span className="text-white/20">|</span>
          <h1 className="text-sm font-bold text-white">Account Settings</h1>
        </div>
        <div className="flex items-center gap-3">
          {profile?.is_premium && (
            <span className="text-[10px] font-bold px-3 py-1 bg-amber-500/15 border border-amber-500/30 text-amber-400 rounded-full uppercase tracking-widest">
              Pro
            </span>
          )}
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold">
            {initials}
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-10 flex gap-8">
        
        {/* Sidebar nav */}
        <aside className="w-52 shrink-0">
          <nav className="flex flex-col gap-1">
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left ${
                  tab === t.id
                    ? t.id === "danger"
                      ? "bg-red-500/10 text-red-400 border border-red-500/20"
                      : "bg-blue-600/10 text-blue-400 border border-blue-500/20"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}>
                <I path={t.icon} size={15} />
                {t.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">
          
          {/* Flash message */}
          <AnimatePresence>
            {msg.text && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className={`mb-5 px-4 py-3 rounded-xl text-sm font-medium ${
                  msg.type === "error"
                    ? "bg-red-500/10 border border-red-500/20 text-red-400"
                    : "bg-green-500/10 border border-green-500/20 text-green-400"
                }`}>
                {msg.text}
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── PROFILE ── */}
          {tab === "profile" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6">
              <div>
                <h2 className="text-lg font-bold text-white mb-1">Profile Information</h2>
                <p className="text-sm text-gray-500">Update your personal details and avatar.</p>
              </div>

              {/* Avatar */}
              <div className="flex items-center gap-5">
                <div className="relative">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="avatar" className="w-20 h-20 rounded-full object-cover ring-2 ring-white/10" />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-2xl font-bold ring-2 ring-white/10">
                      {initials}
                    </div>
                  )}
                  <button onClick={() => fileRef.current?.click()}
                    className="absolute -bottom-1 -right-1 w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-500 transition-colors">
                    <I path="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" size={12} />
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                </div>
                <div>
                  <div className="text-white font-bold text-lg">{fullName || "Unnamed User"}</div>
                  <div className="text-gray-500 text-sm">{user?.email}</div>
                  <div className={`text-[11px] font-bold mt-1 uppercase tracking-widest ${
                    role === "manager" ? "text-purple-400" : "text-blue-400"
                  }`}>{role}</div>
                </div>
              </div>

              {/* Fields */}
              <div className="bg-[#0d1017] border border-white/8 rounded-2xl p-6 flex flex-col gap-5">
                <div className="grid grid-cols-2 gap-5">
                  <Field label="Full Name">
                    <Input value={fullName} onChange={setFullName} placeholder="Alex Rivera" />
                  </Field>
                  <Field label="Email">
                    <Input value={user?.email || ""} disabled />
                  </Field>
                </div>
                <Field label="Bio">
                  <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3}
                    placeholder="Tell your team about yourself..."
                    className="w-full bg-[#0e1117] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-600 outline-none focus:border-blue-500/50 transition-all resize-none" />
                </Field>
                <Field label="Website">
                  <Input value={website} onChange={setWebsite} placeholder="https://yoursite.com" />
                </Field>
                <Field label="Role">
                  <div className="flex gap-3">
                    {["developer", "manager"].map(r => (
                      <button key={r} onClick={() => setRole(r)} type="button"
                        className={`flex-1 py-3 rounded-xl border text-sm font-medium capitalize transition-all ${
                          role === r
                            ? "border-blue-500 bg-blue-500/10 text-white"
                            : "border-white/10 text-gray-400 hover:border-white/20 hover:text-white"
                        }`}>
                        {r === "developer" ? "💻" : "📊"} {r}
                      </button>
                    ))}
                  </div>
                </Field>
                <div className="flex justify-end">
                  <SaveBtn loading={saving} onClick={saveProfile} />
                </div>
              </div>
            </motion.div>
          )}

          {/* ── BILLING ── */}
          {tab === "billing" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6">
              <div>
                <h2 className="text-lg font-bold text-white mb-1">Billing & Subscription</h2>
                <p className="text-sm text-gray-500">Manage your plan and payment details.</p>
              </div>

              {profile?.is_premium ? (
                <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/25 rounded-2xl p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-sm font-bold text-amber-400 uppercase tracking-widest mb-1">Active Plan</div>
                      <div className="text-2xl font-bold text-white mb-1">AppForge Pro</div>
                      <div className="text-gray-400 text-sm">$19 / month · Renews automatically</div>
                    </div>
                    <div className="px-4 py-2 bg-amber-500/15 border border-amber-500/30 text-amber-400 font-bold text-sm rounded-xl">
                      Active ✓
                    </div>
                  </div>
                  <div className="mt-5 pt-5 border-t border-white/5 grid grid-cols-3 gap-4">
                    {["Unlimited APK Builds", "Flutter Code Export", "AI Co-Pilot", "Cloud Compiler", "Priority Support", "All Templates"].map(f => (
                      <div key={f} className="flex items-center gap-2 text-sm text-gray-300">
                        <div className="w-4 h-4 bg-amber-500/20 rounded-full flex items-center justify-center shrink-0">
                          <I path="M20 6L9 17l-5-5" size={10} className="text-amber-400" />
                        </div>
                        {f}
                      </div>
                    ))}
                  </div>
                  <button className="mt-5 text-sm text-red-400 hover:text-red-300 transition-colors">
                    Cancel subscription →
                  </button>
                </div>
              ) : (
                <div className="bg-[#0d1017] border border-white/8 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="px-3 py-1 bg-gray-500/15 border border-gray-500/20 text-gray-400 font-bold text-[11px] uppercase tracking-widest rounded-full">
                      Free Tier
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Upgrade to Pro</h3>
                  <p className="text-gray-400 text-sm mb-5 leading-relaxed">
                    Unlock unlimited builds, Flutter export, the AI Co-Pilot, and every premium template.
                  </p>
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {["Unlimited APK Builds", "Flutter Export (.zip)", "AI Design Co-Pilot", "Premium Templates", "Cloud Compiler", "Priority Support"].map(f => (
                      <div key={f} className="flex items-center gap-2 text-sm text-gray-300">
                        <div className="w-4 h-4 bg-blue-500/20 rounded-full flex items-center justify-center shrink-0">
                          <I path="M20 6L9 17l-5-5" size={10} />
                        </div>
                        {f}
                      </div>
                    ))}
                  </div>
                  <button onClick={handleUpgrade} disabled={saving}
                    className="px-8 py-3.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] text-sm">
                    {saving ? "Redirecting..." : "Upgrade for $19/month →"}
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* ── SECURITY ── */}
          {tab === "security" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6">
              <div>
                <h2 className="text-lg font-bold text-white mb-1">Security</h2>
                <p className="text-sm text-gray-500">Manage your password and account access.</p>
              </div>

              <div className="bg-[#0d1017] border border-white/8 rounded-2xl p-6 flex flex-col gap-5">
                <h3 className="text-sm font-bold text-white">Change Password</h3>
                <Field label="New Password">
                  <Input type="password" value={newPass} onChange={setNewPass} placeholder="Min 8 characters" />
                </Field>
                <Field label="Confirm New Password">
                  <Input type="password" value={confPass} onChange={setConfPass} placeholder="Repeat password" />
                </Field>
                <div className="flex justify-end">
                  <SaveBtn loading={saving} onClick={changePassword} label="Update Password" />
                </div>
              </div>

              <div className="bg-[#0d1017] border border-white/8 rounded-2xl p-6">
                <h3 className="text-sm font-bold text-white mb-3">Active Sessions</h3>
                <div className="flex items-center justify-between p-3 bg-white/3 rounded-xl">
                  <div>
                    <div className="text-sm text-white font-medium">Current session</div>
                    <div className="text-xs text-gray-500">{user?.email} · Right now</div>
                  </div>
                  <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                </div>
              </div>
            </motion.div>
          )}

          {/* ── DANGER ── */}
          {tab === "danger" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6">
              <div>
                <h2 className="text-lg font-bold text-red-400 mb-1">Danger Zone</h2>
                <p className="text-sm text-gray-500">Irreversible account actions.</p>
              </div>

              <div className="border border-red-500/20 rounded-2xl p-6 bg-red-500/5 flex flex-col gap-4">
                <div>
                  <h3 className="text-sm font-bold text-white mb-1">Delete Account</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                </div>
                <button onClick={handleDeleteAccount}
                  className="w-fit px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-sm rounded-xl transition-all">
                  Delete Account
                </button>
              </div>

              <div className="border border-white/8 rounded-2xl p-6 bg-[#0d1017]">
                <h3 className="text-sm font-bold text-white mb-1">Sign Out Everywhere</h3>
                <p className="text-sm text-gray-500 mb-4">Sign out of all devices and sessions.</p>
                <button onClick={async () => { await supabase.auth.signOut(); router.push("/auth"); }}
                  className="px-5 py-2.5 border border-white/10 text-gray-300 font-bold text-sm rounded-xl hover:bg-white/5 transition-all">
                  Sign Out All Sessions
                </button>
              </div>
            </motion.div>
          )}

        </main>
      </div>
    </div>
  );
}