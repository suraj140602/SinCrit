"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../../utils/supabase";
import { Suspense } from "react";

// ── Icon primitive ──────────────────────────────────────────
const I = ({ d, size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {d.split("|").map((p, i) => <path key={i} d={p} />)}
  </svg>
);

// ── Avatar ───────────────────────────────────────────────────
const Avatar = ({ src, name = "", size = 8 }) => {
  const initials = name ? name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0,2) : "?";
  const cls = `w-${size} h-${size} rounded-full flex items-center justify-center text-xs font-bold shrink-0`;
  return src
    ? <img src={src} alt={name} className={`${cls} object-cover ring-1 ring-white/10`} />
    : <div className={`${cls} bg-gradient-to-br from-blue-600 to-purple-600 text-white`}>{initials}</div>;
};

// ── Priority badge ───────────────────────────────────────────
const PriorityBadge = ({ p }) => {
  const map = { high: ["text-red-400", "bg-red-500/10", "border-red-500/20"], medium: ["text-amber-400", "bg-amber-500/10", "border-amber-500/20"], low: ["text-green-400", "bg-green-500/10", "border-green-500/20"] };
  const [tc, bg, border] = map[p] || map.medium;
  return <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${tc} ${bg} ${border}`}>{p}</span>;
};

// ── Status pill ───────────────────────────────────────────────
const StatusPill = ({ s }) => {
  const map = { todo: ["text-gray-400", "bg-gray-500/10", "To Do"], "in-progress": ["text-blue-400", "bg-blue-500/10", "In Progress"], done: ["text-green-400", "bg-green-500/10", "Done"], blocked: ["text-red-400", "bg-red-500/10", "Blocked"] };
  const [tc, bg, label] = map[s] || map.todo;
  return <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${tc} ${bg}`}>{label}</span>;
};

// ── Metric card ───────────────────────────────────────────────
const Metric = ({ label, value, sub, icon, color = "blue" }) => {
  const c = { blue: "text-blue-400 bg-blue-500/10", green: "text-green-400 bg-green-500/10", purple: "text-purple-400 bg-purple-500/10", amber: "text-amber-400 bg-amber-500/10" };
  return (
    <div className="bg-[#0d1017] border border-white/8 rounded-2xl p-5">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${c[color]}`}>
        <I d={icon} size={17} className={c[color].split(" ")[0]} />
      </div>
      <div className="text-2xl font-bold text-white mb-0.5">{value}</div>
      <div className="text-[11px] text-gray-500 uppercase tracking-widest font-bold">{label}</div>
      {sub && <div className="text-xs text-gray-600 mt-1">{sub}</div>}
    </div>
  );
};

// ── Modal ─────────────────────────────────────────────────────
const Modal = ({ open, onClose, title, children }) => (
  <AnimatePresence>
    {open && (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
        <motion.div initial={{ scale: 0.95, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 16 }}
          className="bg-[#0d1017] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
            <h3 className="font-bold text-white text-base">{title}</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors"><I d="M18 6L6 18|M6 6l12 12" size={18} /></button>
          </div>
          <div className="p-6">{children}</div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

const Inp = ({ value, onChange, placeholder, type = "text", as }) => {
  const cls = "w-full bg-[#0e1117] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-600 outline-none focus:border-blue-500/50 transition-all";
  if (as === "textarea") return <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={3} className={`${cls} resize-none`} />;
  return <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={cls} />;
};

const Lbl = ({ children }) => <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">{children}</label>;

// ── KANBAN columns ────────────────────────────────────────────
const COLUMNS = [
  { id: "todo",        label: "To Do",       color: "#6b7280" },
  { id: "in-progress", label: "In Progress", color: "#3b82f6" },
  { id: "done",        label: "Done",        color: "#22c55e" },
  { id: "blocked",     label: "Blocked",     color: "#ef4444" },
];

// ─────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────
function DashboardInner() {
  const router       = useRouter();
  const searchParams = useSearchParams();

  const [user, setUser]       = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView]       = useState("overview"); // overview | projects | tasks | kanban
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks]       = useState([]);
  const [members, setMembers]   = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectTasks, setProjectTasks]       = useState([]);

  // Modals
  const [showNewProject, setShowNewProject] = useState(false);
  const [showNewTask, setShowNewTask]       = useState(false);
  const [showEditTask, setShowEditTask]     = useState(null); // task object

  // New project form
  const [pName, setPName]         = useState("");
  const [pDesc, setPDesc]         = useState("");
  const [pDeadline, setPDeadline] = useState("");
  const [pColor, setPColor]       = useState("#3b82f6");

  // New task form
  const [tTitle, setTTitle]       = useState("");
  const [tDesc, setTDesc]         = useState("");
  const [tAssignee, setTAssignee] = useState("");
  const [tPriority, setTPriority] = useState("medium");
  const [tDue, setTDue]           = useState("");
  const [tProject, setTProject]   = useState("");

  const [saving, setSaving] = useState(false);
  const [flash, setFlash]   = useState("");

  const isManager = profile?.role === "manager" || profile?.role === "admin";

  // ── Boot ──
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { router.push("/auth"); return; }
      setUser(session.user);
      const { data: prof } = await supabase.from("profiles").select("*").eq("id", session.user.id).single();
      setProfile(prof);
      setLoading(false);

      // Handle post-payment redirect
      if (searchParams.get("upgraded") === "true") {
        await supabase.from("profiles").update({ is_premium: true }).eq("id", session.user.id);
        setFlash("🎉 You're now on AppForge Pro! Welcome to the club.");
        setTimeout(() => setFlash(""), 5000);
      }
    });
  }, []);

  // ── Fetch data ──
  const fetchProjects = useCallback(async () => {
    if (!user || !profile) return;
    try {
      const res = await fetch(`/api/projects?userId=${user.id}&role=${profile.role}`);
      const { projects: data } = await res.json();
      setProjects(data || []);
    } catch { setProjects([]); }
  }, [user, profile]);

  const fetchTasks = useCallback(async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/tasks?assignedTo=${user.id}`);
      const { tasks: data } = await res.json();
      setTasks(data || []);
    } catch { setTasks([]); }
  }, [user]);

  const fetchMembers = useCallback(async () => {
    try {
      const res = await fetch("/api/members");
      const { members: data } = await res.json();
      setMembers(data || []);
    } catch { setMembers([]); }
  }, []);

  const fetchProjectTasks = useCallback(async (projectId) => {
    try {
      const res = await fetch(`/api/tasks?projectId=${projectId}`);
      const { tasks: data } = await res.json();
      setProjectTasks(data || []);
    } catch { setProjectTasks([]); }
  }, []);

  useEffect(() => {
    if (user && profile) {
      fetchProjects();
      fetchTasks();
      fetchMembers();
    }
  }, [user, profile, fetchProjects, fetchTasks, fetchMembers]);

  useEffect(() => {
    if (selectedProject) fetchProjectTasks(selectedProject.id);
  }, [selectedProject, fetchProjectTasks]);

  // ── Create project (BULLETPROOF) ──
  const handleCreateProject = async () => {
    if (!pName.trim() || !user) return;
    setSaving(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // FIX: Send null if deadline is empty, otherwise Postgres crashes!
        body: JSON.stringify({ 
          name: pName, 
          description: pDesc, 
          deadline: pDeadline || null, 
          color: pColor, 
          manager_id: user.id 
        }),
      });
      
      const data = await res.json();

      // GUARD: If API fails, stop execution and don't crash React!
      if (!res.ok || !data.project) {
        setFlash(`❌ Error: ${data.error || "Failed to create project"}`);
        setTimeout(() => setFlash(""), 4000);
        setSaving(false);
        return;
      }

      // Safe State Update
      setProjects(prev => [data.project, ...prev]);
      setShowNewProject(false);
      setPName(""); setPDesc(""); setPDeadline(""); setPColor("#3b82f6");
      setFlash("✓ Project created!");
      setTimeout(() => setFlash(""), 3000);
    } catch (err) { 
      console.error(err); 
      setFlash("❌ Network Error");
    }
    setSaving(false);
  };

// ── Create task (BULLETPROOF) ──
  const handleCreateTask = async () => {
    if (!tTitle.trim() || !user) return;
    
    const projId = tProject || selectedProject?.id || projects[0]?.id;
    
    // 1. Guard: Ensure a project actually exists before calling the API
    if (!projId) {
      setFlash("⚠️ Please create a Project first!");
      setTimeout(() => setFlash(""), 4000);
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          title: tTitle, description: tDesc, project_id: projId, 
          assigned_to: tAssignee || user.id, created_by: user.id, 
          priority: tPriority, due_date: tDue 
        }),
      });
      
      const data = await res.json();

      // 2. Guard: If API fails, stop execution and show error!
      if (!res.ok || !data.task) {
        setFlash(`❌ Error: ${data.error || "Failed to create task"}`);
        setTimeout(() => setFlash(""), 4000);
        setSaving(false);
        return;
      }

      const { task } = data;

      // 3. Safe State Update
      if (selectedProject && task.project_id === selectedProject.id) {
        setProjectTasks(prev => [task, ...prev]);
      }
      setTasks(prev => [task, ...prev]);
      
      setShowNewTask(false);
      setTTitle(""); setTDesc(""); setTAssignee(""); setTPriority("medium"); setTDue(""); setTProject("");
      setFlash("✓ Task created!");
      setTimeout(() => setFlash(""), 3000);
    } catch (err) { 
      console.error(err); 
      setFlash("❌ Network Error");
    }
    setSaving(false);
  };

  // ── Update task status (BULLETPROOF) ──
  const updateTaskStatus = async (taskId, status) => {
    try {
      const res = await fetch("/api/tasks", { 
        method: "PATCH", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify({ id: taskId, status }) 
      });
      
      const data = await res.json();
      
      // Guard: Only update state if the API successfully returned the updated task
      if (!res.ok || !data.task) {
        console.error("Failed to update status:", data.error);
        return; 
      }

      const updater = prev => prev.map(t => t.id === taskId ? data.task : t);
      setProjectTasks(updater);
      setTasks(updater);
    } catch(err) {
      console.error(err);
    }
  };

  // ── Delete task ──
  const deleteTask = async (taskId) => {
    if (!confirm("Delete this task?")) return;
    await fetch(`/api/tasks?id=${taskId}`, { method: "DELETE" });
    const filter = prev => prev.filter(t => t.id !== taskId);
    setProjectTasks(filter);
    setTasks(filter);
  };

  // ── Computed metrics ──
  const myTasks    = tasks;
  const doneTasks  = myTasks.filter(t => t.status === "done");
  const lateTasks  = myTasks.filter(t => t.due_date && new Date(t.due_date) < new Date() && t.status !== "done");
  const urgentTasks = myTasks.filter(t => t.priority === "high" && t.status !== "done");

  const displayTasks = selectedProject
    ? projectTasks
    : isManager ? projectTasks : myTasks;

  if (loading) return (
    <div className="min-h-screen bg-[#050609] flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const navItems = [
    { id: "overview", label: "Overview",  icon: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z|M9 22V12h6v10" },
    { id: "projects", label: "Projects",  icon: "M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" },
    { id: "tasks",    label: "My Tasks",  icon: "M9 11l3 3L22 4|M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" },
    { id: "kanban",   label: "Kanban",    icon: "M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v11m0 0H5a2 2 0 00-2 2v4a2 2 0 002 2h4m0-6h6m0 0h4a2 2 0 012 2v4a2 2 0 01-2 2h-4m-6-6v6" },
  ];

  const initials = profile?.full_name ? profile.full_name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0,2) : "?";

  return (
    <div className="min-h-screen bg-[#050609] text-white flex flex-col">

      {/* ── TOP HEADER ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 bg-[#050609]/90 backdrop-blur-xl border-b border-white/5 px-6 py-3.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-[0_0_14px_rgba(59,130,246,0.4)]">
              <I d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" size={14} className="text-white fill-white" />
            </div>
            <span className="text-white font-black text-lg tracking-tight uppercase italic">AppForge</span>
          </div>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(n => (
              <button key={n.id} onClick={() => { setView(n.id); if (n.id !== "kanban" && n.id !== "tasks") setSelectedProject(null); }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-[13px] font-medium transition-all ${
                  view === n.id ? "bg-white/10 text-white" : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}>
                <I d={n.icon} size={14} />
                {n.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {flash && (
            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
              className="text-xs font-medium px-3 py-1.5 bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg">
              {flash}
            </motion.div>
          )}

          {/* Actions */}
          {isManager && view === "projects" && (
            <button onClick={() => setShowNewProject(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl transition-all shadow-[0_0_14px_rgba(59,130,246,0.25)]">
              <I d="M12 5v14|M5 12h14" size={14} /> New Project
            </button>
          )}
          {(view === "tasks" || view === "kanban" || view === "overview") && (
            <button onClick={() => setShowNewTask(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl transition-all shadow-[0_0_14px_rgba(59,130,246,0.25)]">
              <I d="M12 5v14|M5 12h14" size={14} /> New Task
            </button>
          )}

          <button onClick={() => router.push("/builder")}
            className="px-3.5 py-2 border border-white/10 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 text-sm font-medium transition-all">
            Builder
          </button>

          {/* Avatar menu */}
          <button onClick={() => router.push("/account")} className="flex items-center gap-2.5 pl-2">
            <Avatar src={profile?.avatar_url} name={profile?.full_name} size={8} />
            <div className="hidden md:block text-left">
              <div className="text-xs font-bold text-white leading-none">{profile?.full_name || "User"}</div>
              <div className={`text-[10px] mt-0.5 font-bold uppercase tracking-widest ${isManager ? "text-purple-400" : "text-blue-400"}`}>
                {profile?.role || "developer"}
              </div>
            </div>
          </button>
        </div>
      </header>

      <div className="flex flex-1 min-h-0">

        {/* ── LEFT SIDEBAR — project list ─────────────────────── */}
        <aside className="w-56 border-r border-white/5 bg-[#080b0f] flex flex-col shrink-0 overflow-y-auto">
          <div className="px-4 py-4 border-b border-white/5">
            <div className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-3">Projects</div>
            <div className="flex flex-col gap-1">
              {projects.map(p => (
                <button key={p.id}
                  onClick={() => { setSelectedProject(p); setView("kanban"); }}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left text-sm transition-all w-full ${
                    selectedProject?.id === p.id ? "bg-blue-600/10 text-white border border-blue-500/20" : "text-gray-400 hover:bg-white/5 hover:text-white"
                  }`}>
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: p.color || "#3b82f6" }} />
                  <span className="truncate font-medium">{p.name}</span>
                </button>
              ))}
              {projects.length === 0 && (
                <div className="text-[11px] text-gray-700 px-3 py-2">No projects yet</div>
              )}
            </div>
          </div>

          {/* Quick stats */}
          <div className="px-4 py-4 mt-auto border-t border-white/5">
            <div className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-3">My Stats</div>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500">Open tasks</span>
                <span className="text-white font-bold">{myTasks.filter(t => t.status !== "done").length}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500">Completed</span>
                <span className="text-green-400 font-bold">{doneTasks.length}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500">Overdue</span>
                <span className={lateTasks.length > 0 ? "text-red-400 font-bold" : "text-gray-500"}>{lateTasks.length}</span>
              </div>
            </div>
          </div>
        </aside>

        {/* ── MAIN CONTENT ────────────────────────────────────── */}
        <main className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <AnimatePresence mode="wait">

            {/* ── OVERVIEW ── */}
            {view === "overview" && (
              <motion.div key="overview" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-6xl mx-auto space-y-7">
                
                <div>
                  <h2 className="text-2xl font-bold text-white">Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 18 ? "afternoon" : "evening"}, {profile?.full_name?.split(" ")[0] || "there"} 👋</h2>
                  <p className="text-gray-500 text-sm mt-1">Here's what's happening across your workspace.</p>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Metric label="Projects" value={projects.length} icon="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" color="blue" />
                  <Metric label="Open Tasks" value={myTasks.filter(t => t.status !== "done").length} icon="M9 11l3 3L22 4|M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" color="purple" />
                  <Metric label="Completed" value={doneTasks.length} sub={`${myTasks.length > 0 ? Math.round(doneTasks.length/myTasks.length*100) : 0}% complete`} icon="M22 11.08V12a10 10 0 11-5.93-9.14|M22 4L12 14.01l-3-3" color="green" />
                  <Metric label="Overdue" value={lateTasks.length} sub={lateTasks.length > 0 ? "Needs attention" : "All on track!"} icon="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" color="amber" />
                </div>

                {/* Recent tasks + Projects */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* Urgent tasks */}
                  <div className="bg-[#0d1017] border border-white/8 rounded-2xl overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
                      <h3 className="font-bold text-sm text-white flex items-center gap-2">
                        <I d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z|M12 9v4|M12 17h.01" size={14} className="text-amber-400" />
                        Urgent Tasks
                      </h3>
                      <button onClick={() => setView("tasks")} className="text-[11px] text-blue-400 hover:text-blue-300">View all →</button>
                    </div>
                    <div className="divide-y divide-white/5">
                      {urgentTasks.slice(0, 5).map(t => (
                        <div key={t.id} className="flex items-center gap-3 px-5 py-3">
                          <div className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm text-white font-medium truncate">{t.title}</div>
                            <div className="text-[11px] text-gray-500 truncate">{t.project?.name || "Unknown project"}</div>
                          </div>
                          <StatusPill s={t.status} />
                        </div>
                      ))}
                      {urgentTasks.length === 0 && (
                        <div className="px-5 py-6 text-sm text-gray-600 text-center">No urgent tasks 🎉</div>
                      )}
                    </div>
                  </div>

                  {/* Projects overview */}
                  <div className="bg-[#0d1017] border border-white/8 rounded-2xl overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
                      <h3 className="font-bold text-sm text-white">Active Projects</h3>
                      <button onClick={() => setView("projects")} className="text-[11px] text-blue-400 hover:text-blue-300">View all →</button>
                    </div>
                    <div className="divide-y divide-white/5">
                      {projects.slice(0, 5).map(p => (
                        <button key={p.id} onClick={() => { setSelectedProject(p); setView("kanban"); }}
                          className="flex items-center gap-3 px-5 py-3 w-full hover:bg-white/3 transition-colors">
                          <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
                          <div className="flex-1 text-left">
                            <div className="text-sm text-white font-medium">{p.name}</div>
                            <div className="text-[11px] text-gray-500">{p.members?.length || 0} members</div>
                          </div>
                          <I d="M9 18l6-6-6-6" size={14} className="text-gray-600" />
                        </button>
                      ))}
                      {projects.length === 0 && (
                        <div className="px-5 py-6 text-sm text-gray-600 text-center">No projects yet</div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── PROJECTS ── */}
            {view === "projects" && (
              <motion.div key="projects" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-6xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-white">Projects</h2>
                    <p className="text-gray-500 text-sm">{projects.length} {isManager ? "managed" : "active"} project{projects.length !== 1 ? "s" : ""}</p>
                  </div>
                  {isManager && (
                    <button onClick={() => setShowNewProject(true)}
                      className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl transition-all">
                      <I d="M12 5v14|M5 12h14" size={14} /> New Project
                    </button>
                  )}
                </div>

                {projects.length === 0 ? (
                  <div className="bg-[#0d1017] border border-dashed border-white/10 rounded-2xl p-16 text-center">
                    <div className="text-4xl mb-4">📁</div>
                    <div className="text-white font-bold mb-2">{isManager ? "Create your first project" : "No projects assigned"}</div>
                    <div className="text-gray-500 text-sm mb-5">{isManager ? "Organize tasks, assign developers, track progress." : "Ask your manager to add you to a project."}</div>
                    {isManager && (
                      <button onClick={() => setShowNewProject(true)}
                        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl transition-all">
                        Create Project
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {projects.map(p => (
                      <motion.div key={p.id} whileHover={{ y: -2 }}
                        className="bg-[#0d1017] border border-white/8 rounded-2xl overflow-hidden hover:border-white/15 transition-all cursor-pointer"
                        onClick={() => { setSelectedProject(p); setView("kanban"); }}>
                        <div className="h-1.5" style={{ backgroundColor: p.color }} />
                        <div className="p-5">
                          <div className="flex items-start justify-between mb-3">
                            <h3 className="font-bold text-white text-base leading-tight">{p.name}</h3>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-green-500/10 text-green-400 shrink-0 ml-2">Active</span>
                          </div>
                          {p.description && <p className="text-gray-500 text-sm mb-4 line-clamp-2 leading-relaxed">{p.description}</p>}
                          <div className="flex items-center justify-between">
                            <div className="flex -space-x-2">
                              {(p.members || []).slice(0, 4).map(m => (
                                <Avatar key={m.user_id || m.id} src={m.profile?.avatar_url || m.avatar_url} name={m.profile?.full_name || m.full_name} size={7} />
                              ))}
                              {(p.members || []).length > 4 && (
                                <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold text-gray-400 ring-2 ring-[#0d1017]">
                                  +{p.members.length - 4}
                                </div>
                              )}
                            </div>
                            {p.deadline && (
                              <div className="text-[11px] text-gray-500 flex items-center gap-1">
                                <I d="M8 2v4|M16 2v4|M3 10h18|M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" size={11} />
                                {new Date(p.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* ── MY TASKS ── */}
            {view === "tasks" && (
              <motion.div key="tasks" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-4xl mx-auto space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-white">My Tasks</h2>
                    <p className="text-gray-500 text-sm">{myTasks.length} total · {doneTasks.length} done</p>
                  </div>
                  <button onClick={() => setShowNewTask(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl transition-all">
                    <I d="M12 5v14|M5 12h14" size={14} /> Add Task
                  </button>
                </div>

                {["in-progress", "todo", "blocked", "done"].map(statusKey => {
                  const filtered = myTasks.filter(t => t.status === statusKey);
                  if (filtered.length === 0) return null;
                  const col = COLUMNS.find(c => c.id === statusKey);
                  return (
                    <div key={statusKey}>
                      <div className="flex items-center gap-2 mb-2 px-1">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: col.color }} />
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{col.label}</span>
                        <span className="text-xs text-gray-600">({filtered.length})</span>
                      </div>
                      <div className="flex flex-col gap-2">
                        {filtered.map(t => (
                          <TaskCard key={t.id} task={t} onStatusChange={updateTaskStatus} onDelete={deleteTask} isManager={isManager} />
                        ))}
                      </div>
                    </div>
                  );
                })}

                {myTasks.length === 0 && (
                  <div className="bg-[#0d1017] border border-dashed border-white/10 rounded-2xl p-16 text-center">
                    <div className="text-4xl mb-4">✅</div>
                    <div className="text-white font-bold mb-2">No tasks yet</div>
                    <div className="text-gray-500 text-sm">Tasks assigned to you will appear here.</div>
                  </div>
                )}
              </motion.div>
            )}

            {/* ── KANBAN ── */}
            {view === "kanban" && (
              <motion.div key="kanban" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                {selectedProject && (
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: selectedProject.color }} />
                    <h2 className="text-xl font-bold text-white">{selectedProject.name}</h2>
                    <span className="text-gray-500 text-sm">Kanban Board</span>
                    <div className="ml-auto flex items-center gap-2">
                      <button onClick={() => setShowNewTask(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl transition-all">
                        <I d="M12 5v14|M5 12h14" size={14} /> Add Task
                      </button>
                    </div>
                  </div>
                )}

                {!selectedProject && (
                  <div className="text-center py-20 text-gray-600">
                    <div className="text-4xl mb-3">📋</div>
                    <div>Select a project from the sidebar to see its Kanban board</div>
                  </div>
                )}

                {selectedProject && (
                  <div className="flex gap-4 overflow-x-auto pb-4">
                    {COLUMNS.map(col => {
                      const colTasks = projectTasks.filter(t => t.status === col.id);
                      return (
                        <div key={col.id} className="w-72 shrink-0 flex flex-col">
                          {/* Column header */}
                          <div className="flex items-center gap-2 px-3 py-2.5 mb-2">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: col.color }} />
                            <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">{col.label}</span>
                            <span className="ml-auto text-xs font-bold text-gray-600 bg-white/5 px-2 py-0.5 rounded-full">{colTasks.length}</span>
                          </div>

                          {/* Tasks */}
                          <div className="flex flex-col gap-2 min-h-24">
                            {colTasks.map(t => (
                              <KanbanCard key={t.id} task={t} onStatusChange={updateTaskStatus} onDelete={deleteTask} isManager={isManager} allColumns={COLUMNS} />
                            ))}
                            {colTasks.length === 0 && (
                              <div className="border border-dashed border-white/5 rounded-xl p-4 text-center text-[11px] text-gray-700">
                                Drop tasks here
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}

          </AnimatePresence>
        </main>
      </div>

      {/* ── MODALS ── */}

      {/* New Project */}
      <Modal open={showNewProject} onClose={() => setShowNewProject(false)} title="Create New Project">
        <div className="flex flex-col gap-4">
          <div><Lbl>Project Name *</Lbl><Inp value={pName} onChange={setPName} placeholder="e.g. Mobile App Redesign" /></div>
          <div><Lbl>Description</Lbl><Inp value={pDesc} onChange={setPDesc} placeholder="What is this project about?" as="textarea" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><Lbl>Deadline</Lbl><Inp type="date" value={pDeadline} onChange={setPDeadline} /></div>
            <div>
              <Lbl>Color</Lbl>
              <div className="flex items-center gap-2 mt-0.5">
                {["#3b82f6","#8b5cf6","#10b981","#f59e0b","#ef4444","#ec4899"].map(c => (
                  <button key={c} onClick={() => setPColor(c)}
                    className={`w-7 h-7 rounded-full transition-transform ${pColor === c ? "scale-125 ring-2 ring-white ring-offset-2 ring-offset-[#0d1017]" : ""}`}
                    style={{ backgroundColor: c }} />
                ))}
              </div>
            </div>
          </div>
          <button onClick={handleCreateProject} disabled={saving || !pName.trim()}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold rounded-xl transition-all mt-1">
            {saving ? "Creating..." : "Create Project"}
          </button>
        </div>
      </Modal>

      {/* New Task */}
      <Modal open={showNewTask} onClose={() => setShowNewTask(false)} title="Create New Task">
        <div className="flex flex-col gap-4">
          <div><Lbl>Task Title *</Lbl><Inp value={tTitle} onChange={setTTitle} placeholder="e.g. Fix login bug" /></div>
          <div><Lbl>Description</Lbl><Inp value={tDesc} onChange={setTDesc} placeholder="Details..." as="textarea" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Lbl>Project *</Lbl>
              <select value={tProject || selectedProject?.id || ""} onChange={e => setTProject(e.target.value)}
                className="w-full bg-[#0e1117] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-blue-500/50">
                <option value="">Select project...</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <Lbl>Priority</Lbl>
              <select value={tPriority} onChange={e => setTPriority(e.target.value)}
                className="w-full bg-[#0e1117] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-blue-500/50">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Lbl>Assign To</Lbl>
              <select value={tAssignee} onChange={e => setTAssignee(e.target.value)}
                className="w-full bg-[#0e1117] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-blue-500/50">
                <option value="">Self</option>
                {members.map(m => <option key={m.id} value={m.id}>{m.full_name || m.email}</option>)}
              </select>
            </div>
            <div><Lbl>Due Date</Lbl><Inp type="date" value={tDue} onChange={setTDue} /></div>
          </div>
          <button onClick={handleCreateTask} disabled={saving || !tTitle.trim()}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold rounded-xl transition-all mt-1">
            {saving ? "Creating..." : "Create Task"}
          </button>
        </div>
      </Modal>
    </div>
  );
}

// ── Task list card ─────────────────────────────────────────────
function TaskCard({ task: t, onStatusChange, onDelete, isManager }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="bg-[#0d1017] border border-white/8 rounded-xl p-4 hover:border-white/15 transition-all">
      <div className="flex items-start gap-3">
        <input type="checkbox" checked={t.status === "done"} onChange={e => onStatusChange(t.id, e.target.checked ? "done" : "todo")}
          className="mt-0.5 w-4 h-4 rounded accent-blue-600 shrink-0 cursor-pointer" />
        <div className="flex-1 min-w-0">
          <div className={`text-sm font-medium ${t.status === "done" ? "line-through text-gray-500" : "text-white"}`}>
            {t.title}
          </div>
          {expanded && t.description && (
            <div className="text-xs text-gray-500 mt-1 leading-relaxed">{t.description}</div>
          )}
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <PriorityBadge p={t.priority} />
            <StatusPill s={t.status} />
            {t.project && (
              <span className="text-[10px] text-gray-500 flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: t.project.color }} />
                {t.project.name}
              </span>
            )}
            {t.due_date && (
              <span className={`text-[10px] ${new Date(t.due_date) < new Date() && t.status !== "done" ? "text-red-400" : "text-gray-500"}`}>
                Due {new Date(t.due_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {t.assignee && <Avatar src={t.assignee.avatar_url} name={t.assignee.full_name} size={6} />}
          <button onClick={() => setExpanded(!expanded)} className="text-gray-600 hover:text-gray-300 transition-colors">
            <I d={expanded ? "M18 15l-6-6-6 6" : "M6 9l6 6 6-6"} size={14} />
          </button>
          {isManager && (
            <button onClick={() => onDelete(t.id)} className="text-gray-700 hover:text-red-400 transition-colors">
              <I d="M3 6h18|M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2" size={13} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Kanban card ───────────────────────────────────────────────
function KanbanCard({ task: t, onStatusChange, onDelete, isManager, allColumns }) {
  const [menu, setMenu] = useState(false);
  return (
    <div className="bg-[#0d1017] border border-white/8 rounded-xl p-3.5 hover:border-white/15 transition-all group">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="text-sm font-medium text-white leading-tight">{t.title}</div>
        <div className="relative shrink-0">
          <button onClick={() => setMenu(!menu)} className="text-gray-700 hover:text-gray-300 opacity-0 group-hover:opacity-100 transition-all">
            <I d="M12 5h.01|M12 12h.01|M12 19h.01" size={15} />
          </button>
          {menu && (
            <div className="absolute right-0 top-5 bg-[#1a1f2a] border border-white/10 rounded-xl p-1.5 z-10 min-w-36 shadow-xl" onClick={e => e.stopPropagation()}>
              {allColumns.filter(c => c.id !== t.status).map(c => (
                <button key={c.id} onClick={() => { onStatusChange(t.id, c.id); setMenu(false); }}
                  className="flex items-center gap-2 px-3 py-2 text-xs text-gray-300 hover:bg-white/5 rounded-lg w-full text-left">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: c.color }} />
                  Move to {c.label}
                </button>
              ))}
              {isManager && (
                <button onClick={() => { onDelete(t.id); setMenu(false); }}
                  className="flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 rounded-lg w-full text-left mt-1">
                  <I d="M3 6h18|M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2" size={12} />
                  Delete
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {t.description && <p className="text-[11px] text-gray-600 mb-2.5 leading-relaxed line-clamp-2">{t.description}</p>}

      <div className="flex items-center justify-between">
        <PriorityBadge p={t.priority} />
        <div className="flex items-center gap-1.5">
          {t.due_date && (
            <span className={`text-[10px] ${new Date(t.due_date) < new Date() && t.status !== "done" ? "text-red-400" : "text-gray-600"}`}>
              {new Date(t.due_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </span>
          )}
          {t.assignee && <Avatar src={t.assignee.avatar_url} name={t.assignee.full_name} size={5} />}
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return <Suspense fallback={<div className="min-h-screen bg-[#050609] flex items-center justify-center"><div className="w-10 h-10 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>}><DashboardInner /></Suspense>;
}