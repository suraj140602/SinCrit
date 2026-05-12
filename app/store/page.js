"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import * as LucideIcons from 'lucide-react';

const THEME_CATEGORIES = ['All', 'Wireframes', 'Premium Pages', 'Animated Cards', 'Components'];

const MARKETPLACE_ITEMS = [
  { id: 't_1', title: 'Crypto Dashboard', category: 'Premium Pages', icon: 'Wallet', price: 'PRO', templateKey: 'cryptoWallet', desc: 'Glassmorphic Web3 wallet layout with animated balances.' },
  { id: 't_2', title: 'Social Profile', category: 'Premium Pages', icon: 'User', price: 'FREE', templateKey: 'userProfile', desc: 'Clean user profile with stat counters and avatar grids.' },
  { id: 't_3', title: 'Login Wireframe', category: 'Wireframes', icon: 'LayoutTemplate', price: 'FREE', templateKey: 'login', desc: 'Standard authentication structure, unstyled and ready to theme.' },
  { id: 't_4', title: 'Glass Credit Card', category: 'Animated Cards', icon: 'CreditCard', price: 'PRO', templateKey: 'glassCard', desc: 'Translucent animated finance card for fintech apps.' },
  { id: 't_5', title: 'Gradient Action Button', category: 'Components', icon: 'MousePointerClick', price: 'FREE', templateKey: 'gradientBtn', desc: 'High-conversion animated button with hover states.' },
];

export default function ThemeStore() {
  const [activeCategory, setActiveCategory] = useState('All');
  const router = useRouter();

  const handleInstall = (templateKey) => {
    // This magically routes them to the builder AND passes the template key!
    router.push(`/builder?inject=${templateKey}`);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-indigo-500/30 flex flex-col">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 bg-[#050505]/80 backdrop-blur-2xl border-b border-white/5 px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.4)]">
            <LucideIcons.Store size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">AppForge Marketplace</h1>
            <p className="text-[11px] text-indigo-400 font-bold tracking-widest uppercase">Premium Assets</p>
          </div>
        </div>
        <button onClick={() => router.push('/builder')} className="text-sm font-bold text-gray-400 hover:text-white transition-colors">
          Back to Workspace
        </button>
      </header>

      {/* Main Layout */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden max-w-[1600px] w-full mx-auto">
        
        {/* Sidebar Filters */}
        <div className="w-full md:w-64 border-r border-white/5 p-8 shrink-0 overflow-x-auto md:overflow-y-auto flex md:flex-col gap-2 border-b md:border-b-0">
          <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4 hidden md:block">Categories</h3>
          {THEME_CATEGORIES.map(cat => (
            <button 
              key={cat} 
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-3 rounded-xl text-xs font-bold transition-all text-left whitespace-nowrap shrink-0 ${activeCategory === cat ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-500 hover:bg-white/5 hover:text-gray-300'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Store Grid */}
        <div className="flex-1 p-8 overflow-y-auto custom-scrollbar relative bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed" style={{ backgroundBlendMode: 'overlay', backgroundColor: '#0a0a0c' }}>
          
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Explore {activeCategory === 'All' ? 'Everything' : activeCategory}</h1>
            <p className="text-gray-400">One-click install production-ready UI components straight into your canvas.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {MARKETPLACE_ITEMS.filter(item => activeCategory === 'All' || item.category === activeCategory).map(item => {
              const IconComp = LucideIcons[item.icon] || LucideIcons.Box;
              return (
                <div key={item.id} className="bg-[#161b22]/80 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden hover:border-indigo-500/50 hover:shadow-[0_0_30px_rgba(99,102,241,0.15)] transition-all group flex flex-col">
                  {/* Image Placeholder */}
                  <div className="h-48 bg-[#0E0F11] border-b border-white/5 flex items-center justify-center relative overflow-hidden group-hover:bg-[#121318] transition-colors">
                     <IconComp size={56} className="text-indigo-500/20 group-hover:scale-110 group-hover:text-indigo-500/40 transition-all duration-500" />
                     <span className={`absolute top-3 right-3 text-[9px] font-bold px-3 py-1.5 rounded-md tracking-widest ${item.price === 'PRO' ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg' : 'bg-green-500/20 text-green-400 border border-green-500/20'}`}>
                       {item.price}
                     </span>
                  </div>

                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-base font-bold text-gray-200 mb-2">{item.title}</h3>
                    <p className="text-xs text-gray-500 mb-6 leading-relaxed flex-1">{item.desc}</p>
                    <button 
                      onClick={() => handleInstall(item.templateKey)}
                      className="w-full py-3.5 bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white border border-indigo-500/30 hover:border-indigo-500 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
                    >
                      <LucideIcons.Download size={16} /> Push to Canvas
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  );
}