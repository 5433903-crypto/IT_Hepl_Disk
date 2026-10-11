import React, { useState, useEffect } from 'react';
import {
  Layers,
  Activity,
  Server,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Edit2,
  Check,
  Shield,
  Radio,
} from 'lucide-react';
import { getAllLabs, updateLabStatus } from '../services/api';

export default function LabMatrix() {
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingLabId, setEditingLabId] = useState(null);
  const [editedNotice, setEditedNotice] = useState('');

  useEffect(() => {
    loadLabs();
  }, []);

  const loadLabs = async () => {
    setLoading(true);
    try {
      const res = await getAllLabs();
      if (res.data.success) {
        setLabs(res.data.labs);
      }
    } catch (err) {
      console.error('Failed to load labs', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (lab, newStatus) => {
    try {
      await updateLabStatus(lab._id, { status: newStatus });
      loadLabs();
    } catch (err) {
      alert('Failed to update lab status');
    }
  };

  const handleSaveNotice = async (labId) => {
    try {
      await updateLabStatus(labId, { currentNotice: editedNotice });
      setEditingLabId(null);
      loadLabs();
    } catch (err) {
      alert('Failed to update notice');
    }
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Laboratory Operations Matrix
              </span>
              <span className="text-xs text-slate-400 font-mono">Infrastructure Grid</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Campus Computer Laboratory Status Matrix
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Live status overview and quick toggle controls for individual campus laboratories
            </p>
          </div>

          <button
            onClick={loadLabs}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 self-start sm:self-center transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh Matrix
          </button>
        </div>

        {/* Labs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {labs.map((lab) => {
            const isEditing = editingLabId === lab._id;
            const isOnline = lab.status === 'Online';
            const isDegraded = lab.status === 'Degraded';
            const isOffline = lab.status === 'Offline';

            return (
              <div
                key={lab._id}
                className={`glass-panel-elevated rounded-2xl p-6 border transition-all relative overflow-hidden flex flex-col justify-between ${
                  isOffline
                    ? 'border-rose-500/50 shadow-rose-950/20'
                    : isDegraded
                    ? 'border-amber-500/50 shadow-amber-950/20'
                    : 'border-emerald-500/30 shadow-emerald-950/20'
                }`}
              >
                {/* Top Lab Header */}
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-extrabold text-sky-400 bg-sky-950/80 px-2 py-0.5 rounded border border-sky-800">
                          {lab.labNumber}
                        </span>
                        {lab.hasActiveOutage && (
                          <span className="flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40">
                            <Radio className="w-3 h-3 animate-pulse" /> Outage Active
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-bold text-white mt-1.5">
                        {lab.labName}
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        {lab.building}
                      </p>
                    </div>

                    {/* Status Badge */}
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1 border shrink-0 ${
                      isOnline
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : isDegraded
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${
                        isOnline ? 'bg-emerald-400 animate-pulse' : isDegraded ? 'bg-amber-400' : 'bg-rose-400'
                      }`} />
                      {lab.status}
                    </span>
                  </div>

                  {/* Network Infrastructure Meta */}
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 my-4 space-y-1.5 text-xs font-mono">
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Switch:</span>
                      <span className="text-slate-200 truncate max-w-[180px]">{lab.primarySwitch}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Subnet / Gateway:</span>
                      <span className="text-sky-300">{lab.subnet}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Workstations:</span>
                      <span className="text-emerald-400 font-bold">{lab.activePCs} / {lab.totalPCs} Online</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Active Tickets:</span>
                      <span className={lab.activeTicketsCount > 0 ? 'text-amber-400 font-bold' : 'text-slate-400'}>
                        {lab.activeTicketsCount} Unresolved
                      </span>
                    </div>
                  </div>

                  {/* Operational Notice */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                      <span>Technician Notice:</span>
                      {!isEditing && (
                        <button
                          onClick={() => {
                            setEditingLabId(lab._id);
                            setEditedNotice(lab.currentNotice || '');
                          }}
                          className="hover:text-white flex items-center gap-1"
                        >
                          <Edit2 className="w-3 h-3" /> Edit
                        </button>
                      )}
                    </div>

                    {isEditing ? (
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={editedNotice}
                          onChange={(e) => setEditedNotice(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white"
                        />
                        <button
                          onClick={() => handleSaveNotice(lab._id)}
                          className="p-1 rounded bg-sky-600 hover:bg-sky-500 text-white"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-300 italic bg-slate-900/40 p-2 rounded-lg border border-slate-800">
                        {lab.currentNotice || 'Nominal operational status.'}
                      </p>
                    )}
                  </div>
                </div>

                {/* Status Toggle Control Buttons */}
                <div className="pt-3 border-t border-slate-800/80">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block mb-1.5">
                    Toggle Lab Status:
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => handleToggleStatus(lab, 'Online')}
                      className={`py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        isOnline
                          ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 font-bold'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                      }`}
                    >
                      Online
                    </button>
                    <button
                      onClick={() => handleToggleStatus(lab, 'Degraded')}
                      className={`py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        isDegraded
                          ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30 font-bold'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                      }`}
                    >
                      Degraded
                    </button>
                    <button
                      onClick={() => handleToggleStatus(lab, 'Offline')}
                      className={`py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        isOffline
                          ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30 font-bold'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                      }`}
                    >
                      Offline
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
