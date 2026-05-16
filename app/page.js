"use client";
import UserMenu from "../components/UserMenu"
import React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Code2,
  Smartphone,
  Zap,
  Database,
  Download,
  Layers,
  ChevronRight,
  CheckCircle2,
  Cpu,
  Globe,
  Type,
  Image as ImageIcon,
  Pointer,
  List,
  PlaySquare,
  Calendar,
  Settings2,
  TerminalSquare,
  LayoutTemplate
} from 'lucide-react';

// Custom Premium SVG Logo 
const SinCritLogo = () => (
  <svg width="32" height="32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="24" fill="url(#paint0_linear)" />
    <path d="M70 35C70 29.4772 65.5228 25 60 25H40C34.4772 25 30 29.4772 30 35V45C30 50.5228 34.4772 55 40 55H50C55.5228 55 60 59.4772 60 65V75C60 80.5228 55.5228 85 50 85H30" stroke="white" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M30 35C30 29.4772 34.4772 25 40 25H60" stroke="#54C5F8" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
    <defs>
      <linearGradient id="paint0_linear" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
        <stop stopColor="#042B59" />
        <stop offset="0.5" stopColor="#02569B" />
        <stop offset="1" stopColor="#54C5F8" />
      </linearGradient>
    </defs>
  </svg>
);

// Apple-style custom ease curve
const appleEase = [0.16, 1, 0.3, 1];

// Animation Variants
const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
};

const slideUp = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 1, ease: appleEase }
  }
};

const scaleUp = {
  hidden: { opacity: 0, scale: 0.95, y: 40 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 1.2, ease: appleEase }
  }
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#f5f5f7] font-sans antialiased selection:bg-[#02569B] selection:text-white overflow-x-hidden w-full max-w-[100vw]">
      {/* APPLE-STYLE MINIMAL NAVBAR */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: appleEase }}
        className="fixed top-0 w-full z-50 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5"
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SinCritLogo />
            <span className="font-semibold text-lg tracking-tight text-white hidden sm:block">SinCrit</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-xs font-medium text-[#86868b]">
            <a href="#features" className="hover:text-white transition-colors duration-300">Architecture</a>
            <a href="#engine" className="hover:text-white transition-colors duration-300">Flutter Engine</a>
            <a href="#pricing" className="hover:text-white transition-colors duration-300">Enterprise</a>
          </div>

          {/* LOGIN AND SIGNUP BUTTONS */}
          <div className="flex items-center gap-4">
            <Link href="/auth">
              <span className="text-xs font-semibold text-[#86868b] hover:text-white transition-colors duration-300 cursor-pointer">
                Log In
              </span>
            </Link>
            <Link href="/auth">
              <button className="bg-[#f5f5f7] text-black px-4 py-1.5 rounded-full text-xs font-semibold hover:bg-white hover:scale-105 transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                Sign Up Free
              </button>
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* HERO SECTION */}
      <div className="relative pt-40 pb-16 lg:pt-48 lg:pb-24 flex flex-col items-center text-center px-4">
        {/* Ambient Pulsing Background Glow */}
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.12, 0.18, 0.12] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] sm:w-[800px] h-[400px] sm:h-[600px] bg-[#02569B] blur-[150px] rounded-full pointer-events-none"
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="max-w-4xl mx-auto relative z-10"
        >
          <motion.div variants={slideUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1c1c1e] border border-white/5 text-[10px] sm:text-[11px] font-medium mb-8 tracking-wide text-[#86868b]">
            <motion.span
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-[#54C5F8]"
            />
            SinCrit Dart Engine 2.0 is Live
          </motion.div>

          <motion.h1 variants={slideUp} className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tighter mb-6 text-white leading-tight">
            Pro UI.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#54C5F8] to-[#02569B]">
              Native Flutter Code.
            </span>
          </motion.h1>

          <motion.p variants={slideUp} className="text-base sm:text-lg lg:text-xl text-[#86868b] max-w-2xl mx-auto mb-10 font-medium tracking-tight">
            The first visual engineering canvas that compiles pure, widget-based Dart code and deployable Android APKs directly from the browser.
          </motion.p>

          <motion.div variants={slideUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth">
              <button className="h-12 w-full sm:w-auto px-8 bg-[#f5f5f7] hover:bg-white text-black hover:scale-[1.02] active:scale-[0.98] rounded-full font-semibold text-[15px] flex items-center justify-center gap-2 transition-all shadow-[0_0_40px_rgba(255,255,255,0.1)]">
                Start Engineering Free <ChevronRight size={16} />
              </button>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* INFINITE MARQUEE (TRUSTED BY LOGOS) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.6 }}
        className="w-full border-y border-white/5 bg-[#0a0a0a] py-8 mb-24 overflow-hidden relative"
      >
        <div className="absolute left-0 top-0 w-16 sm:w-32 h-full bg-gradient-to-r from-[#0a0a0a] to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 w-16 sm:w-32 h-full bg-gradient-to-l from-[#0a0a0a] to-transparent z-10 pointer-events-none"></div>

        <p className="text-center text-[9px] sm:text-[11px] font-bold tracking-[0.2em] text-[#86868b] uppercase mb-8">
          Trusted by Developers At
        </p>

        <div className="flex whitespace-nowrap w-full">
          {/* Double map for seamless infinite scrolling */}
          {[...Array(2)].map((_, i) => (
            <motion.div
              key={i}
              className="flex items-center gap-12 sm:gap-16 lg:gap-32 px-8 min-w-full w-max shrink-0 justify-around opacity-50 grayscale hover:grayscale-0 transition-all duration-500"
              animate={{ x: ["0%", "-100%"] }}
              transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
            >
              <span className="font-bold text-lg sm:text-xl tracking-tighter hover:text-white cursor-pointer">CapitalOne</span>
              <span className="font-serif italic text-xl sm:text-2xl font-bold hover:text-white cursor-pointer">Wendy's</span>
              <span className="font-black text-xl sm:text-2xl tracking-widest hover:text-white cursor-pointer">IBM</span>
              <span className="font-bold text-xl sm:text-2xl flex items-center gap-1 hover:text-white cursor-pointer"><LayoutTemplate size={20} className="sm:w-6 sm:h-6" /> Microsoft</span>
              <span className="font-bold text-lg sm:text-xl tracking-tight hover:text-white cursor-pointer">amazon</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* REALISTIC IDE DASHBOARD PREVIEW */}
      <motion.div
        variants={scaleUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        id="engine"
        className="max-w-[1400px] mx-auto px-4 sm:px-6 pb-40"
      >
        <div className="relative rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(2,86,155,0.15)] sm:shadow-[0_0_80px_rgba(2,86,155,0.15)] bg-[#0f0f11] p-1.5 sm:p-2 ring-1 ring-white/5 transition-shadow duration-700">

          <div className="rounded-[1rem] sm:rounded-[1.5rem] overflow-hidden bg-[#161618] border border-white/5 flex flex-col h-[600px] sm:h-[700px]">

            {/* IDE Header */}
            <div className="h-14 bg-[#111112] border-b border-white/5 flex items-center justify-between px-4 shrink-0 overflow-x-auto hide-scrollbar gap-4">
              <div className="flex gap-2 shrink-0">
                <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
              </div>
              <div className="flex items-center gap-2 px-4 py-1.5 bg-[#1c1c1e] rounded-md text-[11px] text-[#86868b] font-mono tracking-tight border border-white/5 shrink-0">
                <Globe size={12} className="text-[#54C5F8]" />
                project-alpha.sincrit.dev
              </div>
              <div className="flex gap-2 shrink-0">
                <button className="px-4 py-1.5 bg-[#02569B] hover:bg-[#0369bd] transition-colors text-white text-[11px] font-semibold rounded uppercase tracking-wider flex items-center gap-1">
                  <PlaySquare size={12} /> Run
                </button>
              </div>
            </div>

            {/* IDE Body */}
            <div className="flex flex-1 overflow-x-auto overflow-y-hidden custom-scrollbar snap-x snap-mandatory">

              {/* LEFT PANEL: Add Widgets */}
              <div className="w-[260px] sm:w-72 bg-[#161618] border-r border-white/5 p-4 flex flex-col shrink-0 snap-start">
                <div className="flex items-center justify-between mb-4 text-[#e0e0e0]">
                  <h3 className="text-sm font-semibold flex items-center gap-2"><Layers size={16} /> Add Widgets</h3>
                  <span className="text-gray-500 hover:text-white cursor-pointer transition-colors">✕</span>
                </div>

                <div className="bg-[#1e1e20] rounded-lg p-2.5 mb-6 flex items-center gap-2 border border-white/5">
                  <span className="text-gray-500 text-sm">🔍</span>
                  <input type="text" placeholder="Search for widget... (⌘+F)" className="bg-transparent text-xs outline-none w-full text-white placeholder-gray-500" readOnly />
                </div>

                {/* Staggered Widget Grid */}
                <motion.div
                  variants={{
                    hidden: { opacity: 0 },
                    show: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.5 } }
                  }}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  className="grid grid-cols-3 gap-2"
                >
                  {[
                    { icon: <Type size={20} />, label: "Text" },
                    { icon: <LayoutTemplate size={20} />, label: "RichText" },
                    { icon: <ImageIcon size={20} />, label: "Image" },
                    { icon: <div className="w-5 h-5 rounded-full border-2 border-current"></div>, label: "CircleImg" },
                    { icon: <Settings2 size={20} />, label: "Icon" },
                    { icon: <div className="px-1 py-0.5 border-2 border-current rounded text-[10px] font-bold">BTN</div>, label: "Button" },
                    { icon: <Pointer size={20} />, label: "IconBtn", active: true },
                    { icon: <List size={20} />, label: "ListTile" },
                    { icon: <TerminalSquare size={20} />, label: "Form" },
                    { icon: <PlaySquare size={20} />, label: "Video" },
                    { icon: <PlaySquare size={20} className="text-red-500" />, label: "YouTube" },
                    { icon: <Calendar size={20} />, label: "Calendar" }
                  ].map((widget, i) => (
                    <motion.div
                      key={i}
                      variants={{ hidden: { opacity: 0, scale: 0.8 }, show: { opacity: 1, scale: 1, transition: { ease: appleEase } } }}
                    >
                      <WidgetBtn icon={widget.icon} label={widget.label} active={widget.active} />
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              {/* CENTER PANEL: Canvas Workspace */}
              <div className="flex-1 min-w-[320px] sm:min-w-[400px] bg-[#0a0a0b] flex items-center justify-center relative overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat opacity-90 shrink-0 snap-center">

                {/* Phone Canvas Mockup */}
                <motion.div
                  initial={{ y: 100, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, delay: 0.3, ease: appleEase }}
                  className="w-[280px] sm:w-[320px] h-[550px] sm:h-[650px] bg-white rounded-[2rem] sm:rounded-[2.5rem] border-[6px] sm:border-[8px] border-[#1c1c1e] shadow-2xl overflow-hidden relative flex flex-col hover:scale-[1.02] transition-transform duration-500"
                >
                  <div className="h-16 sm:h-20 bg-[#54C5F8] p-5 sm:p-6 flex flex-col justify-end">
                    <h2 className="text-white font-bold text-lg sm:text-xl">Profile Setup</h2>
                  </div>
                  <div className="flex-1 p-5 sm:p-6 flex flex-col gap-4">
                    <motion.div whileHover={{ scale: 1.05 }} className="w-16 sm:w-20 h-16 sm:h-20 bg-gray-200 rounded-full mx-auto mb-4 border-2 border-dashed border-[#54C5F8] flex items-center justify-center text-gray-400 cursor-pointer transition-colors hover:bg-blue-50">
                      <ImageIcon size={24} />
                    </motion.div>
                    <div className="h-10 sm:h-12 bg-gray-100 rounded-lg w-full px-4 flex items-center text-xs sm:text-sm text-gray-400">Jasmin Moore</div>
                    <div className="h-10 sm:h-12 bg-gray-100 rounded-lg w-full px-4 flex items-center text-xs sm:text-sm text-gray-400 border border-red-300">Email Address (Required)</div>
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="mt-auto h-10 sm:h-12 bg-[#02569B] rounded-full w-full flex items-center justify-center text-white text-sm sm:text-base font-bold shadow-lg shadow-[#02569B]/30">
                      Save Profile
                    </motion.button>
                  </div>
                </motion.div>
              </div>

              {/* RIGHT PANEL: Debug Panel */}
              <div className="w-[280px] sm:w-80 bg-[#1e1e20] border-l border-white/5 p-4 flex flex-col relative overflow-hidden shrink-0 snap-end">
                <div className="flex items-center justify-between mb-6 text-white">
                  <h3 className="text-sm font-semibold flex items-center gap-2">
                    <Settings2 size={16} /> Debug Panel <span className="text-[9px] bg-white/10 px-1.5 py-0.5 rounded tracking-widest text-[#54C5F8]">LIVE</span>
                  </h3>
                </div>

                <div className="inline-flex mb-6">
                  <span className="bg-[#5c5c8a] text-white text-xs px-4 py-1.5 rounded-md font-medium border border-[#7a7ab8]">Variables</span>
                </div>

                <motion.div
                  initial={{ x: 50, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.6, ease: appleEase }}
                  className="flex flex-col gap-1"
                >
                  <div className="text-xs text-gray-400 mb-2 font-medium flex justify-between">Action Output <ChevronRight size={14} className="rotate-90" /></div>
                  <div className="text-xs text-gray-300 mb-2 pl-4 flex justify-between items-center bg-white/5 py-1 px-2 rounded cursor-pointer hover:bg-white/10 transition-colors">
                    <span className="flex items-center gap-1"><Database size={12} /> userReference</span>
                    <ChevronRight size={14} className="rotate-90 text-[#54C5F8]" />
                  </div>

                  {/* Variable Rows */}
                  <div className="pl-4 pr-2 flex flex-col gap-2 mt-2">
                    <div className="flex justify-between items-center bg-[#111112] border border-white/10 rounded px-3 py-2.5">
                      <span className="text-[11px] text-gray-400 flex items-center gap-1.5"><Database size={12} /> reference</span>
                      <span className="text-[11px] text-white font-mono truncate max-w-[100px]">pPID4H8iSw...</span>
                    </div>
                    <motion.div
                      animate={{ borderColor: ['rgba(239,68,68,0.3)', 'rgba(239,68,68,0.8)', 'rgba(239,68,68,0.3)'] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="flex justify-between items-center bg-[#2a1111] border rounded px-3 py-2.5 shadow-[0_0_15px_rgba(255,0,0,0.1)]"
                    >
                      <span className="text-[11px] text-red-400 font-bold flex items-center gap-1.5"><Type size={12} /> email</span>
                      <span className="text-[11px] text-red-400 font-mono font-bold">Null</span>
                    </motion.div>
                  </div>
                </motion.div>

                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#1e1e20] to-transparent pointer-events-none"></div>
              </div>

            </div>
          </div>
        </div>
      </motion.div>

      {/* APPLE-STYLE BENTO BOX FEATURES - STAGGERED SCROLL REVEAL */}
      <div id="features" className="bg-[#050505] py-24 sm:py-32 border-t border-white/5 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: appleEase }}
            className="text-center mb-16 sm:mb-24"
          >
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 tracking-tighter text-white">
              A Native Ecosystem.
            </h2>
            <p className="text-[#86868b] text-lg sm:text-xl max-w-2xl mx-auto tracking-tight">
              Built on the fundamentals of the Flutter architecture. Compose stateless and stateful widgets visually without sacrificing structure.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6"
          >
            <BentoCard icon={<Layers size={28} className="text-white" />} title="Widget-Driven Canvas" desc="Drop Columns, Rows, and Stacks. The engine builds a true Flutter Widget Tree natively in the background." colSpan="lg:col-span-2" />
            <BentoCard icon={<Code2 size={28} className="text-[#54C5F8]" />} title="Pure Dart Generation" desc="Export clean, structured, and highly readable Dart code instantly." />
            <BentoCard icon={<Zap size={28} className="text-[#ffbd2e]" />} title="Visual State Management" desc="Bind variables natively inside the Debug Panel. See state changes in real-time." />
            <BentoCard icon={<Database size={28} className="text-[#27c93f]" />} title="Supabase Edge Integration" desc="Connect auth, databases, and edge functions natively to your UI." />
            <BentoCard icon={<Cpu size={28} className="text-[#ff5f56]" />} title="Cloud APK Compiling" desc="Generate signed Android release builds on our cloud servers with a single click." />
          </motion.div>
        </div>
      </div>

      {/* PRICING */}
      <div id="pricing" className="py-24 sm:py-40 bg-[#050505] relative border-t border-white/5 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 sm:mb-20">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 tracking-tighter">Scale with Confidence.</h2>
            <p className="text-[#86868b] text-lg sm:text-xl tracking-tight max-w-xl mx-auto">Design freely. Only pay for the infrastructure to compile and host your builds.</p>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-6 items-center"
          >
            {/* Community Tier */}
            <motion.div variants={slideUp} className="bg-[#111112] rounded-[2rem] sm:rounded-[32px] p-8 sm:p-10 lg:p-12 border border-white/5 hover:border-white/10 transition-colors">
              <h3 className="text-2xl font-semibold text-white mb-2 tracking-tight">Community</h3>
              <p className="text-[#86868b] text-sm mb-6">For indie developers and designers.</p>
              <div className="text-4xl sm:text-5xl font-bold tracking-tighter mb-8 text-white">$0 <span className="text-base sm:text-lg text-[#86868b] font-medium tracking-normal">/ forever</span></div>
              <ul className="space-y-4 mb-10">
                <PricingFeature text="Infinite Visual Canvas" />
                <PricingFeature text="Export Pure Dart Code" />
                <PricingFeature text="Standard Supabase Connect" />
                <PricingFeature text="Community Support" />
              </ul>
              <Link href="/auth">
                <button className="w-full py-4 rounded-2xl bg-[#1c1c1e] hover:bg-[#2c2c2e] text-white font-semibold transition-colors text-[15px]">Start Engineering</button>
              </Link>
            </motion.div>

            {/* Pro Tier */}
            <motion.div variants={slideUp} whileHover={{ y: -8 }} className="bg-[#0f0f11] rounded-[2rem] sm:rounded-[32px] p-8 sm:p-10 lg:p-12 border border-[#02569B]/50 shadow-[0_0_50px_rgba(2,86,155,0.1)] relative transition-all duration-500 mt-4 md:mt-0">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#02569B] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest whitespace-nowrap">Industry Standard</div>
              <h3 className="text-2xl font-semibold text-white mb-2 tracking-tight">Pro Engine</h3>
              <p className="text-[#86868b] text-sm mb-6">For startups shipping production apps.</p>
              <div className="text-4xl sm:text-5xl font-bold tracking-tighter mb-8 text-white">$49 <span className="text-base sm:text-lg text-[#86868b] font-medium tracking-normal">/ mo</span></div>
              <ul className="space-y-4 mb-10">
                <PricingFeature text="Everything in Community" />
                <PricingFeature text="Unlimited Cloud APK Builds" />
                <PricingFeature text="Custom CI/CD Pipelines" />
                <PricingFeature text="Priority Enterprise Support" />
              </ul>
              <Link href="/auth">
                <button className="w-full py-4 rounded-2xl bg-[#f5f5f7] hover:bg-white text-black font-semibold transition-colors text-[15px] shadow-[0_0_20px_rgba(255,255,255,0.2)]">Upgrade Engine</button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <footer className="border-t border-white/5 bg-[#0a0a0a] py-8 sm:py-12 px-4">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 opacity-80">
            <SinCritLogo />
            <span className="font-semibold tracking-tight text-white">SinCrit</span>
          </div>
          <p className="text-[10px] sm:text-xs text-[#86868b] font-medium tracking-tight text-center">© 2026 SinCrit Inc. Visual Engineering Without Limits.</p>
        </div>
      </footer>
    </div>
  );
}

// Reusable Sub-components
const WidgetBtn = ({ icon, label, active = false }) => (
  <motion.div
    whileHover={!active ? { scale: 1.05, backgroundColor: "#1a1a1c" } : {}}
    whileTap={{ scale: 0.95 }}
    className={`aspect-square rounded-xl border flex flex-col items-center justify-center gap-1 sm:gap-2 cursor-pointer transition-colors duration-200 ${active
        ? 'bg-[#1e1e2e] border-[#54C5F8]/30 text-[#54C5F8] shadow-lg'
        : 'bg-[#111112] border-white/5 text-gray-400 border-white/10'
      }`}>
    <div className="opacity-80 scale-75 sm:scale-100">{icon}</div>
    <span className="text-[9px] sm:text-[10px] font-medium">{label}</span>
  </motion.div>
);

const BentoCard = ({ icon, title, desc, colSpan = "" }) => (
  <motion.div
    variants={slideUp}
    whileHover={{ y: -5, scale: 1.01 }}
    className={`bg-[#0f0f11] border border-white/5 p-6 sm:p-8 rounded-[2rem] sm:rounded-[32px] transition-all duration-300 group hover:border-white/10 hover:shadow-2xl hover:shadow-white/5 ${colSpan}`}
  >
    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#1c1c1e] rounded-xl sm:rounded-2xl flex items-center justify-center mb-6 border border-white/5 shadow-inner group-hover:scale-110 transition-transform duration-500 ease-out">
      {icon}
    </div>
    <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 tracking-tight text-white group-hover:text-[#54C5F8] transition-colors">{title}</h3>
    <p className="text-[#86868b] text-sm sm:text-[15px] leading-relaxed tracking-tight group-hover:text-gray-400 transition-colors">
      {desc}
    </p>
  </motion.div>
);

const PricingFeature = ({ text }) => (
  <li className="flex items-center gap-3 text-sm sm:text-[15px] text-gray-300 tracking-tight">
    <CheckCircle2 size={16} className="text-[#54C5F8] shrink-0 sm:w-[18px] sm:h-[18px]" /> {text}
  </li>
);