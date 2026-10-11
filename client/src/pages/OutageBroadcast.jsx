import React, { useState, useEffect } from 'react';
import {
  Radio,
  Plus,
  AlertTriangle,
  Clock,
  CheckCircle,
  Trash2,
  Calendar,
  Layers,
  RefreshCw,
  X,
  ExternalLink,
} from 'lucide-react';
import { getOutages, createOutage, updateOutage, deleteOutage } from '../services/api';
import CountdownTimer from '../components/CountdownTimer';

export default function OutageBroadcast() {
  const [outages, setOutages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [affectedLocation, setAffectedLocation] = useState('Campus-Wide');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState('Major');
  const [durationHours, setDurationHours] = useState('2');
  const [impactedServices, setImpactedServices] = useState(['LAN / Internet']);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableServices = [
    'LAN / Internet',
    'Primary DNS Server',
    'DHCP IP Allocation',
    'GPU Cluster & CUDA Drivers',
    'Campus Intranet & Portal',
    'Active Directory / LDAP Login',
  ];

  useEffect(() => {
    loadOutages();
  }, []);

  const loadOutages = async () => {
    setLoading(true);
    try {
      const res = await getOutages();
      if (res.data.success) {
        setOutages(res.data.outages);
      }
    } catch (err) {
      console.error('Failed to load outages', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOutage = async (e) => {
    e.preventDefault();
    if (!title) {
      alert('Please enter an outage title');
      return;
    }

    setIsSubmitting(true);
    try {
      const estimatedEndTime = new Date(Date.now() + parseFloat(durationHours) * 60 * 60 * 1000);
      const res = await createOutage({
        affectedLocation,
        title,
        description,
        severity,
        estimatedEndTime,
        impactedServices,
        status: 'In Progress',
      });

      if (res.data.success) {
        setShowModal(false);
        setTitle('');
        setDescription('');
        loadOutages();
      }
    } catch (err) {
      console.error('Failed to publish outage', err);
      alert('Error publishing outage notice');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResolveOutage = async (id) => {
    try {
      await updateOutage(id, {
        status: 'Resolved',
        resolutionNotes: 'Marked resolved by IT Administrator.',
      });
      loadOutages();
    } catch (err) {
      alert('Failed to resolve outage');
    }
  };

  const handleExtendHour = async (outage) => {
    try {
      const currentEnd = new Date(outage.estimatedEndTime);
      const newEnd = new Date(currentEnd.getTime() + 60 * 60 * 1000);
      await updateOutage(outage._id, {
        estimatedEndTime: newEnd,
      });
      loadOutages();
    } catch (err) {
      alert('Failed to extend outage');
    }
  };

  const handleDeleteOutage = async (id) => {
    if (window.confirm('Delete this outage announcement permanently?')) {
      try {
        await deleteOutage(id);
        loadOutages();
      } catch (err) {
        alert('Failed to delete outage');
      }
    }
  };

  const toggleService = (svc) => {
    if (impactedServices.includes(svc)) {
      setImpactedServices(impactedServices.filter((s) => s !== svc));
    } else {
      setImpactedServices([...impactedServices, svc]);
    }
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30">
                Broadcast Control Center
              </span>
              <span className="text-xs text-slate-400 font-mono">Outage Registry</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Campus & Laboratory Maintenance Broadcasts
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Publish announcements with live ETA countdowns that automatically intercept redundant student issue reports
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadOutages}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>

            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white shadow-lg shadow-rose-600/20 flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4" />
              Publish New Outage
            </button>
          </div>
        </div>

        {/* Outages Registry Table */}
        <div className="glass-panel-elevated rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
          <div className="p-4 sm:p-5 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Radio className="w-4 h-4 text-rose-400" />
              Outage Registry & Broadcast History
            </h2>
            <span className="text-xs font-mono text-slate-400">
              Total Notices: {outages.length}
            </span>
          </div>

          {outages.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-500">
              No outage notices registered. Click &quot;Publish New Outage&quot; above to create one.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/70 text-slate-400 font-mono text-[11px] uppercase border-b border-slate-800">
                  <tr>
                    <th className="p-3.5">Outage ID</th>
                    <th className="p-3.5">Affected Zone</th>
                    <th className="p-3.5">Title & Description</th>
                    <th className="p-3.5">Severity</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Live ETA Countdown</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-sans">
                  {outages.map((outage) => (
                    <tr key={outage._id} className="hover:bg-slate-800/30">
                      <td className="p-3.5 font-mono font-bold text-slate-300">
                        {outage.outageId}
                      </td>

                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-slate-800 text-sky-300 border border-slate-700">
                          {outage.affectedLocation}
                        </span>
                      </td>

                      <td className="p-3.5 max-w-sm">
                        <div className="font-semibold text-white">
                          {outage.title}
                        </div>
                        {outage.description && (
                          <div className="text-[11px] text-slate-400 truncate mt-0.5">
                            {outage.description}
                          </div>
                        )}
                        {outage.impactedServices && outage.impactedServices.length > 0 && (
                          <div className="flex items-center gap-1 mt-1 flex-wrap">
                            {outage.impactedServices.map((svc, i) => (
                              <span key={i} className="text-[10px] px-1.5 py-0.2 rounded bg-slate-900 text-slate-400 border border-slate-800">
                                {svc}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>

                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          outage.severity === 'Critical'
                            ? 'bg-rose-950 text-rose-300 border border-rose-800'
                            : outage.severity === 'Major'
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : 'bg-blue-950 text-blue-300 border border-blue-800'
                        }`}>
                          {outage.severity}
                        </span>
                      </td>

                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          outage.status === 'In Progress'
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}>
                          {outage.status}
                        </span>
                      </td>

                      <td className="p-3.5">
                        {outage.status === 'In Progress' ? (
                          <CountdownTimer targetDate={outage.estimatedEndTime} compact={true} />
                        ) : (
                          <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
                            <CheckCircle className="w-3.5 h-3.5" /> Resolved
                          </span>
                        )}
                      </td>

                      <td className="p-3.5 text-right space-x-1.5">
                        {outage.status === 'In Progress' && (
                          <>
                            <button
                              onClick={() => handleResolveOutage(outage._id)}
                              className="px-2.5 py-1 rounded bg-emerald-600/80 hover:bg-emerald-600 text-white text-[11px] font-semibold transition-colors"
                              title="Mark Resolved"
                            >
                              Resolve
                            </button>
                            <button
                              onClick={() => handleExtendHour(outage)}
                              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium transition-colors"
                              title="Add 1 Hour to ETA"
                            >
                              +1h
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDeleteOutage(outage._id)}
                          className="p-1.5 rounded text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                          title="Delete notice"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Create Outage Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    <Radio className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Publish Outage Announcement</h3>
                    <p className="text-xs text-slate-400">Broadcast maintenance to students</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateOutage} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Affected Location *
                    </label>
                    <select
                      value={affectedLocation}
                      onChange={(e) => setAffectedLocation(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
                    >
                      <option value="Campus-Wide">Campus-Wide (All Labs)</option>
                      <option value="Lab 1">Lab 1 (Networking)</option>
                      <option value="Lab 2">Lab 2 (AI & GPU)</option>
                      <option value="Lab 3">Lab 3 (Cloud)</option>
                      <option value="Lab 4">Lab 4 (Operating Systems)</option>
                      <option value="Lab 5">Lab 5 (Software Eng)</option>
                      <option value="Lab 6">Lab 6 (IoT & Embedded)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Severity Level
                    </label>
                    <select
                      value={severity}
                      onChange={(e) => setSeverity(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
                    >
                      <option value="Minor">Minor (Degraded Performance)</option>
                      <option value="Major">Major (Intermittent Service Loss)</option>
                      <option value="Critical">Critical (Complete Downtime)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Outage Headline / Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Core Switch Firmware Reload & VLAN Re-tagging"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Description & Technician Notice
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Detailed explanation of reason for maintenance..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Estimated Resolution Duration
                  </label>
                  <select
                    value={durationHours}
                    onChange={(e) => setDurationHours(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
                  >
                    <option value="0.5">30 Minutes</option>
                    <option value="1">1 Hour</option>
                    <option value="2">2 Hours</option>
                    <option value="4">4 Hours</option>
                    <option value="8">8 Hours</option>
                    <option value="24">24 Hours</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Impacted Services
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {availableServices.map((svc) => (
                      <button
                        key={svc}
                        type="button"
                        onClick={() => toggleService(svc)}
                        className={`text-left p-2 rounded-lg text-xs border transition-all ${
                          impactedServices.includes(svc)
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 font-semibold'
                            : 'bg-slate-800/60 text-slate-400 border-slate-700'
                        }`}
                      >
                        {svc}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/25 flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Publishing...' : 'Publish Broadcast'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
