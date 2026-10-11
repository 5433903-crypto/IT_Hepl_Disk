import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Radio,
  FileText,
  Layers,
  BarChart3,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  Cpu,
  Server,
  RefreshCw,
  Plus,
} from 'lucide-react';
import { getDashboardStats, getActiveOutages, getTickets, getSystemHealth } from '../services/api';
import CountdownTimer from '../components/CountdownTimer';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [activeOutages, setActiveOutages] = useState([]);
  const [recentTickets, setRecentTickets] = useState([]);
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    const timer = setInterval(loadData, 20000);
    return () => clearInterval(timer);
  }, []);

  const loadData = async () => {
    try {
      const [statsRes, outagesRes, ticketsRes, healthRes] = await Promise.all([
        getDashboardStats(),
        getActiveOutages(),
        getTickets({ status: 'Open' }),
        getSystemHealth(),
      ]);

      if (statsRes.data.success) setStats(statsRes.data.stats);
      if (outagesRes.data.success) setActiveOutages(outagesRes.data.outages);
      if (ticketsRes.data.success) setRecentTickets(ticketsRes.data.tickets.slice(0, 5));
      if (healthRes.data.success) setHealth(healthRes.data);
    } catch (err) {
      console.error('Failed to load dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold uppercase tracking-wider bg-sky-500/20 text-sky-300 border border-sky-500/30">
                Department & IT Admin Command
              </span>
              <span className="text-xs text-slate-400 font-mono">Operations Console</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Campus IT Help Desk & Automated Lab Monitor
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Real-time monitoring across 6 computer engineering laboratories & automated diagnostic pipeline
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadData}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>

            <Link
              to="/admin/broadcasts"
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white shadow-lg shadow-rose-600/20 flex items-center gap-1.5 transition-all"
            >
              <Radio className="w-3.5 h-3.5" />
              Publish Outage
            </Link>
          </div>
        </div>

        {/* Executive KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* KPI 1: Active Outages */}
          <div className="glass-panel-elevated rounded-2xl p-5 border border-rose-500/30 relative overflow-hidden group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Active Outages
              </span>
              <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
                <Radio className="w-4 h-4 animate-pulse" />
              </div>
            </div>
            <div className="text-3xl font-black text-white font-mono">
              {stats ? stats.activeOutages : 0}
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-[11px] text-rose-300">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{activeOutages.length > 0 ? `${activeOutages[0].affectedLocation} in maintenance` : 'All campus zones clear'}</span>
            </div>
          </div>

          {/* KPI 2: Open Tickets */}
          <div className="glass-panel-elevated rounded-2xl p-5 border border-sky-500/30 relative overflow-hidden group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Live Open Tickets
              </span>
              <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30">
                <FileText className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-white font-mono">
              {stats ? stats.openTickets : 0}
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-[11px] text-sky-300">
              <Clock className="w-3.5 h-3.5" />
              <span>{stats ? `${stats.inProgressTickets} being worked on` : '0 in progress'}</span>
            </div>
          </div>

          {/* KPI 3: Labs Monitored */}
          <div className="glass-panel-elevated rounded-2xl p-5 border border-emerald-500/30 relative overflow-hidden group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Labs Monitored
              </span>
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-white font-mono">
              {stats ? `${stats.onlineLabs} / ${stats.totalLabs}` : '6 / 6'}
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-[11px] text-emerald-300">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{stats?.degradedLabs || 0} degraded • {stats?.offlineLabs || 0} offline</span>
            </div>
          </div>

          {/* KPI 4: Avg Resolution Time */}
          <div className="glass-panel-elevated rounded-2xl p-5 border border-indigo-500/30 relative overflow-hidden group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Avg Resolution Time
              </span>
              <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-white font-mono">
              {stats ? `${stats.avgResolutionMinutes}m` : '24m'}
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-[11px] text-indigo-300">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{stats?.resolvedTickets || 0} tickets resolved overall</span>
            </div>
          </div>
        </div>

        {/* System Diagnostics / AI Provider Transparency Card */}
        {health && (
          <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-slate-800 bg-slate-900/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sky-400 shrink-0">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Diagnostic Engine Core:
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-semibold border ${
                    health.visionAi.isExternalAiActive
                      ? 'bg-indigo-950 text-indigo-300 border-indigo-700'
                      : 'bg-amber-950 text-amber-300 border-amber-700'
                  }`}>
                    {health.visionAi.provider}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {health.visionAi.modeDescription}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono text-slate-400 self-end md:self-center shrink-0">
              <span>Database: <strong className="text-emerald-400">{health.database.name}</strong></span>
              <span>Status: <strong className="text-emerald-400">{health.status}</strong></span>
            </div>
          </div>
        )}

        {/* Two-Column Middle Grid: Active Outages & Recent Tickets */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Active Outages Control Widget (5 cols) */}
          <div className="lg:col-span-5 glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Radio className="w-4 h-4 text-rose-400" />
                Active Outage Broadcasts
              </h2>
              <Link to="/admin/broadcasts" className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1">
                Manage all <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {activeOutages.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500 rounded-xl bg-slate-900/40 border border-slate-800">
                No active outages reported. All laboratories operating under nominal conditions.
              </div>
            ) : (
              <div className="space-y-3">
                {activeOutages.map((outage) => (
                  <div
                    key={outage._id}
                    className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-rose-600/30 text-rose-300 border border-rose-500/40">
                        {outage.affectedLocation}
                      </span>
                      <CountdownTimer targetDate={outage.estimatedEndTime} compact={true} />
                    </div>

                    <h3 className="text-xs font-bold text-white">
                      {outage.title}
                    </h3>

                    <p className="text-[11px] text-slate-300 line-clamp-2">
                      {outage.description}
                    </p>

                    <div className="text-[10px] font-mono text-slate-400 pt-1 border-t border-rose-500/20">
                      ID: {outage.outageId} • Started by {outage.createdByName}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Unresolved Ticket Queue Preview (7 cols) */}
          <div className="lg:col-span-7 glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-sky-400" />
                Live Unresolved Student Tickets
              </h2>
              <Link to="/admin/tickets" className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1">
                Full Queue <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {recentTickets.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500 rounded-xl bg-slate-900/40 border border-slate-800">
                No open tickets! The IT help desk queue is clear.
              </div>
            ) : (
              <div className="divide-y divide-slate-800/80">
                {recentTickets.map((ticket) => (
                  <div key={ticket._id} className="py-3 flex items-start justify-between gap-3 first:pt-0 last:pb-0">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-sky-300">
                          {ticket.ticketNumber}
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
                          {ticket.labNumber} • {ticket.pcNumber}
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-rose-950 text-rose-300 border border-rose-800">
                          {ticket.severity}
                        </span>
                      </div>
                      <h4 className="text-xs font-semibold text-white mt-1 truncate">
                        {ticket.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Reported by: {ticket.studentName} ({ticket.studentRollNo})
                      </p>
                    </div>

                    <Link
                      to="/admin/tickets"
                      className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium shrink-0 transition-colors"
                    >
                      Inspect
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
