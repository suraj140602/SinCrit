"use client";
import React, { useState } from 'react';
import * as LucideIcons from 'lucide-react';
export const dynamic = 'force-dynamic';
export default function AdminDashboard() {
  
  // --- Auth State ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passphrase, setPassphrase] = useState('');

  // --- Dashboard Data State ---
  const [targetEmail, setTargetEmail] = useState('');
  const [targetProjectId, setTargetProjectId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [dbData, setDbData] = useState({
    metrics: { developers: 0, activeSubs: 0, apkExports: 0, latency: '0ms' },
    recentUsers: []
  });

  // --- 1. Fetch Stats (GET) ---
 const fetchLiveStats = async () => {
    setIsLoading(true);
    try {
      // ADDED ?t=${Date.now()} and cache: 'no-store' to completely bypass Vercel's CDN
      const response = await fetch(`/api/stats?t=${Date.now()}`, {
        cache: 'no-store', 
        headers: { 'Authorization': `Bearer ${passphrase}` } 
      });
      const data = await response.json();
      
      if (response.status === 401) {
        setIsAuthenticated(false);
        return alert("Invalid Passphrase.");
      }
      
      if (data.error) throw new Error(data.error);
      
      setDbData(data);
      setIsAuthenticated(true); // Unlock the UI
    } catch (error) {
      console.error("Dashboard Sync Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // --- 2. Update Access Matrix (POST) ---
  const handleUpdateAccess = async (actionType) => {
    if (!targetEmail) return alert("Please enter an email first.");
    
    setIsLoading(true); 
    try {
      const response = await fetch('/api/update-access', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${passphrase}` 
        },
        body: JSON.stringify({ email: targetEmail, action: actionType }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      alert(data.message);
      fetchLiveStats(); // Refresh the data instantly

    } catch (error) {
      console.error("Access Update Error:", error);
      // Instead of alert("Failed: " + error.message);
      toast.error(error.message || "A critical system error occurred.");
    } finally {
      setIsLoading(false);
      setTargetEmail('');
    }
  };

  // --- Lock Screen UI ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center selection:bg-purple-500/30">
         <div className="bg-[#0E0F11] border border-white/5 p-8 rounded-3xl w-96 text-center shadow-2xl">
            <LucideIcons.ShieldAlert size={40} className="text-purple-500 mx-auto mb-4" />
            <h1 className="text-white font-bold mb-2">Founder Access Restricted</h1>
            <p className="text-xs text-gray-500 mb-6">Please enter your infrastructure passphrase.</p>
            <input 
              type="password" 
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchLiveStats()}
              className="w-full bg-[#161b22] border border-white/10 rounded-xl px-4 py-3 text-sm text-center text-white outline-none mb-4 focus:border-purple-500/50"
            />
            <button onClick={fetchLiveStats} className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-200">
              Authenticate
            </button>
         </div>
      </div>
    );
  }

  // --- Main Dashboard UI ---
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-purple-500/30">
      <header className="sticky top-0 z-50 bg-[#050505]/80 backdrop-blur-2xl border-b border-white/5 px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.4)]">
            <LucideIcons.Command size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">Founder Command Center</h1>
            <p className="text-[11px] text-gray-500 uppercase tracking-widest font-mono">Real-time Infrastructure</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-green-400 bg-green-500/10 px-3 py-1.5 rounded-full border border-green-500/20">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Systems Operational
        </div>
      </header>

      <main className="p-8 max-w-7xl mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <MetricCard icon={LucideIcons.Users} title="Developers" value={isLoading ? "..." : dbData.metrics.developers} trend="Live DB" color="blue" />
          <MetricCard icon={LucideIcons.CreditCard} title="Active Subs" value={isLoading ? "..." : dbData.metrics.activeSubs} trend="Stripe Sync" color="green" />
          <MetricCard icon={LucideIcons.Smartphone} title="APK Exports" value={isLoading ? "..." : dbData.metrics.apkExports} trend="Cloud Build" color="purple" />
          <MetricCard icon={LucideIcons.Activity} title="Latency" value={isLoading ? "..." : dbData.metrics.latency} trend="Edge Network" color="cyan" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-[#0E0F11] border border-white/5 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
                <LucideIcons.ShieldAlert size={16} className="text-purple-400" /> Access Matrix
              </h2>
              <div className="flex gap-3 mb-8 relative z-10">
                <input 
                  type="email" value={targetEmail} onChange={(e) => setTargetEmail(e.target.value)}
                  placeholder="developer@email.com" 
                  className="flex-1 bg-[#161b22] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-purple-500/50 outline-none transition-colors"
                />
                <button onClick={() => handleUpdateAccess('grant_pro')} className="bg-white text-black font-bold px-6 py-3 rounded-xl hover:bg-gray-200 transition-colors">Grant Pro</button>
                <button onClick={() => handleUpdateAccess('revoke')} className="bg-red-500/10 text-red-500 border border-red-500/20 font-bold px-6 py-3 rounded-xl hover:bg-red-500/20 transition-colors">Revoke</button>
              </div>
              <div className="bg-[#050505] rounded-2xl border border-white/5 overflow-hidden relative z-10">
                {dbData.recentUsers.length === 0 && !isLoading && <p className="p-4 text-xs text-gray-500 text-center">No recent records found</p>}
                {dbData.recentUsers.map((user, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${user.access ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-red-500'}`}></div>
                      <span className="text-sm font-mono text-gray-300">{user.email}</span>
                    </div>
                    <div className="flex gap-3 items-center">
                      <span className="text-[10px] bg-white/10 px-2 py-1 rounded text-gray-400 font-bold uppercase tracking-tighter">{user.status}</span>
                      <button className="text-xs text-blue-400 hover:text-blue-300 font-bold">Edit</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-900/20 to-blue-900/10 border border-indigo-500/20 rounded-3xl p-6 shadow-2xl relative z-10">
              <h2 className="text-sm font-bold uppercase tracking-widest text-indigo-400 mb-2 flex items-center gap-2">
                <LucideIcons.Terminal size={16} /> God Mode: Workspace Tunnel
              </h2>
              <p className="text-xs text-gray-400 mb-6">Tunnel into a user workspace to resolve code conflicts or design bugs.</p>
              <div className="flex gap-3">
                <input 
                  type="text" value={targetProjectId} onChange={(e) => setTargetProjectId(e.target.value)}
                  placeholder="Project ID (e.g. prj_8x9...)" 
                  className="flex-1 bg-[#050505] border border-indigo-500/30 rounded-xl px-4 py-3 text-sm text-indigo-300 outline-none font-mono"
                />
                <button 
                  onClick={() => window.location.href = `/builder?id=${targetProjectId}`}
                  className="bg-indigo-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-indigo-500 shadow-[0_0_20px_rgba(79,70,229,0.3)] transition-all flex items-center gap-2 relative z-20"
                >
                  <LucideIcons.ExternalLink size={16} /> Tunnel In
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-[#0E0F11] border border-white/5 rounded-3xl p-6 h-full relative z-10">
              <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
                <LucideIcons.HeartPulse size={16} className="text-cyan-400" /> Infra Health
              </h2>
              <div className="space-y-6">
                <HealthBar label="Database (Supabase)" percentage={24} status="Healthy" />
                <HealthBar label="API Quota (Gemini)" percentage={82} status="Warning" />
                <HealthBar label="Build Queue" percentage={12} status="Healthy" />
              </div>
              <div className="mt-8 pt-6 border-t border-white/5">
                <h3 className="text-xs font-bold uppercase tracking-widest text-yellow-500 mb-3 flex items-center gap-2">
                  <LucideIcons.AlertTriangle size={14} /> AI Warnings
                </h3>
                <div className="text-[11px] text-gray-400 bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl leading-relaxed">
                  <span className="text-yellow-400 font-bold block mb-1">Peak Prediction:</span>
                  AI traffic spike expected in 2 hours.
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function MetricCard({ icon: Icon, title, value, trend, color }) {
  const colorMap = {
    blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    green: 'text-green-400 bg-green-500/10 border-green-500/20',
    purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    cyan: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
  };
  return (
    <div className="bg-[#0E0F11] border border-white/5 p-6 rounded-3xl transition-all hover:bg-[#121316]">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${colorMap[color]}`}>
        <Icon size={18} />
      </div>
      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-white mb-2">{value}</h3>
      <p className="text-[10px] font-mono text-gray-500">{trend}</p>
    </div>
  );
}

function HealthBar({ label, percentage, status }) {
  const getBarColor = (pct) => {
    if (pct > 95) return 'bg-red-500';
    if (pct > 80) return 'bg-yellow-500';
    return 'bg-cyan-500';
  };
  return (
    <div>
      <div className="flex justify-between items-end mb-2">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</span>
        <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${percentage > 80 ? 'bg-yellow-500/20 text-yellow-500' : 'bg-green-500/20 text-green-500'}`}>
          {status}
        </span>
      </div>
      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
        <div className={`h-full transition-all duration-1000 ${getBarColor(percentage)}`} style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
}