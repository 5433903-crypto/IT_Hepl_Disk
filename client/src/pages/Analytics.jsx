import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Cpu,
  Network,
  AlertTriangle,
  RefreshCw,
  PieChart as PieIcon,
  Download,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { getDashboardStats } from '../services/api';

const COLORS = ['#38bdf8', '#f59e0b', '#f43f5e', '#8b5cf6', '#10b981'];

export default function Analytics() {
  const [stats, setStats] = useState(null);
  const [charts, setCharts] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const res = await getDashboardStats();
      if (res.data.success) {
        setStats(res.data.stats);
        setCharts(res.data.charts);
      }
    } catch (err) {
      console.error('Failed to load analytics', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Diagnostic Intelligence Analytics
              </span>
              <span className="text-xs text-slate-400 font-mono">Telemetry Data</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Recurring Error & Laboratory Failure Analytics
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Historical patterns of hardware, network, and operating system faults across campus facilities
            </p>
          </div>

          <button
            onClick={loadAnalytics}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 self-start sm:self-center transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh Charts
          </button>
        </div>

        {/* Charts Row 1: Weekly Hardware vs Network Trends (Area Chart) & Category Breakdown (Pie Chart) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Weekly Failure Frequency (7 cols) */}
          <div className="lg:col-span-7 glass-panel-elevated rounded-2xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-sky-400" />
                  Failure Frequency Trend (Past 7 Days)
                </h2>
                <p className="text-xs text-slate-400">Network incidents vs hardware faults</p>
              </div>
            </div>

            <div className="h-72 w-full pt-4">
              {charts?.weeklyTrend ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={charts.weeklyTrend}>
                    <defs>
                      <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorHw" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="name" stroke="#64748b" textAnchor="end" tick={{ fontSize: 11 }} />
                    <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} />
                    <Legend />
                    <Area type="monotone" dataKey="networkErrors" stroke="#38bdf8" fillOpacity={1} fill="url(#colorNet)" name="Network Errors" />
                    <Area type="monotone" dataKey="hardwareErrors" stroke="#f43f5e" fillOpacity={1} fill="url(#colorHw)" name="Hardware Errors" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-slate-500 text-xs">Loading chart...</div>
              )}
            </div>
          </div>

          {/* Issue Category Distribution (5 cols) */}
          <div className="lg:col-span-5 glass-panel-elevated rounded-2xl p-6 border border-slate-800 space-y-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-indigo-400" />
                Category Distribution
              </h2>
              <p className="text-xs text-slate-400">Ratio of tickets by domain</p>
            </div>

            <div className="h-72 w-full flex items-center justify-center">
              {charts?.categoryBreakdown && charts.categoryBreakdown.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={charts.categoryBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="count"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {charts.categoryBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-xs text-slate-500">No category data available</div>
              )}
            </div>
          </div>
        </div>

        {/* Charts Row 2: Error Distribution by Laboratory (Bar Chart) */}
        <div className="glass-panel-elevated rounded-2xl p-6 border border-slate-800 space-y-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              Incidents Logged Across Laboratories
            </h2>
            <p className="text-xs text-slate-400">Comparing failure load from Lab 1 to Lab 6</p>
          </div>

          <div className="h-72 w-full pt-4">
            {charts?.labDistribution ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={charts.labDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="lab" stroke="#64748b" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} />
                  <Bar dataKey="tickets" fill="#0ea5e9" radius={[6, 6, 0, 0]} name="Total Tickets" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-500 text-xs">Loading chart...</div>
            )}
          </div>
        </div>

        {/* Top Recurring Error Codes Table */}
        <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
          <div className="p-4 sm:p-5 bg-slate-900/60 border-b border-slate-800">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-sky-400" />
              Top Recurring Error Signatures Extracted by Diagnostic Engine
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/70 text-slate-400 font-mono text-[11px] uppercase border-b border-slate-800">
                <tr>
                  <th className="p-3.5">Error Code Signature</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Occurrences</th>
                  <th className="p-3.5">Automated Resolution Impact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {charts?.topRecurringErrors && charts.topRecurringErrors.length > 0 ? (
                  charts.topRecurringErrors.map((err, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/30">
                      <td className="p-3.5 font-mono font-bold text-sky-300">
                        {err.errorCode}
                      </td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300">
                          {err.category}
                        </span>
                      </td>
                      <td className="p-3.5 font-mono text-emerald-400 font-semibold">
                        {err.count} times detected
                      </td>
                      <td className="p-3.5 text-slate-400">
                        Pre-indexed solution matches automatically served to students.
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-slate-500">
                      No recurring errors recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
