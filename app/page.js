"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue, AnimatePresence } from "framer-motion";

// ─── MAGNETIC CURSOR ──────────────────────────────────────────────────────────
function MagneticCursor() {
  const cursorRef = useRef(null);
  const trailRef = useRef(null);
  const [label, setLabel] = useState("");
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const cursor = cursorRef.current;
    const trail = trailRef.current;
    let x = 0, y = 0, tx = 0, ty = 0;
    let raf;

    const move = (e) => {
      tx = e.clientX;
      ty = e.clientY;
    };

    const lerp = (a, b, n) => a + (b - a) * n;

    const animate = () => {
      x = lerp(x, tx, 0.12);
      y = lerp(y, ty, 0.12);
      if (cursor) cursor.style.transform = `translate(${tx - 10}px,${ty - 10}px)`;
      if (trail) trail.style.transform = `translate(${x - 4}px,${y - 4}px)`;
      raf = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", move);
    raf = requestAnimationFrame(animate);

    const onEnter = (e) => {
      const el = e.currentTarget;
      setLabel(el.dataset.cursor || "");
      setHovered(true);
    };
    const onLeave = () => { setLabel(""); setHovered(false); };

    document.querySelectorAll("[data-cursor]").forEach(el => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });

    return () => {
      window.removeEventListener("mousemove", move);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={cursorRef} className="fixed top-0 left-0 z-[9999] pointer-events-none mix-blend-difference">
        <motion.div
          animate={{ scale: hovered ? 3.5 : 1, opacity: hovered ? 0.9 : 0.7 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="w-5 h-5 rounded-full bg-white flex items-center justify-center"
        >
          {label && <span className="text-[5px] text-black font-black tracking-tight whitespace-nowrap">{label}</span>}
        </motion.div>
      </div>
      <div ref={trailRef} className="fixed top-0 left-0 z-[9998] pointer-events-none">
        <div className="w-2 h-2 rounded-full bg-cyan-400/40 blur-[1px]" />
      </div>
    </>
  );
}

// ─── NOISE CANVAS ─────────────────────────────────────────────────────────────
function NoiseOverlay() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = 256; canvas.height = 256;
    const data = ctx.createImageData(256, 256);
    for (let i = 0; i < data.data.length; i += 4) {
      const v = Math.random() * 255;
      data.data[i] = data.data[i+1] = data.data[i+2] = v;
      data.data[i+3] = 18;
    }
    ctx.putImageData(data, 0, 0);
  }, []);
  return (
    <canvas ref={canvasRef} className="fixed inset-0 z-[1] pointer-events-none w-full h-full opacity-[0.35]"
      style={{ imageRendering: "pixelated", backgroundRepeat: "repeat" }} />
  );
}

// ─── ORBS ─────────────────────────────────────────────────────────────────────
function AmbientOrbs() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Primary radial */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.18, 0.28, 0.18] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-30vh] left-1/2 -translate-x-1/2 w-[140vw] h-[140vw] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(6,182,212,0.25) 0%, rgba(59,130,246,0.12) 40%, transparent 70%)" }}
      />
      {/* Lower right */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], x: [0, 40, 0], y: [0, -30, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        className="absolute bottom-[-20vh] right-[-10vw] w-[80vw] h-[80vw] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(99,102,241,0.2) 0%, rgba(139,92,246,0.1) 40%, transparent 70%)" }}
      />
      {/* Left violet */}
      <motion.div
        animate={{ scale: [1, 1.1, 1], y: [0, 50, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 7 }}
        className="absolute top-[30vh] left-[-15vw] w-[60vw] h-[60vw] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)" }}
      />
      {/* Chromatic split */}
      <div className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse 120% 60% at 50% 0%, rgba(6,182,212,0.06) 0%, transparent 60%)" }} />
    </div>
  );
}

// ─── HOLOGRAPHIC GRID ─────────────────────────────────────────────────────────
function HoloGrid() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <div style={{
        backgroundImage: `
          linear-gradient(rgba(6,182,212,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(6,182,212,0.04) 1px, transparent 1px)
        `,
        backgroundSize: "80px 80px",
        maskImage: "radial-gradient(ellipse 80% 80% at 50% 20%, black 0%, transparent 100%)",
        WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 50% 20%, black 0%, transparent 100%)",
      }} className="absolute inset-0" />
      {/* Horizon line */}
      <div className="absolute top-[62vh] left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(6,182,212,0.3), rgba(99,102,241,0.3), transparent)" }} />
    </div>
  );
}

// ─── GLASS PILL TAG ───────────────────────────────────────────────────────────
function GlassPill({ children, glow }) {
  return (
    <div className={`inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-white/10 backdrop-blur-2xl text-sm font-medium tracking-wide ${glow ? "shadow-[0_0_30px_rgba(6,182,212,0.2)]" : ""}`}
      style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))" }}>
      {children}
    </div>
  );
}

// ─── PRISM TEXT ───────────────────────────────────────────────────────────────
function PrismText({ children, className }) {
  return (
    <span className={`${className}`} style={{
      background: "linear-gradient(135deg, #67e8f9 0%, #818cf8 30%, #c084fc 55%, #38bdf8 80%, #67e8f9 100%)",
      backgroundSize: "300% 300%",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
      animation: "prism 8s ease infinite",
    }}>
      {children}
    </span>
  );
}

// ─── BENTO CARD ───────────────────────────────────────────────────────────────
function BentoCard({ children, className, glow, span, featured }) {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouse = (e) => {
    const r = cardRef.current.getBoundingClientRect();
    const cx = e.clientX - r.left - r.width / 2;
    const cy = e.clientY - r.top - r.height / 2;
    setTilt({ x: (cy / r.height) * -10, y: (cx / r.width) * 10 });
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouse}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      animate={{ rotateX: tilt.x, rotateY: tilt.y }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      whileHover={{ scale: 1.02, z: 30 }}
      className={`relative rounded-[32px] overflow-hidden border ${featured ? "border-cyan-500/30" : "border-white/[0.07]"} ${span} ${className}`}
      style={{
        background: featured
          ? "linear-gradient(135deg, rgba(6,182,212,0.08), rgba(99,102,241,0.06), rgba(0,0,0,0.6))"
          : "linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))",
        backdropFilter: "blur(24px)",
        boxShadow: glow
          ? "0 0 60px rgba(6,182,212,0.12), 0 40px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)"
          : "0 40px 80px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
        transformStyle: "preserve-3d",
      }}
    >
      {glow && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(6,182,212,0.8), transparent)" }} />
      )}
      {children}
    </motion.div>
  );
}

// ─── STAT TICKER ──────────────────────────────────────────────────────────────
function StatTicker({ value, label, suffix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting && !started) setStarted(true); });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let frame;
    const start = performance.now();
    const dur = 2000;
    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 4);
      setCount(Math.floor(ease * value));
      if (p < 1) frame = requestAnimationFrame(tick);
      else setCount(value);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [started, value]);

  return (
    <div ref={ref} className="text-center">
      <div className="font-black text-5xl md:text-6xl tracking-[-0.04em] tabular-nums" style={{
        background: "linear-gradient(180deg, #fff 40%, rgba(255,255,255,0.4))",
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
      }}>
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-zinc-500 text-sm mt-2 font-medium tracking-widest uppercase">{label}</div>
    </div>
  );
}

// ─── FLOATING PHONE ───────────────────────────────────────────────────────────
function FloatingPhone() {
  return (
    <motion.div
      animate={{ y: [0, -18, 0], rotateY: [0, 4, 0], rotateX: [2, -2, 2] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      style={{ transformStyle: "preserve-3d", perspective: "800px" }}
      className="relative mx-auto"
    >
      {/* Reflection */}
      <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-48 h-8 rounded-full blur-2xl"
        style={{ background: "radial-gradient(ellipse, rgba(6,182,212,0.4), transparent)" }} />

      {/* Phone frame */}
      <div className="relative w-[280px] h-[560px] rounded-[46px] bg-black border-[10px] border-zinc-800 overflow-hidden shadow-[0_60px_120px_rgba(0,0,0,0.8),inset_0_0_0_1px_rgba(255,255,255,0.08)]">
        {/* Screen content */}
        <div className="h-full w-full bg-[#050B18] flex flex-col">
          {/* Status bar */}
          <div className="flex items-center justify-between px-5 pt-3 pb-2">
            <span className="text-[10px] text-white/60 font-semibold">9:41</span>
            <div className="w-20 h-5 rounded-full bg-black" />
            <div className="flex gap-1">
              {[3,2.5,2].map((h,i) => <div key={i} className="w-1 rounded-full bg-white/60" style={{height:`${h*4}px`}} />)}
            </div>
          </div>
          {/* App header */}
          <div className="mx-3 mt-1 rounded-3xl p-4 overflow-hidden relative" style={{
            background: "linear-gradient(135deg, rgba(6,182,212,0.8), rgba(99,102,241,0.8))"
          }}>
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: "radial-gradient(circle at 80% 20%, white 0%, transparent 50%)"
            }} />
            <p className="text-white/70 text-[10px] font-medium">Good Morning</p>
            <p className="text-white text-xl font-black tracking-tight">AppForge Studio</p>
            <div className="mt-3 flex gap-2">
              {["Build","Deploy","Monitor"].map(t => (
                <div key={t} className="px-2.5 py-1 rounded-full bg-white/20 text-[8px] text-white font-bold">{t}</div>
              ))}
            </div>
          </div>
          {/* Metrics */}
          <div className="mx-3 mt-3 grid grid-cols-2 gap-2">
            {[
              { label: "Builds Today", value: "24", icon: "▲", color: "#22d3ee" },
              { label: "Active Users", value: "1.2K", icon: "◆", color: "#818cf8" },
            ].map(m => (
              <div key={m.label} className="rounded-2xl p-3" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="text-[10px] font-bold mb-1" style={{ color: m.color }}>{m.icon} {m.label}</div>
                <div className="text-white text-lg font-black">{m.value}</div>
              </div>
            ))}
          </div>
          {/* AI Activity */}
          <div className="mx-3 mt-3 rounded-2xl p-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-white/60 font-bold uppercase tracking-widest">AI Build Active</span>
              <div className="flex gap-1">
                {[0,1,2].map(i => (
                  <motion.div key={i} className="w-1 h-1 rounded-full bg-cyan-400"
                    animate={{ opacity: [1, 0.2, 1], scale: [1, 0.6, 1] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }} />
                ))}
              </div>
            </div>
            <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
              <motion.div className="h-full rounded-full" style={{ background: "linear-gradient(90deg, #22d3ee, #818cf8)" }}
                animate={{ width: ["35%", "78%", "60%", "92%"] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} />
            </div>
            <div className="mt-2 text-[9px] text-white/40 font-mono">Compiling release APK v2.4.1...</div>
          </div>
          {/* Widget list */}
          <div className="mx-3 mt-3 space-y-1.5">
            {["Container • 48dp padding","ListView • 12 items","GestureDetector"].map((w,i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: "rgba(255,255,255,0.03)" }}>
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: i === 0 ? "#22d3ee" : i === 1 ? "#818cf8" : "#c084fc" }} />
                <span className="text-[9px] text-white/50 font-mono">{w}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── SCROLLING TICKER ─────────────────────────────────────────────────────────
function MarqueeBand() {
  const items = [
    "Visual Builder","Dart Generation","Supabase Schemas","Cloud APK Builds",
    "AI Self-Repair","Realtime Preview","One-Click Deploy","Widget Intelligence",
    "State Management","Runtime Diagnostics","Schema Automation","Live Collaboration",
  ];
  const doubled = [...items, ...items];
  return (
    <div className="relative overflow-hidden py-5 border-y" style={{
      borderColor: "rgba(255,255,255,0.05)",
      background: "linear-gradient(135deg, rgba(6,182,212,0.03), rgba(99,102,241,0.03))"
    }}>
      <div className="flex gap-0" style={{ animation: "marquee 30s linear infinite" }}>
        {doubled.map((item, i) => (
          <div key={i} className="flex items-center shrink-0 gap-4 px-8">
            <div className="w-1 h-1 rounded-full bg-cyan-400/60" />
            <span className="text-xs text-zinc-400 font-semibold tracking-[0.2em] uppercase whitespace-nowrap">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── FEATURE PILL TABS ────────────────────────────────────────────────────────
function FeatureTabs() {
  const [active, setActive] = useState(0);
  const tabs = [
    {
      label: "Visual Builder",
      icon: "◈",
      color: "#22d3ee",
      headline: "Design with spatial precision",
      body: "Drag, compose, and configure Flutter widgets in a spatial canvas that mirrors real device physics. Every snap, every padding, every constraint is intentional — exported as architecture-grade Dart.",
      visual: (
        <div className="grid grid-cols-3 gap-3 p-6">
          {["Container","Row","Column","Stack","Scaffold","ListView","GestureDetector","AnimatedBuilder","FutureBuilder"].map((w, i) => (
            <motion.div key={w} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="aspect-square rounded-2xl flex flex-col items-center justify-center text-center p-2 cursor-pointer"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
              whileHover={{ scale: 1.06, borderColor: "#22d3ee66" }}>
              <div className="text-lg mb-1 opacity-60">⬡</div>
              <span className="text-[9px] text-zinc-400 font-mono leading-tight">{w}</span>
            </motion.div>
          ))}
        </div>
      ),
    },
    {
      label: "AI Code Engine",
      icon: "⟡",
      color: "#818cf8",
      headline: "Architecture, not scaffolding",
      body: "Production Dart that follows clean architecture principles — BLoC, Repository, Dependency Injection. Not toy code. Real patterns, real performance, real maintainability.",
      visual: (
        <div className="p-6 font-mono text-xs space-y-1.5 text-left">
          {[
            { t: "class", v: " DashboardBloc", c: "#818cf8" },
            { t: "  extends", v: " Bloc<DashboardEvent, DashboardState>", c: "#22d3ee" },
            { t: " {", v: "", c: "#fff" },
            { t: "  final", v: " DashboardRepository", c: "#c084fc" },
            { t: "   _repo;", v: "", c: "#fff" },
            { t: "", v: "", c: "" },
            { t: "  DashboardBloc(", v: "this._repo) : super(", c: "#fff" },
            { t: "    DashboardInitial()", v: ") {", c: "#22d3ee" },
            { t: "    on<FetchData>(", v: "_onFetchData);", c: "#fff" },
            { t: "  }", v: "", c: "#fff" },
          ].map((line, i) => (
            <div key={i} className="flex">
              <span className="text-zinc-600 w-6 shrink-0 select-none">{String(i+1).padStart(2,'0')}</span>
              <span style={{ color: line.c || "#94a3b8" }}>{line.t}</span>
              <span className="text-zinc-300">{line.v}</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      label: "Backend Forge",
      icon: "◬",
      color: "#c084fc",
      headline: "Supabase, automated completely",
      body: "Describe your data model in plain language. AppForge generates Supabase tables, RLS policies, Edge Functions, and typed TypeScript SDK — in seconds, not days.",
      visual: (
        <div className="p-6 space-y-3">
          {[
            { table: "users", cols: ["id","email","avatar_url","created_at"], color: "#22d3ee" },
            { table: "projects", cols: ["id","name","owner_id","flutter_code"], color: "#818cf8" },
            { table: "builds", cols: ["id","project_id","apk_url","status"], color: "#c084fc" },
          ].map(t => (
            <div key={t.table} className="rounded-2xl overflow-hidden border" style={{ borderColor: `${t.color}22` }}>
              <div className="px-4 py-2 text-[10px] font-bold tracking-widest uppercase" style={{ background: `${t.color}15`, color: t.color }}>{t.table}</div>
              <div className="flex gap-0">
                {t.cols.map(c => (
                  <div key={c} className="px-3 py-2 text-[9px] font-mono text-zinc-400 border-r last:border-0" style={{ borderColor: "rgba(255,255,255,0.04)" }}>{c}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      label: "Self-Repair AI",
      icon: "⟳",
      color: "#f472b6",
      headline: "Errors diagnosed before you blink",
      body: "AppForge watches your Flutter runtime like a hawk. Layout overflows, null pointer dereferences, build failures — identified, root-caused, and patched autonomously with explanations you can learn from.",
      visual: (
        <div className="p-6 space-y-3">
          {[
            { type: "OVERFLOW", msg: "RenderFlex overflowed by 32px", fix: "Wrapped with Expanded()", fixed: true, color: "#f472b6" },
            { type: "NULL", msg: "Null check on nullable type", fix: "Added null-safe guard", fixed: true, color: "#fb923c" },
            { type: "BUILD", msg: "Missing pubspec dependency", fix: "Auto-added http: ^1.2.0", fixed: true, color: "#22d3ee" },
          ].map((e, i) => (
            <motion.div key={i} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.15 }}
              className="rounded-2xl p-4 flex items-start gap-3" style={{ background: `${e.color}08`, border: `1px solid ${e.color}22` }}>
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5" style={{ background: `${e.color}20`, color: e.color }}>✓</div>
              <div className="flex-1 min-w-0">
                <div className="text-[9px] font-black tracking-widest mb-0.5" style={{ color: e.color }}>{e.type}</div>
                <div className="text-xs text-white/60 font-mono truncate">{e.msg}</div>
                <div className="text-[10px] text-white/30 mt-1">→ {e.fix}</div>
              </div>
            </motion.div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Tab row */}
      <div className="flex gap-3 mb-10 flex-wrap justify-center">
        {tabs.map((t, i) => (
          <motion.button key={i} onClick={() => setActive(i)}
            data-cursor={t.label}
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            className="relative px-6 py-3 rounded-2xl text-sm font-semibold transition-all duration-300"
            style={{
              background: active === i ? `${t.color}15` : "rgba(255,255,255,0.04)",
              border: `1px solid ${active === i ? t.color + "50" : "rgba(255,255,255,0.08)"}`,
              color: active === i ? t.color : "#71717a",
            }}>
            <span className="mr-2 text-base">{t.icon}</span>
            {t.label}
          </motion.button>
        ))}
      </div>
      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div key={active}
          initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
          transition={{ duration: 0.4, ease: [0.16,1,0.3,1] }}
          className="grid lg:grid-cols-2 gap-8 items-center"
        >
          <div>
            <div className="text-xs font-black tracking-[0.25em] uppercase mb-4" style={{ color: tabs[active].color }}>
              {tabs[active].icon} {tabs[active].label}
            </div>
            <h3 className="text-4xl md:text-5xl font-black tracking-[-0.04em] leading-[1.05] mb-6 text-white">
              {tabs[active].headline}
            </h3>
            <p className="text-zinc-400 text-lg leading-relaxed">{tabs[active].body}</p>
            <motion.button whileHover={{ scale: 1.03, x: 4 }} whileTap={{ scale: 0.97 }}
              className="mt-8 inline-flex items-center gap-2 text-sm font-semibold" style={{ color: tabs[active].color }}>
              Explore {tabs[active].label} →
            </motion.button>
          </div>
          <div className="rounded-[28px] overflow-hidden border" style={{
            borderColor: `${tabs[active].color}20`,
            background: "linear-gradient(135deg, rgba(255,255,255,0.04), rgba(0,0,0,0.4))",
            boxShadow: `0 0 60px ${tabs[active].color}12`,
          }}>
            {tabs[active].visual}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─── PRICING CARD ─────────────────────────────────────────────────────────────
function PricingCard({ tier, price, period, desc, features, cta, featured }) {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="relative rounded-[36px] p-8 flex flex-col overflow-hidden"
      style={{
        background: featured
          ? "linear-gradient(145deg, rgba(6,182,212,0.1), rgba(99,102,241,0.08), rgba(0,0,0,0.5))"
          : "linear-gradient(145deg, rgba(255,255,255,0.04), rgba(0,0,0,0.3))",
        border: featured ? "1px solid rgba(6,182,212,0.3)" : "1px solid rgba(255,255,255,0.07)",
        backdropFilter: "blur(32px)",
        boxShadow: featured
          ? "0 0 80px rgba(6,182,212,0.1), 0 60px 100px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)"
          : "0 40px 80px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
      }}
    >
      {featured && (
        <>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px"
            style={{ background: "linear-gradient(90deg, transparent, #22d3ee, #818cf8, transparent)" }} />
          <div className="absolute -top-6 left-1/2 -translate-x-1/2">
            <div className="px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase text-black"
              style={{ background: "linear-gradient(90deg, #22d3ee, #818cf8)" }}>
              Most Popular
            </div>
          </div>
        </>
      )}
      <div className="mb-6">
        <div className="text-xs font-black tracking-[0.3em] uppercase text-zinc-500 mb-3">{tier}</div>
        <div className="flex items-end gap-2 mb-3">
          <span className="text-6xl font-black tracking-[-0.05em]" style={{
            background: featured ? "linear-gradient(135deg, #67e8f9, #818cf8)" : "linear-gradient(180deg, #fff, rgba(255,255,255,0.6))",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
          }}>{price}</span>
          <span className="text-zinc-500 text-sm mb-3">{period}</span>
        </div>
        <p className="text-zinc-400 text-sm leading-relaxed">{desc}</p>
      </div>
      <div className="flex-1 space-y-3 mb-8">
        {features.map((f, i) => (
          <div key={i} className="flex items-center gap-3 text-sm">
            <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
              style={{ background: featured ? "rgba(6,182,212,0.15)" : "rgba(255,255,255,0.05)" }}>
              <span className="text-[10px]" style={{ color: featured ? "#22d3ee" : "#71717a" }}>✓</span>
            </div>
            <span className="text-zinc-300">{f}</span>
          </div>
        ))}
      </div>
      <motion.button
        whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
        data-cursor={cta}
        className="w-full h-13 py-4 rounded-2xl font-bold text-sm tracking-wide transition-all duration-300"
        style={featured ? {
          background: "linear-gradient(135deg, #22d3ee, #818cf8)",
          color: "#000",
          boxShadow: "0 0 40px rgba(6,182,212,0.3)",
        } : {
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.1)",
          color: "#fff",
        }}>
        {cta}
      </motion.button>
    </motion.div>
  );
}

// ─── WORKFLOW STEP ────────────────────────────────────────────────────────────
function Step({ num, title, desc, color, last }) {
  return (
    <div className="flex gap-6 group">
      <div className="flex flex-col items-center">
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 relative"
          style={{ background: `${color}15`, border: `1px solid ${color}40`, color }}>
          {num}
          <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ boxShadow: `0 0 30px ${color}40` }} />
        </motion.div>
        {!last && <div className="flex-1 w-px mt-3" style={{ background: `linear-gradient(${color}30, transparent)` }} />}
      </div>
      <div className="pb-10">
        <h3 className="font-bold text-xl text-white mb-2 group-hover:text-cyan-300 transition-colors">{title}</h3>
        <p className="text-zinc-400 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function AppForgeLanding() {
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, -80]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div className="bg-[#030712] text-white min-h-screen selection:bg-cyan-500/20 selection:text-cyan-200 cursor-none overflow-x-hidden">
      <MagneticCursor />
      <NoiseOverlay />
      <AmbientOrbs />
      <HoloGrid />

      {/* Scroll progress */}
      <motion.div className="fixed top-0 left-0 z-[100] h-[2px]"
        style={{ width: progressWidth, background: "linear-gradient(90deg, #22d3ee, #818cf8, #c084fc)" }} />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,700;12..96,800;12..96,900&family=JetBrains+Mono:wght@400;700&display=swap');
        * { font-family: 'Bricolage Grotesque', sans-serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace !important; }
        @keyframes prism {
          0%,100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.8); opacity: 1; }
          100% { transform: scale(2.4); opacity: 0; }
        }
        .pulse-ring::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 1px solid #22d3ee;
          animation: pulse-ring 2s ease-out infinite;
        }
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 2px; }
        ::-webkit-scrollbar-track { background: #030712; }
        ::-webkit-scrollbar-thumb { background: #22d3ee40; border-radius: 99px; }
      `}</style>

      {/* ── NAVBAR ──────────────────────────────────────────────────────────── */}
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16,1,0.3,1] }}
        className="sticky top-0 z-50"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", backdropFilter: "blur(40px)", background: "rgba(3,7,18,0.6)" }}
      >
        <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 rounded-2xl blur-md" style={{ background: "linear-gradient(135deg, #22d3ee, #818cf8)", opacity: 0.6 }} />
              <div className="relative w-10 h-10 rounded-2xl flex items-center justify-center" style={{
                background: "linear-gradient(135deg, rgba(6,182,212,0.3), rgba(99,102,241,0.3))",
                border: "1px solid rgba(255,255,255,0.15)",
              }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M3 9L9 3L15 9L9 15L3 9Z" fill="url(#logo-grad)" />
                  <path d="M9 6L12 9L9 12L6 9L9 6Z" fill="rgba(3,7,18,0.8)" />
                  <defs>
                    <linearGradient id="logo-grad" x1="0" y1="0" x2="18" y2="18">
                      <stop stopColor="#22d3ee" /><stop offset="1" stopColor="#818cf8" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
            <div>
              <div className="font-black text-lg tracking-tight leading-none">AppForge</div>
              <div className="text-[10px] text-zinc-500 tracking-[0.2em] uppercase leading-none mt-0.5">Flutter Intelligence</div>
            </div>
          </div>

          {/* Nav */}
          <nav className="hidden lg:flex items-center gap-8 text-sm text-zinc-400">
            {["Platform","Engine","Workflow","Pricing"].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`} data-cursor={item}
                className="hover:text-white transition-colors duration-200 relative group">
                {item}
                <div className="absolute -bottom-0.5 left-0 w-0 h-px group-hover:w-full transition-all duration-300"
                  style={{ background: "linear-gradient(90deg, #22d3ee, #818cf8)" }} />
              </a>
            ))}
          </nav>

          {/* CTAs */}
          <div className="flex items-center gap-3">
            <button data-cursor="Login" className="h-10 px-5 rounded-xl text-sm text-zinc-400 hover:text-white transition-colors border border-transparent hover:border-white/10">
              Sign in
            </button>
            <motion.button
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              data-cursor="Start"
              className="h-10 px-6 rounded-xl text-sm font-bold text-black relative overflow-hidden"
              style={{ background: "linear-gradient(135deg, #22d3ee, #818cf8)", boxShadow: "0 0 30px rgba(6,182,212,0.3)" }}>
              <span className="relative z-10">Start Building</span>
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* ── HERO ────────────────────────────────────────────────────────────── */}
      <section className="relative max-w-[1400px] mx-auto px-6 pt-24 pb-32 min-h-screen flex flex-col justify-center">
        <motion.div style={{ y: heroY, opacity: heroOpacity }}>
          <div className="grid lg:grid-cols-[1fr_420px] gap-16 xl:gap-24 items-center">
            <div>
              {/* Badge */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <GlassPill glow>
                  <div className="relative w-2 h-2 pulse-ring">
                    <div className="w-2 h-2 rounded-full bg-cyan-400" />
                  </div>
                  <span className="text-zinc-300">AI-Native Flutter Platform — v3.0 Live</span>
                </GlassPill>
              </motion.div>

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 40, filter: "blur(20px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ delay: 0.2, duration: 1, ease: [0.16,1,0.3,1] }}
                className="mt-10 font-black leading-[0.88] tracking-[-0.06em]"
                style={{ fontSize: "clamp(56px, 8vw, 120px)" }}>
                Ship apps<br />
                <PrismText>ten times</PrismText><br />
                <span className="text-white">faster.</span>
              </motion.h1>

              {/* Sub */}
              <motion.p
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.8 }}
                className="mt-8 text-lg text-zinc-400 leading-relaxed max-w-xl">
                AppForge transforms visual intent into production-grade Flutter architecture.
                Autonomous AI workflows, Supabase automation, cloud builds, and self-healing
                runtime systems — from idea to APK in minutes.
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className="mt-10 flex flex-wrap gap-4">
                <motion.button
                  whileHover={{ scale: 1.04, boxShadow: "0 0 80px rgba(6,182,212,0.5)" }}
                  whileTap={{ scale: 0.97 }}
                  data-cursor="Launch"
                  className="h-14 px-8 rounded-2xl font-bold text-black text-sm flex items-center gap-2 relative overflow-hidden"
                  style={{ background: "linear-gradient(135deg, #22d3ee 0%, #818cf8 100%)", boxShadow: "0 0 50px rgba(6,182,212,0.35)" }}>
                  <span>Launch Builder</span>
                  <span>→</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02, borderColor: "rgba(255,255,255,0.2)" }}
                  whileTap={{ scale: 0.97 }}
                  data-cursor="Demo"
                  className="h-14 px-8 rounded-2xl text-sm flex items-center gap-2 text-zinc-300 font-medium"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(20px)" }}>
                  <span className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.08)" }}>▶</span>
                  Watch 90s Demo
                </motion.button>
              </motion.div>

              {/* Trust row */}
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
                className="mt-10 flex flex-wrap items-center gap-6">
                <div className="flex -space-x-2">
                  {["#22d3ee","#818cf8","#c084fc","#f472b6","#fb923c"].map((c, i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-[#030712]" style={{ background: `radial-gradient(circle at 30% 30%, white, ${c})` }} />
                  ))}
                </div>
                <span className="text-sm text-zinc-400">
                  <span className="text-white font-bold">12,000+</span> developers shipping production apps
                </span>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} style={{ color: "#f59e0b", fontSize: "12px" }}>★</span>
                  ))}
                  <span className="text-xs text-zinc-400 ml-1">4.9/5</span>
                </div>
              </motion.div>
            </div>

            {/* RIGHT: Floating phone */}
            <motion.div
              initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 1, ease: [0.16,1,0.3,1] }}
              className="hidden lg:flex justify-center">
              <FloatingPhone />
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-[10px] text-zinc-600 tracking-[0.3em] uppercase">Scroll</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}
            className="w-px h-8 mx-auto" style={{ background: "linear-gradient(#22d3ee, transparent)" }} />
        </motion.div>
      </section>

      {/* ── MARQUEE BAND ────────────────────────────────────────────────────── */}
      <MarqueeBand />

      {/* ── STATS ───────────────────────────────────────────────────────────── */}
      <section className="relative max-w-[1400px] mx-auto px-6 py-28">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-0 md:divide-x" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <div className="md:px-10">
            <StatTicker value={12000} label="Active Developers" suffix="+" />
          </div>
          <div className="md:px-10">
            <StatTicker value={180000} label="APKs Generated" suffix="+" />
          </div>
          <div className="md:px-10">
            <StatTicker value={99} label="Uptime SLA" suffix="%" />
          </div>
          <div className="md:px-10">
            <StatTicker value={4} label="Avg Time to APK (min)" />
          </div>
        </div>
      </section>

      {/* ── PLATFORM (BENTO) ────────────────────────────────────────────────── */}
      <section id="platform" className="max-w-[1400px] mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <GlassPill>
            <span className="text-cyan-400 text-xs">◈</span>
            <span className="text-zinc-300 text-sm">Platform Architecture</span>
          </GlassPill>
          <h2 className="mt-6 font-black tracking-[-0.05em] leading-[0.92]" style={{ fontSize: "clamp(40px,5vw,80px)" }}>
            Every tool you need.<br /><PrismText>Nothing you don't.</PrismText>
          </h2>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[220px]">
          {/* Large feature */}
          <BentoCard span="md:col-span-2 lg:col-span-2 row-span-2" glow featured>
            <div className="p-8 h-full flex flex-col">
              <div className="text-xs font-black tracking-widest text-cyan-400 uppercase mb-3">⟡ AI Visual Builder</div>
              <h3 className="text-3xl font-black leading-tight mb-3">Design → Production<br />in one motion</h3>
              <p className="text-zinc-400 text-sm leading-relaxed flex-1">
                A spatial canvas that thinks in Flutter. Drag widgets, configure properties, preview instantly.
                Every interaction generates architecture-grade Dart with BLoC state management.
              </p>
              <div className="mt-6 grid grid-cols-3 gap-2">
                {["Container","ListView","Row","Column","Stack","Hero"].map(w => (
                  <div key={w} className="px-2 py-1.5 rounded-lg text-[10px] font-mono text-center"
                    style={{ background: "rgba(6,182,212,0.08)", border: "1px solid rgba(6,182,212,0.15)", color: "#67e8f9" }}>
                    {w}
                  </div>
                ))}
              </div>
            </div>
          </BentoCard>

          {/* Realtime */}
          <BentoCard span="md:col-span-1 lg:col-span-1" glow>
            <div className="p-6 h-full flex flex-col">
              <div className="text-xs font-black tracking-widest text-indigo-400 uppercase mb-3">◆ Realtime</div>
              <h3 className="text-xl font-black mb-2">Live device preview</h3>
              <p className="text-zinc-400 text-xs leading-relaxed">Changes render on physical device in &lt;200ms.</p>
              <div className="mt-auto flex items-center gap-2">
                <motion.div className="w-2 h-2 rounded-full bg-green-400"
                  animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }} />
                <span className="text-xs text-green-400 font-mono">187ms latency</span>
              </div>
            </div>
          </BentoCard>

          {/* Self-repair */}
          <BentoCard span="md:col-span-1 lg:col-span-1">
            <div className="p-6 h-full flex flex-col">
              <div className="text-xs font-black tracking-widest text-pink-400 uppercase mb-3">⟳ Self-Repair</div>
              <h3 className="text-xl font-black mb-2">Zero-touch error fixes</h3>
              <p className="text-zinc-400 text-xs leading-relaxed">AI detects, diagnoses, and patches runtime errors before you notice them.</p>
              <div className="mt-auto">
                <div className="text-xs font-mono text-green-400">3 issues auto-fixed today</div>
              </div>
            </div>
          </BentoCard>

          {/* Supabase */}
          <BentoCard span="md:col-span-1 lg:col-span-1">
            <div className="p-6 h-full flex flex-col">
              <div className="text-xs font-black tracking-widest text-violet-400 uppercase mb-3">◬ Backend</div>
              <h3 className="text-xl font-black mb-2">Supabase in seconds</h3>
              <p className="text-zinc-400 text-xs leading-relaxed">Full schema generation, RLS policies, Edge Functions, and typed SDK — automatically.</p>
            </div>
          </BentoCard>

          {/* Cloud builds */}
          <BentoCard span="md:col-span-1 lg:col-span-1" glow>
            <div className="p-6 h-full flex flex-col">
              <div className="text-xs font-black tracking-widest text-amber-400 uppercase mb-3">▲ Cloud Builds</div>
              <h3 className="text-xl font-black mb-2">APK in 4 minutes</h3>
              <p className="text-zinc-400 text-xs leading-relaxed mb-4">Distributed build farm. No local Flutter setup required.</p>
              <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                <motion.div className="h-full rounded-full" style={{ background: "linear-gradient(90deg, #f59e0b, #ef4444)" }}
                  animate={{ width: ["0%","65%","100%"] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} />
              </div>
            </div>
          </BentoCard>

          {/* Code quality */}
          <BentoCard span="md:col-span-1 lg:col-span-2">
            <div className="p-6 h-full flex items-center gap-6">
              <div className="flex-1">
                <div className="text-xs font-black tracking-widest text-cyan-400 uppercase mb-3">⌘ Code Quality</div>
                <h3 className="text-2xl font-black mb-2">Clean architecture by default</h3>
                <p className="text-zinc-400 text-xs leading-relaxed">Every export follows Flutter team conventions. Lint-clean, test-ready, CI-compatible.</p>
              </div>
              <div className="shrink-0 font-mono text-[10px] space-y-1 text-left hidden xl:block">
                {["✓ BLoC pattern","✓ Repository layer","✓ Clean imports","✓ 0 lint warnings"].map(l => (
                  <div key={l} className="text-green-400">{l}</div>
                ))}
              </div>
            </div>
          </BentoCard>
        </div>
      </section>

      {/* ── FEATURE DEEP DIVE ───────────────────────────────────────────────── */}
      <section id="engine" className="max-w-[1400px] mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <GlassPill>
            <span className="text-indigo-400 text-xs">⟡</span>
            <span className="text-zinc-300 text-sm">Deep Platform</span>
          </GlassPill>
          <h2 className="mt-6 font-black tracking-[-0.05em] leading-[0.92]" style={{ fontSize: "clamp(36px,4.5vw,72px)" }}>
            Every feature is <PrismText>world-class.</PrismText>
          </h2>
        </div>
        <FeatureTabs />
      </section>

      {/* ── WORKFLOW ────────────────────────────────────────────────────────── */}
      <section id="workflow" className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(6,182,212,0.04), transparent)" }} />

        <div className="relative max-w-[1400px] mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-start">
            <div>
              <GlassPill>
                <span className="text-cyan-400 text-xs">→</span>
                <span className="text-zinc-300 text-sm">End-to-End Workflow</span>
              </GlassPill>
              <h2 className="mt-6 font-black tracking-[-0.05em] leading-[0.92] mb-12" style={{ fontSize: "clamp(36px,4vw,64px)" }}>
                From idea<br />to <PrismText>deployed app</PrismText><br />in one session.
              </h2>

              <div>
                {[
                  { num:"01", title:"Design in the Canvas", desc:"Compose Flutter widget trees visually. Every placement, every constraint, every padding is precise — and live-previewed on your target device.", color:"#22d3ee" },
                  { num:"02", title:"Generate Production Dart", desc:"One click exports your canvas to clean, BLoC-architecture Dart code. Not scaffolding — production-grade files organized for real teams.", color:"#818cf8" },
                  { num:"03", title:"Automate Your Backend", desc:"Describe your data. AppForge generates Supabase tables, Row Level Security policies, typed APIs, and authentication flows automatically.", color:"#c084fc" },
                  { num:"04", title:"Build & Deploy", desc:"Trigger a cloud APK build from your dashboard. No local Flutter SDK. No Gradle configuration. Distributed builds complete in under 5 minutes.", color:"#f472b6", last:true },
                ].map((s, i) => <Step key={i} {...s} />)}
              </div>
            </div>

            {/* Terminal mockup */}
            <div className="sticky top-24">
              <div className="rounded-[28px] overflow-hidden border border-white/[0.07]"
                style={{ background: "linear-gradient(145deg, rgba(10,15,30,0.9), rgba(5,8,20,0.95))", backdropFilter: "blur(40px)", boxShadow: "0 60px 100px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)" }}>
                {/* Terminal header */}
                <div className="flex items-center gap-2 px-5 py-4 border-b border-white/[0.05]">
                  {["#ef4444","#f59e0b","#22c55e"].map(c => (
                    <div key={c} className="w-3 h-3 rounded-full" style={{ background: c }} />
                  ))}
                  <div className="flex-1 mx-4 text-center">
                    <span className="text-xs text-zinc-500 font-mono">appforge — cloud build v3.0</span>
                  </div>
                </div>
                {/* Terminal content */}
                <div className="p-6 font-mono text-xs space-y-2 min-h-[400px]">
                  {[
                    { t:0, text:"$ appforge build --release", c:"#22d3ee" },
                    { t:0.5, text:"▸ Analyzing widget tree...", c:"#94a3b8" },
                    { t:1, text:"  ✓ 247 widgets optimized", c:"#22c55e" },
                    { t:1.5, text:"▸ Generating Dart architecture...", c:"#94a3b8" },
                    { t:2, text:"  ✓ BLoC pattern applied", c:"#22c55e" },
                    { t:2.5, text:"  ✓ Repository layer created", c:"#22c55e" },
                    { t:3, text:"▸ Provisioning Supabase schema...", c:"#94a3b8" },
                    { t:3.5, text:"  ✓ 4 tables • 12 RLS policies", c:"#22c55e" },
                    { t:4, text:"▸ Uploading to build farm...", c:"#94a3b8" },
                    { t:4.5, text:"  ✓ Worker pool: 16 nodes", c:"#22c55e" },
                    { t:5, text:"▸ Compiling release APK...", c:"#f59e0b" },
                    { t:7, text:"  ✓ Build complete (3m 47s)", c:"#22c55e" },
                    { t:7.5, text:"  ✓ Signed • Optimized • 14.2 MB", c:"#22c55e" },
                    { t:8, text:"$ Download ready → cdn.appforge.dev/build/...", c:"#818cf8" },
                  ].map((line, i) => (
                    <motion.div key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: line.t * 0.18, duration: 0.3 }}
                      style={{ color: line.c }}>
                      {line.text}
                    </motion.div>
                  ))}
                  <motion.span
                    animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1, repeat: Infinity }}
                    className="inline-block w-2 h-4 bg-cyan-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ────────────────────────────────────────────────────── */}
      <section className="max-w-[1400px] mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="font-black tracking-[-0.05em]" style={{ fontSize: "clamp(32px,3.5vw,56px)" }}>
            Builders trust <PrismText>AppForge</PrismText>
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { name:"Arjun M.", role:"CTO @ Fintech Startup", text:"We launched our MVP in 11 days. Our Flutter app has 50K users. AppForge's clean Dart output saved us months of refactoring.", avatar:"#22d3ee" },
            { name:"Sarah K.", role:"Indie Developer", text:"I'm not a Flutter expert, but AppForge generates code that senior devs at my studio can't believe came from a no-code builder.", avatar:"#818cf8" },
            { name:"Liu W.", role:"Engineering Lead", text:"The AI self-repair feature alone is worth the price. It caught three production memory leaks before we did and fixed them silently.", avatar:"#c084fc" },
          ].map((t, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.6 }} viewport={{ once: true }}
              className="rounded-[28px] p-7" style={{
                background: "linear-gradient(145deg, rgba(255,255,255,0.04), rgba(0,0,0,0.3))",
                border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(20px)"
              }}>
              <div className="text-lg text-zinc-300 leading-relaxed mb-6">"{t.text}"</div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full" style={{ background: `radial-gradient(circle at 30% 30%, white, ${t.avatar})` }} />
                <div>
                  <div className="font-bold text-sm">{t.name}</div>
                  <div className="text-xs text-zinc-500">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── PRICING ─────────────────────────────────────────────────────────── */}
      <section id="pricing" className="max-w-[1100px] mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <GlassPill>
            <span className="text-violet-400 text-xs">◆</span>
            <span className="text-zinc-300 text-sm">Simple Pricing</span>
          </GlassPill>
          <h2 className="mt-6 font-black tracking-[-0.05em]" style={{ fontSize: "clamp(36px,4vw,64px)" }}>
            Start free.<br /><PrismText>Scale infinitely.</PrismText>
          </h2>
          <p className="mt-4 text-zinc-400 max-w-lg mx-auto">No hidden fees. No per-seat nonsense. Pay for what you ship.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 items-start">
          <PricingCard
            tier="Starter"
            price="$0"
            period="/mo forever"
            desc="For indie builders and side projects."
            features={["Visual Widget Builder","Flutter Code Export","5 Supabase Projects","Community Support","3 Cloud Builds/mo"]}
            cta="Start Free — No Card"
          />
          <PricingCard
            tier="Pro Engine"
            price="$5.99"
            period="/mo"
            desc="For startups shipping real products."
            features={["Everything in Starter","Unlimited Cloud Builds","AI Self-Repair Engine","Priority Build Farm","Slack + Email Support","Advanced State Patterns"]}
            cta="Start Pro Trial"
            featured
          />
          <PricingCard
            tier="Enterprise"
            price="Custom"
            period=""
            desc="For engineering teams at scale."
            features={["Unlimited Everything","Dedicated Build Nodes","SSO + Audit Logs","SLA Guarantees","White-Label Export","Dedicated Solutions Eng"]}
            cta="Talk to Sales"
          />
        </div>
      </section>

      {/* ── CTA FINALE ──────────────────────────────────────────────────────── */}
      <section className="max-w-[1400px] mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }} viewport={{ once: true }}
          className="relative rounded-[40px] overflow-hidden text-center p-16"
          style={{
            background: "linear-gradient(145deg, rgba(6,182,212,0.1), rgba(99,102,241,0.1), rgba(192,132,252,0.05))",
            border: "1px solid rgba(6,182,212,0.2)",
            backdropFilter: "blur(40px)",
          }}>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px"
            style={{ background: "linear-gradient(90deg, transparent, #22d3ee, #818cf8, transparent)" }} />
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(6,182,212,0.12), transparent)" }} />

          <div className="relative">
            <div className="text-xs font-black tracking-[0.3em] text-cyan-400 uppercase mb-6">The Future of Flutter Development</div>
            <h2 className="font-black tracking-[-0.05em] leading-[0.92] mb-6" style={{ fontSize: "clamp(40px,5vw,80px)" }}>
              Your app deserves<br /><PrismText>exceptional engineering.</PrismText>
            </h2>
            <p className="text-zinc-400 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
              Join 12,000 developers who chose AppForge to build faster, ship better, and break fewer things at 3am.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.04, boxShadow: "0 0 80px rgba(6,182,212,0.5)" }}
                whileTap={{ scale: 0.97 }}
                data-cursor="Launch"
                className="h-14 px-10 rounded-2xl font-bold text-black"
                style={{ background: "linear-gradient(135deg, #22d3ee, #818cf8)", boxShadow: "0 0 40px rgba(6,182,212,0.3)" }}>
                Launch AppForge Free →
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                className="h-14 px-10 rounded-2xl font-medium text-zinc-300"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
                Schedule a Demo
              </motion.button>
            </div>
            <p className="mt-6 text-xs text-zinc-600">No credit card. Instant access. Cancel anytime.</p>
          </div>
        </motion.div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────────── */}
      <footer className="border-t py-16" style={{ borderColor: "rgba(255,255,255,0.05)", background: "rgba(0,0,0,0.3)" }}>
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-10 mb-14">
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, rgba(6,182,212,0.3), rgba(99,102,241,0.3))", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                    <path d="M3 9L9 3L15 9L9 15L3 9Z" fill="url(#f-grad)" />
                    <path d="M9 6L12 9L9 12L6 9L9 6Z" fill="rgba(3,7,18,0.8)" />
                    <defs><linearGradient id="f-grad" x1="0" y1="0" x2="18" y2="18"><stop stopColor="#22d3ee" /><stop offset="1" stopColor="#818cf8" /></linearGradient></defs>
                  </svg>
                </div>
                <span className="font-black tracking-tight">AppForge</span>
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed mb-4">The AI-native Flutter engineering platform for teams who ship.</p>
              <div className="flex gap-3">
                {["𝕏","in","gh"].map(s => (
                  <div key={s} className="w-8 h-8 rounded-lg flex items-center justify-center text-xs text-zinc-500 hover:text-white cursor-pointer transition-colors"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    {s}
                  </div>
                ))}
              </div>
            </div>
            {[
              { title:"Platform", links:["Visual Builder","Code Engine","Backend Forge","Self-Repair AI","Cloud Builds"] },
              { title:"Company", links:["About","Blog","Careers","Press","Partners"] },
              { title:"Legal", links:["Privacy","Terms","Cookie Policy","DPA","Security"] },
            ].map(col => (
              <div key={col.title}>
                <div className="text-xs font-black tracking-widest text-zinc-500 uppercase mb-4">{col.title}</div>
                <div className="space-y-2.5">
                  {col.links.map(l => (
                    <a key={l} href="#" className="block text-sm text-zinc-400 hover:text-white transition-colors">{l}</a>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
            <span className="text-xs text-zinc-600">© 2026 AppForge, Inc. All rights reserved.</span>
            <div className="flex items-center gap-2 text-xs text-zinc-600">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
              All systems operational
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}