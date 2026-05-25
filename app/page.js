"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";

// ─── ROUTES (from page.js / UserMenu.js analysis) ────────────────────────────
const ROUTES = {
  auth:      "/auth",
  builder:   "/builder",
  dashboard: "/dashboard",
  account:   "/account",
};

// ─── BREAKPOINTS via CSS custom props ─────────────────────────────────────────
// All font-size / spacing done with clamp() — no Tailwind breakpoints needed for type.

// ─── TOUCH DETECTION ─────────────────────────────────────────────────────────
function useIsTouch() {
  const [touch, setTouch] = useState(false);
  useEffect(() => {
    const check = () => setTouch(
      window.matchMedia("(pointer: coarse)").matches || navigator.maxTouchPoints > 0
    );
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return touch;
}

// ─── VIEWPORT WIDTH ───────────────────────────────────────────────────────────
function useVW() {
  const [vw, setVw] = useState(0);
  useEffect(() => {
    const set = () => setVw(window.innerWidth);
    set();
    window.addEventListener("resize", set);
    return () => window.removeEventListener("resize", set);
  }, []);
  return vw;
}

// ─── MAGNETIC CURSOR (desktop/mouse only) ─────────────────────────────────────
function MagneticCursor({ isTouch }) {
  const cRef = useRef(null);
  const tRef = useRef(null);
  const [hov, setHov] = useState(false);
  const [lbl, setLbl] = useState("");
  useEffect(() => {
    if (isTouch) return;
    let x = 0, y = 0, tx = 0, ty = 0, raf;
    const move = (e) => { tx = e.clientX; ty = e.clientY; };
    const lerp = (a, b, n) => a + (b - a) * n;
    const loop = () => {
      x = lerp(x, tx, 0.12); y = lerp(y, ty, 0.12);
      if (cRef.current) cRef.current.style.transform = `translate(${tx-10}px,${ty-10}px)`;
      if (tRef.current) tRef.current.style.transform = `translate(${x-4}px,${y-4}px)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", move);
    raf = requestAnimationFrame(loop);
    const onIn = e => { setLbl(e.currentTarget.dataset.cur||""); setHov(true); };
    const onOut = () => { setLbl(""); setHov(false); };
    const els = document.querySelectorAll("[data-cur]");
    els.forEach(el => { el.addEventListener("mouseenter", onIn); el.addEventListener("mouseleave", onOut); });
    return () => { window.removeEventListener("mousemove", move); cancelAnimationFrame(raf); };
  }, [isTouch]);
  if (isTouch) return null;
  return (
    <>
      <div ref={cRef} className="fixed top-0 left-0 z-[9999] pointer-events-none mix-blend-difference">
        <motion.div animate={{ scale: hov ? 3.2 : 1, opacity: hov ? 0.9 : 0.7 }}
          transition={{ type:"spring", stiffness:300, damping:25 }}
          className="w-5 h-5 rounded-full bg-white flex items-center justify-center">
          {lbl && <span className="text-[5px] text-black font-black whitespace-nowrap">{lbl}</span>}
        </motion.div>
      </div>
      <div ref={tRef} className="fixed top-0 left-0 z-[9998] pointer-events-none">
        <div className="w-2 h-2 rounded-full bg-cyan-400/40 blur-[1px]" />
      </div>
    </>
  );
}

// ─── NOISE ───────────────────────────────────────────────────────────────────
function Noise() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; const ctx = c.getContext("2d");
    c.width = 256; c.height = 256;
    const d = ctx.createImageData(256,256);
    for (let i=0;i<d.data.length;i+=4){const v=Math.random()*255;d.data[i]=d.data[i+1]=d.data[i+2]=v;d.data[i+3]=14;}
    ctx.putImageData(d,0,0);
  },[]);
  return <canvas ref={ref} className="fixed inset-0 z-[1] pointer-events-none w-full h-full opacity-25" style={{imageRendering:"pixelated"}}/>;
}

// ─── AMBIENT ORBS ─────────────────────────────────────────────────────────────
function Orbs() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <motion.div animate={{scale:[1,1.12,1],opacity:[0.15,0.24,0.15]}}
        transition={{duration:12,repeat:Infinity,ease:"easeInOut"}}
        className="absolute -top-[20vh] left-1/2 -translate-x-1/2 rounded-full"
        style={{width:"clamp(400px,150vw,1400px)",height:"clamp(400px,150vw,1400px)",
          background:"radial-gradient(circle,rgba(6,182,212,0.22) 0%,rgba(59,130,246,0.1) 40%,transparent 70%)"}}/>
      <motion.div animate={{scale:[1,1.2,1],x:[0,25,0],y:[0,-20,0]}}
        transition={{duration:18,repeat:Infinity,ease:"easeInOut",delay:3}}
        className="absolute -bottom-[15vh] -right-[5vw] rounded-full"
        style={{width:"clamp(200px,80vw,900px)",height:"clamp(200px,80vw,900px)",
          background:"radial-gradient(circle,rgba(99,102,241,0.18) 0%,transparent 70%)"}}/>
      <motion.div animate={{scale:[1,1.1,1],y:[0,40,0]}}
        transition={{duration:14,repeat:Infinity,ease:"easeInOut",delay:7}}
        className="absolute top-[25vh] -left-[10vw] rounded-full"
        style={{width:"clamp(150px,60vw,700px)",height:"clamp(150px,60vw,700px)",
          background:"radial-gradient(circle,rgba(168,85,247,0.1) 0%,transparent 70%)"}}/>
    </div>
  );
}

// ─── HOLO GRID ───────────────────────────────────────────────────────────────
function Grid() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <div style={{
        backgroundImage:"linear-gradient(rgba(6,182,212,0.035) 1px,transparent 1px),linear-gradient(90deg,rgba(6,182,212,0.035) 1px,transparent 1px)",
        backgroundSize:"clamp(40px,6vw,80px) clamp(40px,6vw,80px)",
        maskImage:"radial-gradient(ellipse 80% 70% at 50% 20%,black 0%,transparent 100%)",
        WebkitMaskImage:"radial-gradient(ellipse 80% 70% at 50% 20%,black 0%,transparent 100%)",
      }} className="absolute inset-0"/>
      <div className="absolute top-[60vh] left-0 right-0 h-px"
        style={{background:"linear-gradient(90deg,transparent,rgba(6,182,212,0.2),rgba(99,102,241,0.2),transparent)"}}/>
    </div>
  );
}

// ─── PRISM TEXT ───────────────────────────────────────────────────────────────
function Prism({ children, className="" }) {
  return (
    <span className={className} style={{
      background:"linear-gradient(135deg,#67e8f9 0%,#818cf8 30%,#c084fc 55%,#38bdf8 80%,#67e8f9 100%)",
      backgroundSize:"300% 300%",WebkitBackgroundClip:"text",
      WebkitTextFillColor:"transparent",backgroundClip:"text",animation:"prism 8s ease infinite",
    }}>{children}</span>
  );
}

// ─── GLASS PILL ──────────────────────────────────────────────────────────────
function Pill({ children, glow }) {
  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 backdrop-blur-2xl font-medium ${glow?"shadow-[0_0_24px_rgba(6,182,212,0.2)]":""}`}
      style={{background:"linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))",fontSize:"clamp(11px,1.5vw,14px)"}}>
      {children}
    </div>
  );
}

// ─── STAT TICKER ─────────────────────────────────────────────────────────────
function Stat({ value, label, suffix="" }) {
  const [n, setN] = useState(0);
  const ref = useRef(null);
  const [go, setGo] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if(e.isIntersecting && !go) setGo(true); },{threshold:0.3});
    if(ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  },[go]);
  useEffect(() => {
    if(!go) return;
    let frame; const s=performance.now(); const dur=1800;
    const tick=(now)=>{ const p=Math.min((now-s)/dur,1); const e=1-Math.pow(1-p,4);
      setN(Math.floor(e*value)); if(p<1) frame=requestAnimationFrame(tick); else setN(value); };
    frame=requestAnimationFrame(tick);
    return ()=>cancelAnimationFrame(frame);
  },[go,value]);
  return (
    <div ref={ref} className="text-center py-2">
      <div className="font-black tabular-nums" style={{
        fontSize:"clamp(28px,4.5vw,52px)",
        background:"linear-gradient(180deg,#fff 40%,rgba(255,255,255,0.4))",
        WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"
      }}>{n.toLocaleString()}{suffix}</div>
      <div className="text-zinc-500 font-semibold tracking-widest uppercase mt-1" style={{fontSize:"clamp(9px,1.2vw,11px)"}}>{label}</div>
    </div>
  );
}

// ─── FLOATING PHONE ──────────────────────────────────────────────────────────
function Phone() {
  return (
    <motion.div animate={{y:[0,-16,0]}} transition={{duration:7,repeat:Infinity,ease:"easeInOut"}}
      className="relative mx-auto w-fit">
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[60%] h-6 rounded-full blur-2xl"
        style={{background:"radial-gradient(ellipse,rgba(6,182,212,0.5),transparent)"}}/>
      <div style={{
        width:"clamp(180px,30vw,260px)",
        height:"clamp(360px,60vw,520px)",
        borderRadius:"clamp(30px,5vw,42px)",
        border:"clamp(6px,1vw,10px) solid #1a1a1a",
        boxShadow:"0 50px 100px rgba(0,0,0,0.8),inset 0 0 0 1px rgba(255,255,255,0.06)",
      }} className="relative bg-black overflow-hidden">
        <div className="h-full w-full bg-[#050B18] flex flex-col">
          <div className="flex items-center justify-between px-3 pt-2 pb-1">
            <span className="text-white/60 font-semibold" style={{fontSize:"clamp(7px,1.2vw,10px)"}}>9:41</span>
            <div className="w-12 h-4 rounded-full bg-black"/>
            <div className="flex gap-0.5">
              {[3,2.5,2].map((h,i)=><div key={i} className="w-0.5 rounded-full bg-white/60" style={{height:`${h*3}px`}}/>)}
            </div>
          </div>
          <div className="mx-2 mt-1 rounded-2xl p-3 relative overflow-hidden"
            style={{background:"linear-gradient(135deg,rgba(6,182,212,0.85),rgba(99,102,241,0.85))"}}>
            <div className="absolute inset-0 opacity-20" style={{backgroundImage:"radial-gradient(circle at 80% 20%,white,transparent 50%)"}}/>
            <p className="text-white/70 font-medium" style={{fontSize:"clamp(7px,1.2vw,9px)"}}>Good Morning</p>
            <p className="text-white font-black tracking-tight" style={{fontSize:"clamp(12px,2vw,16px)"}}>AppForge Studio</p>
            <div className="mt-2 flex gap-1.5">
              {["Build","Deploy","Monitor"].map(t=>(
                <div key={t} className="px-2 py-0.5 rounded-full bg-white/20 text-white font-bold"
                  style={{fontSize:"clamp(6px,1vw,8px)"}}>{t}</div>
              ))}
            </div>
          </div>
          <div className="mx-2 mt-2 grid grid-cols-2 gap-1.5">
            {[{l:"Builds",v:"24",c:"#22d3ee"},{l:"Users",v:"1.2K",c:"#818cf8"}].map(m=>(
              <div key={m.l} className="rounded-xl p-2.5" style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.06)"}}>
                <div className="font-bold mb-0.5" style={{color:m.c,fontSize:"clamp(7px,1vw,9px)"}}>{m.l}</div>
                <div className="text-white font-black" style={{fontSize:"clamp(11px,2vw,14px)"}}>{m.v}</div>
              </div>
            ))}
          </div>
          <div className="mx-2 mt-2 rounded-xl p-2.5" style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)"}}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-white/60 font-bold uppercase tracking-widest" style={{fontSize:"clamp(6px,1vw,8px)"}}>AI Build</span>
              <div className="flex gap-0.5">
                {[0,1,2].map(i=>(
                  <motion.div key={i} className="w-1 h-1 rounded-full bg-cyan-400"
                    animate={{opacity:[1,0.2,1],scale:[1,0.6,1]}}
                    transition={{duration:1.2,repeat:Infinity,delay:i*0.2}}/>
                ))}
              </div>
            </div>
            <div className="w-full h-1 rounded-full bg-white/5 overflow-hidden">
              <motion.div className="h-full rounded-full"
                style={{background:"linear-gradient(90deg,#22d3ee,#818cf8)"}}
                animate={{width:["30%","76%","52%","90%"]}}
                transition={{duration:5,repeat:Infinity,ease:"easeInOut"}}/>
            </div>
            <div className="mt-1 text-white/30 font-mono" style={{fontSize:"clamp(6px,0.9vw,8px)"}}>Compiling APK v2.4.1...</div>
          </div>
          <div className="mx-2 mt-2 space-y-1">
            {["Container","ListView","GestureDetector"].map((w,i)=>(
              <div key={i} className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg" style={{background:"rgba(255,255,255,0.03)"}}>
                <div className="w-1 h-1 rounded-full flex-shrink-0"
                  style={{background:i===0?"#22d3ee":i===1?"#818cf8":"#c084fc"}}/>
                <span className="text-white/40 font-mono" style={{fontSize:"clamp(6px,0.9vw,8px)"}}>{w}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── MARQUEE ─────────────────────────────────────────────────────────────────
function Marquee() {
  const items = ["Visual Builder","Dart Generation","Supabase Schemas","Cloud APK Builds","AI Self-Repair","Realtime Preview","One-Click Deploy","Widget Intelligence","State Management","Runtime Diagnostics"];
  const d = [...items,...items,...items];
  return (
    <div className="relative overflow-hidden py-4 border-y" style={{borderColor:"rgba(255,255,255,0.05)",background:"linear-gradient(135deg,rgba(6,182,212,0.03),rgba(99,102,241,0.03))"}}>
      <div className="flex" style={{animation:"marquee 28s linear infinite"}}>
        {d.map((it,i)=>(
          <div key={i} className="flex items-center shrink-0 gap-3 px-6">
            <div className="w-1 h-1 rounded-full bg-cyan-400/60"/>
            <span className="text-zinc-400 font-semibold tracking-[0.18em] uppercase whitespace-nowrap" style={{fontSize:"clamp(9px,1.2vw,11px)"}}>{it}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── MODAL SYSTEM ────────────────────────────────────────────────────────────
const MODAL_CONTENT = {
  about: {
    title: "About AppForge",
    body: (
      <div className="space-y-5 text-zinc-300 leading-relaxed" style={{fontSize:"clamp(13px,1.6vw,15px)"}}>
        <p>AppForge was founded in 2024 by a team of Flutter engineers frustrated by the gap between design tools and production-ready mobile code. We believed that AI could close that gap permanently.</p>
        <p>Today, AppForge powers over <strong className="text-white">12,000 developers</strong> across 80+ countries — from indie hackers shipping side projects to engineering teams at Y Combinator startups.</p>
        <p>Our mission: make production-grade Flutter development accessible to every developer, regardless of experience level.</p>
        <div className="grid grid-cols-2 gap-4 pt-2">
          {[{n:"2024",l:"Founded"},{n:"12K+",l:"Developers"},{n:"180K+",l:"APKs Built"},{n:"80+",l:"Countries"}].map(s=>(
            <div key={s.l} className="rounded-2xl p-4 text-center" style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)"}}>
              <div className="font-black text-white" style={{fontSize:"clamp(22px,3vw,32px)"}}>{s.n}</div>
              <div className="text-zinc-500 text-xs mt-1 uppercase tracking-widest">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  blog: {
    title: "Blog & Updates",
    body: (
      <div className="space-y-4">
        {[
          {date:"May 2026",tag:"Release",title:"AppForge v3.0 — Quantum AI Engine",desc:"Complete rewrite of our code generation pipeline. 4x faster, cleaner architecture output, and new self-repair subsystem."},
          {date:"Apr 2026",tag:"Tutorial",title:"Building a FinTech app in 48 hours",desc:"How Arjun's team shipped a production Flutter banking app using AppForge and Supabase from zero to 50K users."},
          {date:"Mar 2026",tag:"Engineering",title:"How our AI self-repair works",desc:"Deep dive into how AppForge detects RenderFlex overflows, null errors, and build failures in real time."},
          {date:"Feb 2026",tag:"Product",title:"Introducing Cloud APK Builds",desc:"No more local Flutter SDK required. Our distributed build farm compiles and signs your APK in under 5 minutes."},
        ].map((p,i)=>(
          <div key={i} className="rounded-2xl p-4 cursor-pointer hover:border-cyan-500/30 transition-colors" style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)"}}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-cyan-400 font-black tracking-widest uppercase" style={{fontSize:"clamp(8px,1vw,10px)"}}>{p.tag}</span>
              <span className="text-zinc-600" style={{fontSize:"clamp(9px,1.2vw,11px)"}}>· {p.date}</span>
            </div>
            <h3 className="text-white font-bold mb-1" style={{fontSize:"clamp(13px,1.6vw,15px)"}}>{p.title}</h3>
            <p className="text-zinc-400" style={{fontSize:"clamp(11px,1.4vw,13px)"}}>{p.desc}</p>
          </div>
        ))}
      </div>
    ),
  },
  careers: {
    title: "Careers at AppForge",
    body: (
      <div className="space-y-4">
        <p className="text-zinc-400" style={{fontSize:"clamp(13px,1.6vw,15px)"}}>We're a fully remote team building the future of mobile development. We move fast, ship constantly, and care deeply about developer experience.</p>
        {[
          {role:"Senior Flutter Engineer",type:"Full-time · Remote",dept:"Engineering"},
          {role:"AI/ML Research Engineer",type:"Full-time · Remote",dept:"AI"},
          {role:"Developer Advocate",type:"Full-time · Remote",dept:"Growth"},
          {role:"Product Designer",type:"Full-time · Remote",dept:"Design"},
        ].map((j,i)=>(
          <div key={i} className="flex items-center justify-between rounded-2xl p-4" style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)"}}>
            <div>
              <div className="text-white font-bold" style={{fontSize:"clamp(13px,1.6vw,15px)"}}>{j.role}</div>
              <div className="text-zinc-500 text-xs mt-0.5">{j.type} · {j.dept}</div>
            </div>
            <div className="px-4 py-2 rounded-xl font-bold text-sm" style={{background:"rgba(6,182,212,0.1)",color:"#22d3ee",border:"1px solid rgba(6,182,212,0.2)"}}>Apply</div>
          </div>
        ))}
      </div>
    ),
  },
  privacy: {
    title: "Privacy Policy",
    body: (
      <div className="space-y-4 text-zinc-400" style={{fontSize:"clamp(12px,1.5vw,14px)"}}>
        <p><strong className="text-white">Last updated:</strong> May 2026</p>
        <p>AppForge ("we", "us", "our") respects your privacy. This policy describes how we collect, use, and protect your information when you use our platform.</p>
        <h3 className="text-white font-bold mt-4">Data We Collect</h3>
        <p>We collect account information (email, name), usage analytics (features used, build frequency), and project data (your Flutter schemas, generated code). We never sell your data to third parties.</p>
        <h3 className="text-white font-bold mt-4">Supabase Integration</h3>
        <p>When you connect Supabase, we store only the project reference ID and your access token in encrypted form. We never read your actual database contents.</p>
        <h3 className="text-white font-bold mt-4">Data Retention</h3>
        <p>You may delete your account and all associated data at any time from Account Settings. We purge deleted data within 30 days.</p>
        <h3 className="text-white font-bold mt-4">Contact</h3>
        <p>privacy@appforge.dev</p>
      </div>
    ),
  },
  terms: {
    title: "Terms of Service",
    body: (
      <div className="space-y-4 text-zinc-400" style={{fontSize:"clamp(12px,1.5vw,14px)"}}>
        <p><strong className="text-white">Last updated:</strong> May 2026</p>
        <p>By using AppForge, you agree to these terms. Please read them carefully.</p>
        <h3 className="text-white font-bold mt-4">Your Content</h3>
        <p>You own the apps you build with AppForge. The Flutter code generated is yours. We claim no IP ownership over your exported projects.</p>
        <h3 className="text-white font-bold mt-4">Acceptable Use</h3>
        <p>Do not use AppForge to build malware, spyware, or applications designed to harm users. Violation results in immediate account termination.</p>
        <h3 className="text-white font-bold mt-4">Service Availability</h3>
        <p>We target 99% uptime but do not guarantee uninterrupted service. Scheduled maintenance is announced 48 hours in advance.</p>
        <h3 className="text-white font-bold mt-4">Contact</h3>
        <p>legal@appforge.dev</p>
      </div>
    ),
  },
  demo: {
    title: "Watch Demo",
    body: (
      <div className="space-y-5">
        <div className="rounded-2xl overflow-hidden relative" style={{paddingBottom:"56.25%",background:"#000"}}>
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4"
            style={{background:"linear-gradient(135deg,rgba(6,182,212,0.1),rgba(99,102,241,0.1))"}}>
            <div className="w-16 h-16 rounded-full flex items-center justify-center cursor-pointer"
              style={{background:"linear-gradient(135deg,#22d3ee,#818cf8)",boxShadow:"0 0 40px rgba(6,182,212,0.4)"}}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><polygon points="5,3 19,12 5,21"/></svg>
            </div>
            <p className="text-zinc-400 text-sm">90-second product walkthrough</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[{t:"Visual Builder","s":"2:15"},{"t":"AI Code Gen","s":"1:45"},{"t":"Deploy","s":"0:58"}].map((v,i)=>(
            <div key={i} className="rounded-xl p-3 cursor-pointer hover:border-cyan-500/30 transition-colors"
              style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)"}}>
              <div className="w-6 h-6 rounded-lg flex items-center justify-center mb-2"
                style={{background:"rgba(6,182,212,0.15)"}}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="#22d3ee"><polygon points="5,3 19,12 5,21"/></svg>
              </div>
              <div className="text-white font-bold text-xs">{v.t}</div>
              <div className="text-zinc-500 text-xs">{v.s}</div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
};

function Modal({ id, onClose }) {
  const content = MODAL_CONTENT[id];
  if (!content) return null;
  return (
    <AnimatePresence>
      <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
        className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4"
        onClick={onClose}>
        <div className="absolute inset-0" style={{background:"rgba(0,0,0,0.7)",backdropFilter:"blur(12px)"}}/>
        <motion.div initial={{y:"100%",opacity:0}} animate={{y:0,opacity:1}} exit={{y:"100%",opacity:0}}
          transition={{type:"spring",stiffness:260,damping:28}}
          onClick={e=>e.stopPropagation()}
          className="relative z-10 w-full rounded-t-[28px] sm:rounded-[28px] flex flex-col"
          style={{
            maxWidth:"min(580px,100%)",
            maxHeight:"85vh",
            background:"linear-gradient(145deg,rgba(10,15,30,0.98),rgba(5,8,20,0.99))",
            border:"1px solid rgba(255,255,255,0.08)",
            backdropFilter:"blur(40px)",
            boxShadow:"0 -20px 60px rgba(0,0,0,0.5),0 0 0 1px rgba(255,255,255,0.04)",
          }}>
          {/* drag handle on mobile */}
          <div className="flex justify-center pt-3 pb-1 sm:hidden">
            <div className="w-10 h-1 rounded-full bg-white/20"/>
          </div>
          {/* header */}
          <div className="flex items-center justify-between px-6 py-4 border-b shrink-0" style={{borderColor:"rgba(255,255,255,0.06)"}}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px hidden sm:block"
              style={{background:"linear-gradient(90deg,transparent,#22d3ee,#818cf8,transparent)"}}/>
            <h2 className="font-black text-white" style={{fontSize:"clamp(16px,2vw,20px)"}}>{content.title}</h2>
            <button onClick={onClose} className="w-9 h-9 rounded-xl flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
              style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.08)"}}>✕</button>
          </div>
          {/* scrollable body */}
          <div className="flex-1 overflow-y-auto p-6" style={{scrollbarWidth:"thin",scrollbarColor:"#22d3ee40 transparent"}}>
            {content.body}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── MOBILE DRAWER NAV ───────────────────────────────────────────────────────
function Drawer({ open, onClose, onModal, router }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            className="fixed inset-0 z-[60]" style={{background:"rgba(0,0,0,0.6)",backdropFilter:"blur(8px)"}}
            onClick={onClose}/>
          <motion.div initial={{x:"100%"}} animate={{x:0}} exit={{x:"100%"}}
            transition={{type:"spring",stiffness:280,damping:28}}
            className="fixed top-0 right-0 bottom-0 z-[70] flex flex-col"
            style={{
              width:"min(320px,85vw)",
              background:"linear-gradient(145deg,rgba(10,15,30,0.99),rgba(5,8,20,0.99))",
              borderLeft:"1px solid rgba(255,255,255,0.06)",
              backdropFilter:"blur(40px)",
            }}>
            <div className="flex items-center justify-between p-5 border-b shrink-0" style={{borderColor:"rgba(255,255,255,0.05)"}}>
              <div className="flex items-center gap-2.5">
                <LogoMark size={32}/>
                <span className="font-black text-base tracking-tight">AppForge</span>
              </div>
              <button onClick={onClose}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-zinc-400"
                style={{background:"rgba(255,255,255,0.05)"}}>✕</button>
            </div>
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              {[
                {label:"Platform",href:"#platform"},
                {label:"Engine",href:"#engine"},
                {label:"Workflow",href:"#workflow"},
                {label:"Pricing",href:"#pricing"},
              ].map(item=>(
                <a key={item.label} href={item.href} onClick={onClose}
                  className="flex items-center gap-3 px-4 text-zinc-300 font-medium transition-colors hover:text-white rounded-2xl"
                  style={{minHeight:"52px",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.06)"}}>
                  {item.label}
                </a>
              ))}
              <div className="h-px my-2" style={{background:"rgba(255,255,255,0.05)"}}/>
              {[
                {label:"About",modal:"about"},
                {label:"Blog",modal:"blog"},
                {label:"Careers",modal:"careers"},
              ].map(item=>(
                <button key={item.label} onClick={()=>{onModal(item.modal);onClose();}}
                  className="w-full flex items-center gap-3 px-4 text-zinc-400 font-medium transition-colors hover:text-white rounded-2xl text-left"
                  style={{minHeight:"48px",background:"rgba(255,255,255,0.03)"}}>
                  {item.label}
                </button>
              ))}
            </nav>
            <div className="p-4 space-y-3 border-t shrink-0" style={{borderColor:"rgba(255,255,255,0.05)"}}>
              <button onClick={()=>{router.push(ROUTES.auth);onClose();}}
                className="w-full font-medium text-zinc-300 rounded-2xl"
                style={{minHeight:"52px",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)"}}>
                Sign In
              </button>
              <motion.button whileTap={{scale:0.97}}
                onClick={()=>{router.push(ROUTES.auth);onClose();}}
                className="w-full font-bold text-black rounded-2xl"
                style={{minHeight:"52px",background:"linear-gradient(135deg,#22d3ee,#818cf8)",boxShadow:"0 0 30px rgba(6,182,212,0.25)"}}>
                Start Building →
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── LOGO MARK ───────────────────────────────────────────────────────────────
function LogoMark({ size=36 }) {
  return (
    <div className="relative shrink-0" style={{width:size,height:size}}>
      <div className="absolute inset-0 rounded-xl blur-md opacity-60"
        style={{background:"linear-gradient(135deg,#22d3ee,#818cf8)"}}/>
      <div className="relative w-full h-full rounded-xl flex items-center justify-center"
        style={{background:"linear-gradient(135deg,rgba(6,182,212,0.3),rgba(99,102,241,0.3))",border:"1px solid rgba(255,255,255,0.15)"}}>
        <svg width={size*0.44} height={size*0.44} viewBox="0 0 18 18" fill="none">
          <path d="M3 9L9 3L15 9L9 15L3 9Z" fill="url(#lg)"/>
          <path d="M9 6L12 9L9 12L6 9L9 6Z" fill="rgba(3,7,18,0.8)"/>
          <defs><linearGradient id="lg" x1="0" y1="0" x2="18" y2="18">
            <stop stopColor="#22d3ee"/><stop offset="1" stopColor="#818cf8"/>
          </linearGradient></defs>
        </svg>
      </div>
    </div>
  );
}

// ─── FEATURE TABS ─────────────────────────────────────────────────────────────
function FeatureTabs({ router }) {
  const [active, setActive] = useState(0);
  const tabs = [
    {
      label:"Builder",icon:"◈",color:"#22d3ee",
      headline:"Design with spatial precision",
      body:"Drag, compose, and configure Flutter widgets in a spatial canvas that mirrors real device physics. Every snap, padding, and constraint — exported as architecture-grade Dart.",
      cta:"Open Builder",ctaRoute:ROUTES.builder,
      visual:(
        <div className="grid grid-cols-3 gap-2 p-4">
          {["Container","Row","Column","Stack","Scaffold","ListView","Gesture","AnimBuilder","FutureBuilder"].map((w,i)=>(
            <motion.div key={w} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:i*0.04}}
              className="aspect-square rounded-xl flex flex-col items-center justify-center text-center p-1.5 cursor-pointer"
              style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.06)"}}
              whileTap={{scale:0.94}}>
              <div className="text-sm mb-1 opacity-50">⬡</div>
              <span className="text-zinc-400 font-mono" style={{fontSize:"clamp(7px,1vw,9px)"}}>{w}</span>
            </motion.div>
          ))}
        </div>
      ),
    },
    {
      label:"AI Code",icon:"⟡",color:"#818cf8",
      headline:"Architecture, not scaffolding",
      body:"Production Dart following clean architecture — BLoC, Repository, Dependency Injection. Real patterns, real performance, real maintainability from day one.",
      cta:"Try Code Engine",ctaRoute:ROUTES.builder,
      visual:(
        <div className="p-4 font-mono space-y-1 text-left" style={{fontSize:"clamp(8px,1.2vw,11px)"}}>
          {[
            {t:"class",v:" DashboardBloc",c:"#818cf8"},
            {t:"  extends",v:" Bloc<Event,State>",c:"#22d3ee"},
            {t:" {",v:"",c:"#fff"},
            {t:"  final",v:" DashboardRepo _repo;",c:"#c084fc"},
            {t:"",v:"",c:""},
            {t:"  DashboardBloc(",v:"this._repo)",c:"#fff"},
            {t:"    : super(",v:"Initial()) {",c:"#22d3ee"},
            {t:"    on<Fetch>(",v:"_onFetch);",c:"#fff"},
            {t:"  }",v:"",c:"#fff"},
          ].map((line,i)=>(
            <div key={i} className="flex">
              <span className="text-zinc-700 w-5 shrink-0 select-none">{i+1}</span>
              <span style={{color:line.c||"#94a3b8"}}>{line.t}</span>
              <span className="text-zinc-300">{line.v}</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      label:"Backend",icon:"◬",color:"#c084fc",
      headline:"Supabase, automated completely",
      body:"Describe your data model in plain language. AppForge generates Supabase tables, RLS policies, Edge Functions, and typed SDK — in seconds.",
      cta:"View Dashboard",ctaRoute:ROUTES.dashboard,
      visual:(
        <div className="p-4 space-y-2">
          {[
            {table:"users",cols:["id","email","avatar"],color:"#22d3ee"},
            {table:"projects",cols:["id","name","owner_id"],color:"#818cf8"},
            {table:"builds",cols:["id","apk_url","status"],color:"#c084fc"},
          ].map(t=>(
            <div key={t.table} className="rounded-xl overflow-hidden border" style={{borderColor:`${t.color}22`}}>
              <div className="px-3 py-1.5 font-black tracking-widest uppercase" style={{background:`${t.color}12`,color:t.color,fontSize:"clamp(8px,1vw,10px)"}}>{t.table}</div>
              <div className="flex">
                {t.cols.map(c=>(
                  <div key={c} className="px-2.5 py-1.5 text-zinc-400 font-mono border-r last:border-0" style={{borderColor:"rgba(255,255,255,0.04)",fontSize:"clamp(7px,1vw,9px)"}}>{c}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      label:"AI Repair",icon:"⟳",color:"#f472b6",
      headline:"Errors fixed before you blink",
      body:"AppForge watches your Flutter runtime and patches layout overflows, null errors, and build failures autonomously — with explanations you can learn from.",
      cta:"See It Live",ctaRoute:ROUTES.builder,
      visual:(
        <div className="p-4 space-y-2">
          {[
            {type:"OVERFLOW",msg:"RenderFlex overflowed 32px",fix:"Wrapped with Expanded()",color:"#f472b6"},
            {type:"NULL",msg:"Null check on nullable type",fix:"Added null-safe guard",color:"#fb923c"},
            {type:"BUILD",msg:"Missing pubspec dependency",fix:"Auto-added http: ^1.2.0",color:"#22d3ee"},
          ].map((e,i)=>(
            <motion.div key={i} initial={{x:-16,opacity:0}} animate={{x:0,opacity:1}} transition={{delay:i*0.12}}
              className="rounded-xl p-3 flex items-start gap-2.5" style={{background:`${e.color}08`,border:`1px solid ${e.color}20`}}>
              <div className="w-5 h-5 rounded-full flex items-center justify-center font-black shrink-0" style={{background:`${e.color}18`,color:e.color,fontSize:"9px"}}>✓</div>
              <div className="flex-1 min-w-0">
                <div className="font-black tracking-widest mb-0.5" style={{color:e.color,fontSize:"clamp(7px,1vw,9px)"}}>{e.type}</div>
                <div className="text-white/55 font-mono truncate" style={{fontSize:"clamp(9px,1.2vw,11px)"}}>{e.msg}</div>
                <div className="text-white/25 mt-0.5" style={{fontSize:"clamp(8px,1vw,10px)"}}>→ {e.fix}</div>
              </div>
            </motion.div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div className="w-full">
      {/* Tabs — scrollable on narrow screens */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-1 -mx-4 px-4" style={{scrollbarWidth:"none",msOverflowStyle:"none"}}>
        {tabs.map((t,i)=>(
          <button key={i} onClick={()=>setActive(i)}
            className="flex items-center gap-2 px-4 rounded-2xl font-semibold shrink-0 transition-all duration-200"
            style={{
              minHeight:"44px",fontSize:"clamp(11px,1.5vw,13px)",
              background:active===i?`${t.color}15`:"rgba(255,255,255,0.04)",
              border:`1px solid ${active===i?t.color+"50":"rgba(255,255,255,0.08)"}`,
              color:active===i?t.color:"#71717a",
            }}>
            <span>{t.icon}</span>{t.label}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={active}
          initial={{opacity:0,y:16,filter:"blur(8px)"}}
          animate={{opacity:1,y:0,filter:"blur(0px)"}}
          exit={{opacity:0,y:-16,filter:"blur(8px)"}}
          transition={{duration:0.35,ease:[0.16,1,0.3,1]}}>
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="font-black tracking-[0.25em] uppercase mb-3" style={{color:tabs[active].color,fontSize:"clamp(9px,1.2vw,11px)"}}>
                {tabs[active].icon} {tabs[active].label}
              </div>
              <h3 className="font-black tracking-[-0.04em] leading-[1.05] mb-4 text-white"
                style={{fontSize:"clamp(22px,3.5vw,44px)"}}>{tabs[active].headline}</h3>
              <p className="text-zinc-400 leading-relaxed" style={{fontSize:"clamp(13px,1.6vw,16px)"}}>{tabs[active].body}</p>
              <motion.button whileTap={{scale:0.97}}
                onClick={()=>router.push(tabs[active].ctaRoute)}
                className="mt-7 inline-flex items-center gap-2 font-bold rounded-xl px-6"
                style={{
                  minHeight:"48px",fontSize:"clamp(12px,1.5vw,14px)",
                  background:`${tabs[active].color}15`,
                  border:`1px solid ${tabs[active].color}40`,
                  color:tabs[active].color,
                }}>
                {tabs[active].cta} →
              </motion.button>
            </div>
            <div className="rounded-[20px] overflow-hidden border" style={{
              borderColor:`${tabs[active].color}20`,
              background:"linear-gradient(135deg,rgba(255,255,255,0.04),rgba(0,0,0,0.4))",
              boxShadow:`0 0 40px ${tabs[active].color}10`,
            }}>
              {tabs[active].visual}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─── PRICING CARD ─────────────────────────────────────────────────────────────
function PricingCard({ tier, price, period, desc, features, cta, featured, onCta }) {
  return (
    <motion.div whileTap={{scale:0.98}}
      className="relative rounded-[28px] flex flex-col overflow-hidden"
      style={{
        padding:"clamp(20px,3vw,32px)",
        background:featured
          ?"linear-gradient(145deg,rgba(6,182,212,0.1),rgba(99,102,241,0.08),rgba(0,0,0,0.5))"
          :"linear-gradient(145deg,rgba(255,255,255,0.04),rgba(0,0,0,0.3))",
        border:featured?"1px solid rgba(6,182,212,0.3)":"1px solid rgba(255,255,255,0.07)",
        backdropFilter:"blur(24px)",
        boxShadow:featured
          ?"0 0 60px rgba(6,182,212,0.1),0 40px 80px rgba(0,0,0,0.4),inset 0 1px 0 rgba(255,255,255,0.1)"
          :"0 30px 60px rgba(0,0,0,0.35),inset 0 1px 0 rgba(255,255,255,0.04)",
      }}>
      {featured && (
        <>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px"
            style={{background:"linear-gradient(90deg,transparent,#22d3ee,#818cf8,transparent)"}}/>
          <div className="absolute right-5" style={{top:"clamp(-14px,-2vw,-10px)"}}>
            <div className="px-3 py-1 rounded-full font-black tracking-widest uppercase text-black"
              style={{fontSize:"clamp(8px,1vw,10px)",background:"linear-gradient(90deg,#22d3ee,#818cf8)"}}>
              Most Popular
            </div>
          </div>
        </>
      )}
      <div className="mb-5">
        <div className="font-black tracking-[0.3em] uppercase text-zinc-500 mb-2" style={{fontSize:"clamp(8px,1vw,10px)"}}>{tier}</div>
        <div className="flex items-end gap-1.5 mb-2">
          <span className="font-black tracking-[-0.05em]" style={{
            fontSize:"clamp(36px,6vw,56px)",
            background:featured?"linear-gradient(135deg,#67e8f9,#818cf8)":"linear-gradient(180deg,#fff,rgba(255,255,255,0.6))",
            WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",
          }}>{price}</span>
          <span className="text-zinc-500 text-sm mb-2">{period}</span>
        </div>
        <p className="text-zinc-400 text-sm leading-relaxed">{desc}</p>
      </div>
      <div className="flex-1 space-y-2.5 mb-6">
        {features.map((f,i)=>(
          <div key={i} className="flex items-center gap-2.5">
            <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
              style={{background:featured?"rgba(6,182,212,0.15)":"rgba(255,255,255,0.05)"}}>
              <span style={{fontSize:"9px",color:featured?"#22d3ee":"#71717a"}}>✓</span>
            </div>
            <span className="text-zinc-300" style={{fontSize:"clamp(12px,1.5vw,14px)"}}>{f}</span>
          </div>
        ))}
      </div>
      <motion.button whileTap={{scale:0.97}} onClick={onCta}
        className="w-full rounded-2xl font-bold tracking-wide"
        style={{
          minHeight:"52px",fontSize:"clamp(13px,1.6vw,15px)",
          ...(featured
            ?{background:"linear-gradient(135deg,#22d3ee,#818cf8)",color:"#000",boxShadow:"0 0 30px rgba(6,182,212,0.25)"}
            :{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",color:"#fff"}),
        }}>
        {cta}
      </motion.button>
    </motion.div>
  );
}

// ─── WORKFLOW STEP ────────────────────────────────────────────────────────────
function Step({ num, title, desc, color, last }) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className="rounded-xl flex items-center justify-center font-black shrink-0"
          style={{width:"clamp(36px,5vw,44px)",height:"clamp(36px,5vw,44px)",
            fontSize:"clamp(11px,1.4vw,14px)",
            background:`${color}15`,border:`1px solid ${color}40`,color}}>
          {num}
        </div>
        {!last&&<div className="flex-1 w-px mt-2 min-h-[28px]" style={{background:`linear-gradient(${color}30,transparent)`}}/>}
      </div>
      <div className="pb-8">
        <h3 className="font-bold text-white mb-1.5" style={{fontSize:"clamp(15px,2vw,20px)"}}>{title}</h3>
        <p className="text-zinc-400 leading-relaxed" style={{fontSize:"clamp(12px,1.5vw,15px)"}}>{desc}</p>
      </div>
    </div>
  );
}

// ─── TOAST ───────────────────────────────────────────────────────────────────
function Toast({ msg, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 3000); return () => clearTimeout(t); }, [onDone]);
  return (
    <motion.div initial={{y:80,opacity:0}} animate={{y:0,opacity:1}} exit={{y:80,opacity:0}}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[300] px-5 py-3 rounded-2xl font-semibold text-white text-sm"
      style={{background:"linear-gradient(135deg,rgba(6,182,212,0.2),rgba(99,102,241,0.2))",
        border:"1px solid rgba(6,182,212,0.3)",backdropFilter:"blur(20px)",
        boxShadow:"0 10px 40px rgba(0,0,0,0.4)"}}>
      {msg}
    </motion.div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function AppForgeLanding() {
  const router = useRouter();
  const isTouch = useIsTouch();
  const vw = useVW();
  const { scrollYProgress } = useScroll();
  const progressWidth = useTransform(scrollYProgress,[0,1],["0%","100%"]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null);

  const go = useCallback((route) => router.push(route), [router]);
  const showToast = useCallback((msg) => setToast(msg), []);

  // Lock scroll when modal/drawer open
  useEffect(() => {
    document.body.style.overflow = (modal || drawerOpen) ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [modal, drawerOpen]);

  return (
    <div className={`bg-[#030712] text-white min-h-screen overflow-x-hidden selection:bg-cyan-500/20 selection:text-cyan-200 ${!isTouch?"cursor-none":""}`}>
      <MagneticCursor isTouch={isTouch}/>
      <Noise/>
      <Orbs/>
      <Grid/>

      {/* Modals */}
      <AnimatePresence>{modal && <Modal id={modal} onClose={()=>setModal(null)}/>}</AnimatePresence>

      {/* Drawer */}
      <Drawer open={drawerOpen} onClose={()=>setDrawerOpen(false)} onModal={setModal} router={router}/>

      {/* Toast */}
      <AnimatePresence>{toast && <Toast msg={toast} onDone={()=>setToast(null)}/>}</AnimatePresence>

      {/* Scroll progress bar */}
      <motion.div className="fixed top-0 left-0 z-[100] h-[2px]"
        style={{width:progressWidth,background:"linear-gradient(90deg,#22d3ee,#818cf8,#c084fc)"}}/>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,700;12..96,800;12..96,900&family=JetBrains+Mono:wght@400;700&display=swap');
        *{font-family:'Bricolage Grotesque',sans-serif;box-sizing:border-box;}
        .font-mono,.jb{font-family:'JetBrains Mono',monospace!important;}
        @keyframes prism{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
        @keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-33.333%)}}
        @keyframes pr{0%{transform:scale(0.8);opacity:1}100%{transform:scale(2.2);opacity:0}}
        .pulse-r::after{content:'';position:absolute;inset:0;border-radius:50%;border:1px solid #22d3ee;animation:pr 2s ease-out infinite;}
        html{scroll-behavior:smooth;-webkit-tap-highlight-color:transparent;}
        body{padding-top:env(safe-area-inset-top);padding-bottom:env(safe-area-inset-bottom);}
        button,a{-webkit-tap-highlight-color:transparent;touch-action:manipulation;}
        ::-webkit-scrollbar{width:2px;}
        ::-webkit-scrollbar-track{background:#030712;}
        ::-webkit-scrollbar-thumb{background:#22d3ee40;border-radius:99px;}
        [style*="overflow-x:auto"]::-webkit-scrollbar,[style*="-ms-overflow-style"]::-webkit-scrollbar{display:none;}
      `}</style>

      {/* ── NAVBAR ──────────────────────────────────────────────────────────── */}
      <motion.header initial={{y:-80,opacity:0}} animate={{y:0,opacity:1}}
        transition={{duration:0.8,ease:[0.16,1,0.3,1]}}
        className="sticky top-0 z-50"
        style={{borderBottom:"1px solid rgba(255,255,255,0.04)",backdropFilter:"blur(40px)",background:"rgba(3,7,18,0.72)"}}>
        <div className="max-w-[1400px] mx-auto flex items-center justify-between"
          style={{height:"clamp(56px,8vw,72px)",paddingLeft:"clamp(16px,4vw,32px)",paddingRight:"clamp(16px,4vw,32px)"}}>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <LogoMark size={vw>768?38:32}/>
            <div>
              <div className="font-black tracking-tight leading-none" style={{fontSize:"clamp(14px,2vw,18px)"}}>AppForge</div>
              <div className="text-zinc-500 tracking-[0.18em] uppercase leading-none mt-0.5 hidden sm:block" style={{fontSize:"clamp(8px,1vw,10px)"}}>Flutter Intelligence</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8 text-zinc-400" style={{fontSize:"clamp(12px,1.5vw,14px)"}}>
            {["Platform","Engine","Workflow","Pricing"].map(item=>(
              <a key={item} href={`#${item.toLowerCase()}`} data-cur={item}
                className="hover:text-white transition-colors duration-200 relative group py-2">
                {item}
                <div className="absolute -bottom-0.5 left-0 w-0 h-px group-hover:w-full transition-all duration-300"
                  style={{background:"linear-gradient(90deg,#22d3ee,#818cf8)"}}/>
              </a>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <button data-cur="Login" onClick={()=>go(ROUTES.auth)}
              className="text-zinc-400 hover:text-white transition-colors px-5 rounded-xl"
              style={{height:"clamp(36px,5vw,42px)",fontSize:"clamp(12px,1.5vw,14px)"}}>
              Sign in
            </button>
            <motion.button whileHover={{scale:1.04}} whileTap={{scale:0.97}} data-cur="Start"
              onClick={()=>go(ROUTES.auth)}
              className="font-bold text-black rounded-xl px-5"
              style={{height:"clamp(36px,5vw,42px)",fontSize:"clamp(12px,1.5vw,14px)",
                background:"linear-gradient(135deg,#22d3ee,#818cf8)",boxShadow:"0 0 25px rgba(6,182,212,0.3)"}}>
              Start Building
            </motion.button>
          </div>

          {/* Mobile hamburger */}
          <button onClick={()=>setDrawerOpen(true)}
            className="md:hidden flex flex-col justify-center items-center gap-1.5 rounded-xl"
            style={{width:"44px",height:"44px",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.08)"}}
            aria-label="Open menu">
            {[0,1,2].map(i=><div key={i} className="w-5 h-0.5 rounded-full bg-zinc-300"/>)}
          </button>
        </div>
      </motion.header>

      {/* ── HERO ────────────────────────────────────────────────────────────── */}
      
      <section className="relative max-w-[1400px] mx-auto"
        style={{paddingLeft:"clamp(16px,4vw,32px)",paddingRight:"clamp(16px,4vw,32px)",
          paddingTop:"clamp(48px,8vw,96px)",paddingBottom:"clamp(48px,8vw,96px)"}}>

        <div className="flex flex-col lg:grid items-center gap-10"
          style={{gridTemplateColumns:"1fr clamp(180px,30vw,320px)"}}>

          {/* Phone — top on mobile */}
          <motion.div initial={{opacity:0,y:24}} animate={{opacity:1,y:0}}
            transition={{delay:0.15,duration:0.9,ease:[0.16,1,0.3,1]}}
            className="flex justify-center lg:order-2">
            <Phone/>
          </motion.div>

          {/* Text */}
          <div className="lg:order-1 text-center lg:text-left">
            <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.05}}>
              <Pill glow>
                <div className="relative w-2 h-2 pulse-r">
                  <div className="w-2 h-2 rounded-full bg-cyan-400"/>
                </div>
                <span className="text-zinc-300">AI-Native Flutter Platform — v3.0 Live</span>
              </Pill>
            </motion.div>

            <motion.h1 initial={{opacity:0,y:32,filter:"blur(16px)"}} animate={{opacity:1,y:0,filter:"blur(0px)"}}
              transition={{delay:0.18,duration:0.9,ease:[0.16,1,0.3,1]}}
              className="mt-6 font-black leading-[0.9] tracking-[-0.05em]"
              style={{fontSize:"clamp(38px,9vw,110px)"}}>
              Ship apps<br/><Prism>ten times</Prism><br/><span className="text-white">faster.</span>
            </motion.h1>

            <motion.p initial={{opacity:0,y:16}} animate={{opacity:1,y:0}}
              transition={{delay:0.3,duration:0.7}}
              className="mt-5 text-zinc-400 leading-relaxed max-w-xl mx-auto lg:mx-0"
              style={{fontSize:"clamp(14px,1.8vw,18px)"}}>
              AppForge transforms visual intent into production Flutter architecture. Autonomous AI workflows, Supabase automation, cloud builds, and self-healing runtime — from idea to APK in minutes.
            </motion.p>

            {/* CTAs */}
            <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}}
              transition={{delay:0.4}}
              className="mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <motion.button whileTap={{scale:0.97}} onClick={()=>go(ROUTES.auth)}
                className="w-full sm:w-auto font-bold text-black flex items-center justify-center gap-2 rounded-2xl"
                style={{minHeight:"clamp(48px,6vw,56px)",paddingLeft:"clamp(20px,3vw,32px)",paddingRight:"clamp(20px,3vw,32px)",
                  fontSize:"clamp(13px,1.6vw,16px)",
                  background:"linear-gradient(135deg,#22d3ee 0%,#818cf8 100%)",
                  boxShadow:"0 0 40px rgba(6,182,212,0.3)"}}>
                Launch Builder →
              </motion.button>
              <motion.button whileTap={{scale:0.97}} onClick={()=>setModal("demo")}
                className="w-full sm:w-auto flex items-center justify-center gap-2 text-zinc-300 font-medium rounded-2xl"
                style={{minHeight:"clamp(48px,6vw,56px)",paddingLeft:"clamp(20px,3vw,32px)",paddingRight:"clamp(20px,3vw,32px)",
                  fontSize:"clamp(13px,1.6vw,16px)",
                  background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",backdropFilter:"blur(20px)"}}>
                <span className="w-7 h-7 rounded-full flex items-center justify-center" style={{background:"rgba(255,255,255,0.08)"}}>▶</span>
                Watch Demo
              </motion.button>
            </motion.div>

            {/* Social proof */}
            <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.55}}
              className="mt-8 flex flex-wrap items-center gap-4 justify-center lg:justify-start">
              <div className="flex -space-x-2">
                {["#22d3ee","#818cf8","#c084fc","#f472b6","#fb923c"].map((c,i)=>(
                  <div key={i} className="rounded-full border-2 border-[#030712]"
                    style={{width:"clamp(26px,3.5vw,32px)",height:"clamp(26px,3.5vw,32px)",
                      background:`radial-gradient(circle at 30% 30%,white,${c})`}}/>
                ))}
              </div>
              <span className="text-zinc-400" style={{fontSize:"clamp(12px,1.5vw,14px)"}}>
                <span className="text-white font-bold">12,000+</span> devs shipping production apps
              </span>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_,i)=><span key={i} style={{color:"#f59e0b",fontSize:"11px"}}>★</span>)}
                <span className="text-zinc-400 ml-1" style={{fontSize:"clamp(10px,1.3vw,12px)"}}>4.9/5</span>
              </div>
            </motion.div>
          </div>
        </div>

<a href="https://tools.launchllama.co?utm_source=badge&utm_medium=referral" target="_blank" rel="noopener noreferrer"><img src="https://speaktechenglish.com/wp-content/uploads/2026/04/Screenshot_2026-04-09_at_17.40.44-removebg-preview.png" alt="Featured on Launch Llama" width="200" height="50" /></a>

        {/* Scroll hint */}
        <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1.1}}
          className="flex flex-col items-center gap-2 mt-14">
          <span className="text-zinc-600 tracking-[0.3em] uppercase" style={{fontSize:"clamp(8px,1vw,10px)"}}>Scroll</span>
          <motion.div animate={{y:[0,8,0]}} transition={{duration:1.5,repeat:Infinity}}
            className="w-px h-7" style={{background:"linear-gradient(#22d3ee,transparent)"}}/>
        </motion.div>
      </section>

      {/* ── MARQUEE ─────────────────────────────────────────────────────────── */}
      <Marquee/>

      {/* ── STATS ───────────────────────────────────────────────────────────── */}
      <section className="max-w-[1400px] mx-auto"
        style={{paddingLeft:"clamp(16px,4vw,32px)",paddingRight:"clamp(16px,4vw,32px)",
          paddingTop:"clamp(40px,6vw,80px)",paddingBottom:"clamp(40px,6vw,80px)"}}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 md:divide-x" style={{borderColor:"rgba(255,255,255,0.06)"}}>
          <div className="md:px-8"><Stat value={12000} label="Active Developers" suffix="+"/></div>
          <div className="md:px-8"><Stat value={180000} label="APKs Generated" suffix="+"/></div>
          <div className="md:px-8"><Stat value={99} label="Uptime SLA" suffix="%"/></div>
          <div className="md:px-8"><Stat value={4} label="Minutes to APK"/></div>
        </div>
      </section>

      {/* ── PLATFORM ────────────────────────────────────────────────────────── */}
      <section id="platform" className="max-w-[1400px] mx-auto"
        style={{paddingLeft:"clamp(16px,4vw,32px)",paddingRight:"clamp(16px,4vw,32px)",
          paddingTop:"clamp(48px,7vw,96px)",paddingBottom:"clamp(48px,7vw,96px)"}}>
        <div className="text-center mb-12">
          <Pill><span className="text-cyan-400 text-xs">◈</span><span className="text-zinc-300">Platform</span></Pill>
          <h2 className="mt-5 font-black tracking-[-0.05em] leading-[0.92]"
            style={{fontSize:"clamp(28px,5.5vw,72px)"}}>
            Every tool you need.<br/><Prism>Nothing you don't.</Prism>
          </h2>
        </div>
        {/* Fluid auto-fit grid — 1 col xs, 2 col sm, 3 col lg */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(260px,100%),1fr))",gap:"clamp(12px,2vw,20px)"}}>
          {[
            {icon:"⟡",color:"#22d3ee",title:"AI Visual Builder",desc:"Compose Flutter widget trees visually. Every placement, constraint exported as production-grade Dart with BLoC architecture.",tag:"Core",route:ROUTES.builder},
            {icon:"⬡",color:"#818cf8",title:"Production Dart",desc:"Clean architecture by default. BLoC, Repository, Dependency Injection. 0 lint warnings. Test-ready, CI-compatible.",tag:"Code",route:ROUTES.builder},
            {icon:"◬",color:"#c084fc",title:"Supabase Automation",desc:"Full schema generation, RLS policies, Edge Functions, typed TypeScript SDK — automatically in seconds.",tag:"Backend",route:ROUTES.dashboard},
            {icon:"⟳",color:"#f472b6",title:"AI Self-Repair",desc:"Runtime errors detected, diagnosed, and patched autonomously. Layout overflows, null errors, build failures — handled silently.",tag:"AI",route:ROUTES.builder},
            {icon:"▲",color:"#fb923c",title:"Cloud APK Builds",desc:"Distributed build farm. No local Flutter SDK needed. Production APKs compiled and signed in under 5 minutes.",tag:"Deploy",route:ROUTES.dashboard},
            {icon:"◆",color:"#22c55e",title:"Live Device Preview",desc:"Changes render on connected devices in under 200ms. Real physics, real layouts, real performance — no refresh needed.",tag:"Preview",route:ROUTES.builder},
          ].map((card,i)=>(
            <motion.div key={i}
              initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}}
              transition={{delay:i*0.07,duration:0.5}} viewport={{once:true}}
              whileTap={{scale:0.98}}
              onClick={()=>go(card.route)}
              className="rounded-[24px] flex flex-col cursor-pointer"
              style={{
                padding:"clamp(16px,2.5vw,24px)",
                background:"linear-gradient(145deg,rgba(255,255,255,0.04),rgba(0,0,0,0.3))",
                border:"1px solid rgba(255,255,255,0.07)",backdropFilter:"blur(20px)",
              }}>
              <div className="flex items-start justify-between mb-4">
                <div className="rounded-xl flex items-center justify-center text-lg"
                  style={{width:"clamp(36px,5vw,44px)",height:"clamp(36px,5vw,44px)",
                    background:`${card.color}12`,border:`1px solid ${card.color}25`,color:card.color}}>
                  {card.icon}
                </div>
                <div className="px-2.5 py-1 rounded-full font-black tracking-widest uppercase"
                  style={{fontSize:"clamp(7px,1vw,9px)",background:`${card.color}12`,color:card.color}}>
                  {card.tag}
                </div>
              </div>
              <h3 className="font-black mb-2 leading-tight" style={{fontSize:"clamp(15px,2vw,20px)"}}>{card.title}</h3>
              <p className="text-zinc-400 leading-relaxed flex-1" style={{fontSize:"clamp(12px,1.5vw,14px)"}}>{card.desc}</p>
              <div className="mt-4 font-semibold" style={{fontSize:"clamp(11px,1.3vw,13px)",color:card.color}}>Explore →</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── ENGINE (Feature Tabs) ────────────────────────────────────────────── */}
      <section id="engine" className="max-w-[1400px] mx-auto"
        style={{paddingLeft:"clamp(16px,4vw,32px)",paddingRight:"clamp(16px,4vw,32px)",
          paddingTop:"clamp(48px,7vw,96px)",paddingBottom:"clamp(48px,7vw,96px)"}}>
        <div className="text-center mb-10">
          <Pill><span className="text-indigo-400 text-xs">⟡</span><span className="text-zinc-300">Deep Platform</span></Pill>
          <h2 className="mt-5 font-black tracking-[-0.05em] leading-[0.92]"
            style={{fontSize:"clamp(24px,4.5vw,64px)"}}>
            Every feature is <Prism>world-class.</Prism>
          </h2>
        </div>
        <FeatureTabs router={router}/>
      </section>

      {/* ── WORKFLOW ────────────────────────────────────────────────────────── */}
      <section id="workflow" className="relative overflow-hidden"
        style={{paddingTop:"clamp(48px,7vw,96px)",paddingBottom:"clamp(48px,7vw,96px)"}}>
        <div className="absolute inset-0 pointer-events-none"
          style={{background:"radial-gradient(ellipse 80% 50% at 50% 50%,rgba(6,182,212,0.03),transparent)"}}/>
        <div className="relative max-w-[1400px] mx-auto"
          style={{paddingLeft:"clamp(16px,4vw,32px)",paddingRight:"clamp(16px,4vw,32px)"}}>
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            <div>
              <Pill><span className="text-cyan-400 text-xs">→</span><span className="text-zinc-300">End-to-End Workflow</span></Pill>
              <h2 className="mt-5 font-black tracking-[-0.05em] leading-[0.92] mb-10"
                style={{fontSize:"clamp(24px,4.5vw,56px)"}}>
                From idea to<br/><Prism>deployed app</Prism><br/>in one session.
              </h2>
              {[
                {num:"01",title:"Design in the Canvas",desc:"Compose Flutter widget trees visually. Live-previewed on your target device as you build.",color:"#22d3ee"},
                {num:"02",title:"Generate Production Dart",desc:"One click exports clean BLoC-architecture Dart. Production-grade files organized for real teams.",color:"#818cf8"},
                {num:"03",title:"Automate Your Backend",desc:"Describe your data. AppForge generates Supabase tables, RLS policies, typed APIs automatically.",color:"#c084fc"},
                {num:"04",title:"Build & Deploy",desc:"Trigger a cloud APK build from your dashboard. Distributed builds complete in under 5 minutes.",color:"#f472b6",last:true},
              ].map((s,i)=><Step key={i} {...s}/>)}
              <motion.button whileTap={{scale:0.97}} onClick={()=>go(ROUTES.builder)}
                className="font-bold text-black rounded-2xl"
                style={{minHeight:"52px",paddingLeft:"clamp(20px,3vw,28px)",paddingRight:"clamp(20px,3vw,28px)",
                  fontSize:"clamp(13px,1.6vw,15px)",
                  background:"linear-gradient(135deg,#22d3ee,#818cf8)",
                  boxShadow:"0 0 30px rgba(6,182,212,0.25)"}}>
                Open the Builder →
              </motion.button>
            </div>

            {/* Terminal */}
            <div className="hidden md:block lg:sticky lg:top-24">
              <div className="rounded-[24px] overflow-hidden border border-white/[0.07]"
                style={{background:"linear-gradient(145deg,rgba(10,15,30,0.9),rgba(5,8,20,0.95))",
                  backdropFilter:"blur(40px)",boxShadow:"0 50px 100px rgba(0,0,0,0.6),inset 0 1px 0 rgba(255,255,255,0.05)"}}>
                <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/[0.05]">
                  {["#ef4444","#f59e0b","#22c55e"].map(c=><div key={c} className="w-2.5 h-2.5 rounded-full" style={{background:c}}/>)}
                  <span className="text-zinc-500 font-mono ml-3" style={{fontSize:"clamp(9px,1.2vw,11px)"}}>appforge — cloud build v3.0</span>
                </div>
                <div className="p-5 font-mono space-y-1.5" style={{fontSize:"clamp(9px,1.2vw,11px)",minHeight:"clamp(240px,30vw,360px)"}}>
                  {[
                    {t:0,text:"$ appforge build --release",c:"#22d3ee"},
                    {t:0.4,text:"▸ Analyzing widget tree...",c:"#94a3b8"},
                    {t:0.8,text:"  ✓ 247 widgets optimized",c:"#22c55e"},
                    {t:1.2,text:"▸ Generating Dart architecture...",c:"#94a3b8"},
                    {t:1.6,text:"  ✓ BLoC pattern applied",c:"#22c55e"},
                    {t:2.0,text:"▸ Provisioning Supabase...",c:"#94a3b8"},
                    {t:2.4,text:"  ✓ 4 tables • 12 RLS policies",c:"#22c55e"},
                    {t:2.8,text:"▸ Uploading to build farm...",c:"#94a3b8"},
                    {t:3.2,text:"  ✓ Worker pool: 16 nodes",c:"#22c55e"},
                    {t:3.6,text:"▸ Compiling release APK...",c:"#f59e0b"},
                    {t:5.0,text:"  ✓ Build complete (3m 47s)",c:"#22c55e"},
                    {t:5.4,text:"  ✓ Signed • Optimized • 14.2 MB",c:"#22c55e"},
                    {t:5.8,text:"$ Download: cdn.appforge.dev/build/...",c:"#818cf8"},
                  ].map((line,i)=>(
                    <motion.div key={i} initial={{opacity:0,x:-8}} animate={{opacity:1,x:0}}
                      transition={{delay:line.t*0.22,duration:0.3}} style={{color:line.c}}>
                      {line.text}
                    </motion.div>
                  ))}
                  <motion.span animate={{opacity:[1,0,1]}} transition={{duration:1,repeat:Infinity}}
                    className="inline-block w-2 h-4 bg-cyan-400"/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ────────────────────────────────────────────────────── */}
      <section className="max-w-[1400px] mx-auto"
        style={{paddingLeft:"clamp(16px,4vw,32px)",paddingRight:"clamp(16px,4vw,32px)",
          paddingTop:"clamp(40px,6vw,80px)",paddingBottom:"clamp(40px,6vw,80px)"}}>
        <div className="text-center mb-10">
          <h2 className="font-black tracking-[-0.04em]" style={{fontSize:"clamp(24px,4vw,48px)"}}>
            Builders trust <Prism>AppForge</Prism>
          </h2>
        </div>
        {/* Horizontal scroll on mobile, grid on lg */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(280px,100%),1fr))",gap:"clamp(12px,2vw,20px)"}}>
          {[
            {name:"Arjun M.",role:"CTO @ Fintech Startup",text:"We launched our MVP in 11 days. Our Flutter app has 50K users. AppForge's clean Dart saved us months of refactoring.",avatar:"#22d3ee"},
            {name:"Sarah K.",role:"Indie Developer",text:"I'm not a Flutter expert, but AppForge generates code senior devs can't believe came from a visual builder.",avatar:"#818cf8"},
            {name:"Liu W.",role:"Engineering Lead",text:"The AI self-repair alone is worth the price. It caught three production memory leaks before we did and fixed them silently.",avatar:"#c084fc"},
          ].map((t,i)=>(
            <motion.div key={i} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}}
              transition={{delay:i*0.1,duration:0.6}} viewport={{once:true}}
              className="rounded-[24px]"
              style={{padding:"clamp(16px,2.5vw,28px)",
                background:"linear-gradient(145deg,rgba(255,255,255,0.04),rgba(0,0,0,0.3))",
                border:"1px solid rgba(255,255,255,0.07)",backdropFilter:"blur(20px)"}}>
              <div className="text-zinc-300 leading-relaxed mb-5" style={{fontSize:"clamp(13px,1.6vw,16px)"}}>"{t.text}"</div>
              <div className="flex items-center gap-3">
                <div className="rounded-full shrink-0"
                  style={{width:"clamp(32px,4vw,40px)",height:"clamp(32px,4vw,40px)",
                    background:`radial-gradient(circle at 30% 30%,white,${t.avatar})`}}/>
                <div>
                  <div className="font-bold" style={{fontSize:"clamp(13px,1.5vw,15px)"}}>{t.name}</div>
                  <div className="text-zinc-500" style={{fontSize:"clamp(10px,1.3vw,12px)"}}>{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── PRICING ─────────────────────────────────────────────────────────── */}
      <section id="pricing" className="max-w-[1100px] mx-auto"
        style={{paddingLeft:"clamp(16px,4vw,32px)",paddingRight:"clamp(16px,4vw,32px)",
          paddingTop:"clamp(48px,7vw,96px)",paddingBottom:"clamp(48px,7vw,96px)"}}>
        <div className="text-center mb-12">
          <Pill><span className="text-violet-400 text-xs">◆</span><span className="text-zinc-300">Simple Pricing</span></Pill>
          <h2 className="mt-5 font-black tracking-[-0.05em]" style={{fontSize:"clamp(26px,5vw,56px)"}}>
            Start free.<br/><Prism>Scale infinitely.</Prism>
          </h2>
          <p className="mt-3 text-zinc-400 max-w-sm mx-auto" style={{fontSize:"clamp(13px,1.6vw,15px)"}}>No hidden fees. No per-seat nonsense. Pay for what you ship.</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(280px,100%),1fr))",gap:"clamp(14px,2vw,24px)",alignItems:"start"}}>
          <PricingCard tier="Starter" price="$0" period="/mo forever" desc="For indie builders and side projects."
            features={["Visual Widget Builder","Flutter Code Export","5 Supabase Projects","Community Support","3 Cloud Builds/mo"]}
            cta="Start Free — No Card"
            onCta={()=>go(ROUTES.auth)}/>
          <PricingCard tier="Pro Engine" price="$49" period="/mo" desc="For startups shipping real products."
            features={["Everything in Starter","Unlimited Cloud Builds","AI Self-Repair Engine","Priority Build Farm","Slack + Email Support","Advanced State Patterns"]}
            cta="Start Pro Trial" featured
            onCta={()=>go(ROUTES.auth)}/>
          <PricingCard tier="Enterprise" price="Custom" period="" desc="For engineering teams at scale."
            features={["Unlimited Everything","Dedicated Build Nodes","SSO + Audit Logs","SLA Guarantees","White-Label Export","Dedicated Solutions Eng"]}
            cta="Talk to Sales"
            onCta={()=>showToast("📬 sales@appforge.dev — we'll reply within 24h")}/>
        </div>
      </section>

      {/* ── CTA FINALE ──────────────────────────────────────────────────────── */}
      <section className="max-w-[1400px] mx-auto"
        style={{paddingLeft:"clamp(16px,4vw,32px)",paddingRight:"clamp(16px,4vw,32px)",
          paddingBottom:"clamp(48px,7vw,96px)"}}>
        <motion.div initial={{opacity:0,y:32}} whileInView={{opacity:1,y:0}}
          transition={{duration:0.7}} viewport={{once:true}}
          className="relative rounded-[32px] overflow-hidden text-center"
          style={{
            padding:"clamp(40px,7vw,80px) clamp(20px,4vw,48px)",
            background:"linear-gradient(145deg,rgba(6,182,212,0.1),rgba(99,102,241,0.1),rgba(192,132,252,0.05))",
            border:"1px solid rgba(6,182,212,0.2)",backdropFilter:"blur(40px)",
          }}>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px"
            style={{background:"linear-gradient(90deg,transparent,#22d3ee,#818cf8,transparent)"}}/>
          <div className="absolute inset-0 pointer-events-none"
            style={{background:"radial-gradient(ellipse 70% 50% at 50% 0%,rgba(6,182,212,0.1),transparent)"}}/>
          <div className="relative">
            <div className="font-black tracking-[0.28em] text-cyan-400 uppercase mb-5" style={{fontSize:"clamp(9px,1.2vw,11px)"}}>The Future of Flutter Development</div>
            <h2 className="font-black tracking-[-0.05em] leading-[0.92] mb-5"
              style={{fontSize:"clamp(26px,5.5vw,72px)"}}>
              Your app deserves<br/><Prism>exceptional engineering.</Prism>
            </h2>
            <p className="text-zinc-400 max-w-md mx-auto mb-8 leading-relaxed"
              style={{fontSize:"clamp(13px,1.6vw,16px)"}}>
              Join 12,000 developers who chose AppForge to build faster, ship better, and break fewer things at 3am.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-sm sm:max-w-none mx-auto">
              <motion.button whileTap={{scale:0.97}} onClick={()=>go(ROUTES.auth)}
                className="w-full sm:w-auto font-bold text-black rounded-2xl"
                style={{minHeight:"clamp(48px,6vw,56px)",paddingLeft:"clamp(24px,4vw,40px)",paddingRight:"clamp(24px,4vw,40px)",
                  fontSize:"clamp(13px,1.6vw,16px)",
                  background:"linear-gradient(135deg,#22d3ee,#818cf8)",
                  boxShadow:"0 0 30px rgba(6,182,212,0.3)"}}>
                Launch AppForge Free →
              </motion.button>
              <motion.button whileTap={{scale:0.97}} onClick={()=>setModal("demo")}
                className="w-full sm:w-auto font-medium text-zinc-300 rounded-2xl"
                style={{minHeight:"clamp(48px,6vw,56px)",paddingLeft:"clamp(24px,4vw,40px)",paddingRight:"clamp(24px,4vw,40px)",
                  fontSize:"clamp(13px,1.6vw,16px)",
                  background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)"}}>
                Schedule a Demo
              </motion.button>
            </div>
            <p className="mt-5 text-zinc-600" style={{fontSize:"clamp(10px,1.3vw,12px)"}}>No credit card. Instant access. Cancel anytime.</p>
          </div>
        </motion.div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────────── */}
      <footer className="border-t" style={{borderColor:"rgba(255,255,255,0.05)",background:"rgba(0,0,0,0.3)"}}>
        <div className="max-w-[1400px] mx-auto"
          style={{padding:"clamp(32px,5vw,64px) clamp(16px,4vw,32px)"}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(160px,100%),1fr))",gap:"clamp(24px,4vw,40px)",marginBottom:"clamp(24px,4vw,40px)"}}>
            {/* Brand */}
            <div style={{gridColumn:"span 2 / auto"}}>
              <div className="flex items-center gap-2.5 mb-3">
                <LogoMark size={32}/>
                <span className="font-black tracking-tight" style={{fontSize:"clamp(14px,2vw,18px)"}}>AppForge</span>
              </div>
              <p className="text-zinc-500 leading-relaxed mb-4 max-w-[200px]" style={{fontSize:"clamp(11px,1.4vw,13px)"}}>
                The AI-native Flutter engineering platform for teams who ship.
              </p>
              <div className="flex gap-2">
                {[
                  {s:"𝕏",url:"https://x.com"},
                  {s:"in",url:"https://linkedin.com"},
                  {s:"gh",url:"https://github.com"},
                ].map(social=>(
                  <a key={social.s} href={social.url} target="_blank" rel="noopener noreferrer"
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-zinc-500 hover:text-white transition-colors"
                    style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.06)",fontSize:"13px"}}>
                    {social.s}
                  </a>
                ))}
              </div>
            </div>

            {/* Platform links → route to builder/dashboard */}
            <div>
              <div className="font-black tracking-widest text-zinc-500 uppercase mb-3" style={{fontSize:"clamp(8px,1vw,10px)"}}>Platform</div>
              <div className="space-y-2">
                {[
                  {l:"Visual Builder",r:ROUTES.builder},
                  {l:"Code Engine",r:ROUTES.builder},
                  {l:"Backend Forge",r:ROUTES.dashboard},
                  {l:"AI Dashboard",r:ROUTES.dashboard},
                  {l:"Cloud Builds",r:ROUTES.dashboard},
                ].map(item=>(
                  <button key={item.l} onClick={()=>go(item.r)}
                    className="block text-zinc-400 hover:text-white transition-colors text-left w-full"
                    style={{minHeight:"32px",fontSize:"clamp(12px,1.5vw,14px)"}}>
                    {item.l}
                  </button>
                ))}
              </div>
            </div>

            {/* Company → modals */}
            <div>
              <div className="font-black tracking-widest text-zinc-500 uppercase mb-3" style={{fontSize:"clamp(8px,1vw,10px)"}}>Company</div>
              <div className="space-y-2">
                {[
                  {l:"About",modal:"about"},
                  {l:"Blog",modal:"blog"},
                  {l:"Careers",modal:"careers"},
                  {l:"Account",r:ROUTES.account},
                ].map(item=>(
                  <button key={item.l}
                    onClick={()=>item.modal?setModal(item.modal):go(item.r)}
                    className="block text-zinc-400 hover:text-white transition-colors text-left w-full"
                    style={{minHeight:"32px",fontSize:"clamp(12px,1.5vw,14px)"}}>
                    {item.l}
                  </button>
                ))}
              </div>
            </div>

            {/* Legal → modals */}
            <div>
              <div className="font-black tracking-widest text-zinc-500 uppercase mb-3" style={{fontSize:"clamp(8px,1vw,10px)"}}>Legal</div>
              <div className="space-y-2">
                {[
                  {l:"Privacy",modal:"privacy"},
                  {l:"Terms",modal:"terms"},
                  {l:"Security",toast:"🔒 Security policy: security@appforge.dev"},
                  {l:"DPA",toast:"📄 DPA available on request: legal@appforge.dev"},
                ].map(item=>(
                  <button key={item.l}
                    onClick={()=>item.modal?setModal(item.modal):item.toast?showToast(item.toast):null}
                    className="block text-zinc-400 hover:text-white transition-colors text-left w-full"
                    style={{minHeight:"32px",fontSize:"clamp(12px,1.5vw,14px)"}}>
                    {item.l}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t"
            style={{borderColor:"rgba(255,255,255,0.05)",fontSize:"clamp(10px,1.3vw,12px)"}}>
            <span className="text-zinc-600">© 2026 AppForge, Inc. All rights reserved.</span>
            <div className="flex items-center gap-2 text-zinc-600">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400"/>
              All systems operational
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}