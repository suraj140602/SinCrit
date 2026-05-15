"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../../utils/supabase";

const ICONS = {
  eye:  "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 100 6 3 3 0 000-6z",
  eyeOff: "M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24 M1 1l22 22",
  mail: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6",
  lock: "M19 11H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2z M7 11V7a5 5 0 0110 0v4",
  user: "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2 M12 11a4 4 0 100-8 4 4 0 000 8z",
  zap:  "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
  check: "M20 6L9 17l-5-5",
};

const Icon = ({ d, size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {d.split(" M").map((path, i) => <path key={i} d={i === 0 ? path : "M" + path} />)}
  </svg>
);

const InputField = ({ label, type = "text", value, onChange, placeholder, icon, required }) => {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{label}</label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500">
            <Icon d={icon} size={16} />
          </div>
        )}
        <input
          type={isPassword ? (show ? "text" : "password") : type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className="w-full bg-[#0e1117] border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-gray-600 outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/20 transition-all"
          style={{ paddingLeft: icon ? "2.75rem" : undefined }}
        />
        {isPassword && (
          <button type="button" onClick={() => setShow(!show)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
            <Icon d={show ? ICONS.eyeOff : ICONS.eye} size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState("login"); // login | signup | forgot
  const [step, setStep] = useState(1);       // signup step: 1=details, 2=role
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState("");

  // Form state
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole]         = useState("developer"); // developer | manager

  // Check if already logged in
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.push("/dashboard");
    });
  }, []);

  const reset = () => { setError(""); setSuccess(""); };

  // ── LOGIN ──
  const handleLogin = async (e) => {
    e.preventDefault(); reset(); setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── SIGNUP step 1 → 2 ──
  const handleSignupStep1 = (e) => {
    e.preventDefault(); reset();
    if (password !== confirm) { setError("Passwords don't match"); return; }
    if (password.length < 8)  { setError("Password must be at least 8 characters"); return; }
    setStep(2);
  };

  // ── SIGNUP step 2 — create account ──
  const handleSignupStep2 = async (e) => {
    e.preventDefault(); reset(); setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email, password,
        options: { data: { full_name: fullName, role } }
      });
      if (error) throw error;

      if (data.user) {
        await supabase.from("profiles").upsert({
          id: data.user.id,
          email,
          full_name: fullName,
          role,
          is_premium: false,
          created_at: new Date().toISOString(),
        });
        setSuccess("Account created! Check your email to verify, then log in.");
        setMode("login");
        setStep(1);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── FORGOT PASSWORD ──
  const handleForgot = async (e) => {
    e.preventDefault(); reset(); setLoading(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${baseUrl}/auth/reset`,
      });
      if (error) throw error;
      setSuccess("Reset link sent! Check your inbox.");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "login",  label: "Sign In" },
    { id: "signup", label: "Sign Up" },
  ];

  return (
    <div className="min-h-screen bg-[#050609] flex items-center justify-center p-4" 
      style={{ background: "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(59,130,246,0.08) 0%, transparent 60%), #050609" }}>
      
      {/* Ambient blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/4 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/4 rounded-full blur-3xl" />
      </div>

      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2.5 mb-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-[0_0_24px_rgba(59,130,246,0.4)]">
              <Icon d={ICONS.zap} size={18} className="text-white fill-white" />
            </div>
            <span className="text-white font-black text-2xl tracking-tight uppercase italic">AppForge</span>
          </div>
          <p className="text-gray-500 text-sm">Build. Ship. Scale.</p>
        </div>

        {/* Card */}
        <div className="bg-[#0d1017] border border-white/8 rounded-2xl overflow-hidden shadow-2xl shadow-black/50">
          
          {/* Tabs — only login/signup, not forgot */}
          {mode !== "forgot" && (
            <div className="flex border-b border-white/5">
              {tabs.map(t => (
                <button key={t.id} onClick={() => { setMode(t.id); setStep(1); reset(); }}
                  className={`flex-1 py-4 text-sm font-bold transition-colors ${
                    mode === t.id
                      ? "text-white border-b-2 border-blue-500 bg-blue-500/5"
                      : "text-gray-500 hover:text-gray-300"
                  }`}>
                  {t.label}
                </button>
              ))}
            </div>
          )}

          <div className="p-7">
            <AnimatePresence mode="wait">

              {/* ── LOGIN ── */}
              {mode === "login" && (
                <motion.form key="login" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }} onSubmit={handleLogin} className="flex flex-col gap-4">
                  
                  <InputField label="Email" type="email" value={email} onChange={setEmail}
                    placeholder="you@example.com" icon={ICONS.mail} required />
                  <InputField label="Password" type="password" value={password} onChange={setPassword}
                    placeholder="••••••••" icon={ICONS.lock} required />

                  <button type="button" onClick={() => { setMode("forgot"); reset(); }}
                    className="text-xs text-blue-400 hover:text-blue-300 text-right transition-colors -mt-1">
                    Forgot password?
                  </button>

                  {error   && <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 px-3 py-2.5 rounded-lg">{error}</p>}
                  {success && <p className="text-green-400 text-xs bg-green-500/10 border border-green-500/20 px-3 py-2.5 rounded-lg">{success}</p>}

                  <button type="submit" disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] mt-1">
                    {loading ? "Signing in..." : "Sign In →"}
                  </button>
                </motion.form>
              )}

              {/* ── SIGNUP step 1 ── */}
              {mode === "signup" && step === 1 && (
                <motion.form key="signup1" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }} onSubmit={handleSignupStep1} className="flex flex-col gap-4">

                  <div className="flex justify-between items-center mb-1">
                    <h3 className="text-white font-bold text-base">Create your account</h3>
                    <div className="flex gap-1">
                      {[1,2].map(s => <div key={s} className={`w-8 h-1 rounded-full ${step >= s ? "bg-blue-500" : "bg-white/10"}`} />)}
                    </div>
                  </div>

                  <InputField label="Full Name" value={fullName} onChange={setFullName}
                    placeholder="Alex Rivera" icon={ICONS.user} required />
                  <InputField label="Email" type="email" value={email} onChange={setEmail}
                    placeholder="you@example.com" icon={ICONS.mail} required />
                  <InputField label="Password" type="password" value={password} onChange={setPassword}
                    placeholder="Min 8 characters" icon={ICONS.lock} required />
                  <InputField label="Confirm Password" type="password" value={confirm} onChange={setConfirm}
                    placeholder="Repeat password" icon={ICONS.lock} required />

                  {error && <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 px-3 py-2.5 rounded-lg">{error}</p>}

                  <button type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] mt-1">
                    Continue →
                  </button>
                </motion.form>
              )}

              {/* ── SIGNUP step 2 — role ── */}
              {mode === "signup" && step === 2 && (
                <motion.form key="signup2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }} onSubmit={handleSignupStep2} className="flex flex-col gap-5">

                  <div className="flex justify-between items-center">
                    <h3 className="text-white font-bold text-base">Choose your role</h3>
                    <div className="flex gap-1">
                      {[1,2].map(s => <div key={s} className={`w-8 h-1 rounded-full ${step >= s ? "bg-blue-500" : "bg-white/10"}`} />)}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: "developer", title: "Developer", desc: "Build apps, complete tasks, push code", emoji: "💻" },
                      { id: "manager",   title: "Manager",   desc: "Create projects, assign tasks, track progress", emoji: "📊" },
                    ].map(r => (
                      <button key={r.id} type="button" onClick={() => setRole(r.id)}
                        className={`p-4 rounded-xl border text-left transition-all ${
                          role === r.id
                            ? "border-blue-500 bg-blue-500/10 shadow-[0_0_15px_rgba(59,130,246,0.15)]"
                            : "border-white/10 bg-white/3 hover:border-white/20"
                        }`}>
                        <div className="text-2xl mb-2">{r.emoji}</div>
                        <div className="text-sm font-bold text-white mb-1">{r.title}</div>
                        <div className="text-[11px] text-gray-500 leading-snug">{r.desc}</div>
                        {role === r.id && (
                          <div className="mt-2 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                            <Icon d={ICONS.check} size={11} className="text-white" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>

                  {error   && <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 px-3 py-2.5 rounded-lg">{error}</p>}
                  {success && <p className="text-green-400 text-xs bg-green-500/10 border border-green-500/20 px-3 py-2.5 rounded-lg">{success}</p>}

                  <div className="flex gap-3">
                    <button type="button" onClick={() => setStep(1)}
                      className="flex-1 py-3.5 rounded-xl border border-white/10 text-gray-400 font-bold hover:bg-white/5 transition-all">
                      ← Back
                    </button>
                    <button type="submit" disabled={loading}
                      className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                      {loading ? "Creating..." : "Create Account"}
                    </button>
                  </div>
                </motion.form>
              )}

              {/* ── FORGOT ── */}
              {mode === "forgot" && (
                <motion.form key="forgot" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }} onSubmit={handleForgot} className="flex flex-col gap-4">

                  <div>
                    <h3 className="text-white font-bold text-base mb-1">Reset password</h3>
                    <p className="text-gray-500 text-sm">We'll send a reset link to your email.</p>
                  </div>

                  <InputField label="Email" type="email" value={email} onChange={setEmail}
                    placeholder="you@example.com" icon={ICONS.mail} required />

                  {error   && <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 px-3 py-2.5 rounded-lg">{error}</p>}
                  {success && <p className="text-green-400 text-xs bg-green-500/10 border border-green-500/20 px-3 py-2.5 rounded-lg">{success}</p>}

                  <button type="submit" disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-all">
                    {loading ? "Sending..." : "Send Reset Link"}
                  </button>
                  <button type="button" onClick={() => { setMode("login"); reset(); }}
                    className="text-sm text-gray-500 hover:text-gray-300 transition-colors text-center">
                    ← Back to sign in
                  </button>
                </motion.form>
              )}

            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="px-7 pb-6 text-center">
            <p className="text-[11px] text-gray-600">
              By continuing, you agree to our{" "}
              <span className="text-gray-400 cursor-pointer hover:text-white">Terms</span>
              {" & "}
              <span className="text-gray-400 cursor-pointer hover:text-white">Privacy Policy</span>.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}