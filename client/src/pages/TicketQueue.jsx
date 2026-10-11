import React, { useState, useEffect } from 'react';
import {
  FileText,
  Search,
  Filter,
  CheckCircle,
  Clock,
  AlertTriangle,
  User,
  MapPin,
  Cpu,
  Trash2,
  RefreshCw,
  ExternalLink,
  X,
  Sparkles,
  Save,
} from 'lucide-react';
import { getTickets, updateTicketStatus, deleteTicket } from '../services/api';

export default function TicketQueue() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState('All');
  const [labFilter, setLabFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [search, setSearch] = useState('');

  // Selected Ticket for Modal Drawer
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [statusUpdate, setStatusUpdate] = useState('');
  const [assignedToUpdate, setAssignedToUpdate] = useState('');
  const [notesUpdate, setNotesUpdate] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    loadTickets();
  }, [statusFilter, labFilter, categoryFilter, search]);

  const loadTickets = async () => {
    setLoading(true);
    try {
      const res = await getTickets({
        status: statusFilter,
        labNumber: labFilter,
        category: categoryFilter,
        search,
      });
      if (res.data.success) {
        setTickets(res.data.tickets);
      }
    } catch (err) {
      console.error('Failed to load tickets', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenTicket = (t) => {
    setSelectedTicket(t);
    setStatusUpdate(t.status);
    setAssignedToUpdate(t.assignedTo || 'Unassigned');
    setNotesUpdate(t.technicianNotes || '');
  };

  const handleSaveTicket = async () => {
    if (!selectedTicket) return;
    setIsUpdating(true);
    try {
      const res = await updateTicketStatus(selectedTicket._id, {
        status: statusUpdate,
        assignedTo: assignedToUpdate,
        technicianNotes: notesUpdate,
      });

      if (res.data.success) {
        setSelectedTicket(res.data.ticket);
        loadTickets();
      }
    } catch (err) {
      alert('Failed to update ticket');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this support ticket permanently?')) {
      try {
        await deleteTicket(id);
        setSelectedTicket(null);
        loadTickets();
      } catch (err) {
        alert('Failed to delete ticket');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold uppercase tracking-wider bg-sky-500/20 text-sky-300 border border-sky-500/30">
                Technician Queue Console
              </span>
              <span className="text-xs text-slate-400 font-mono">Real-time Triage</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Live Laboratory Ticket Queue
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Review escalated student issues, attached error logs, PC locations, and record technician resolution notes
            </p>
          </div>

          <button
            onClick={loadTickets}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 self-start sm:self-center transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh Queue
          </button>
        </div>

        {/* Filter Controls Bar */}
        <div className="glass-panel rounded-2xl p-4 border border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Ticket, Student, Roll No..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 font-medium"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 font-medium"
            >
              <option value="All">All Statuses</option>
              <option value="Open">Open (Pending Triage)</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          {/* Lab Filter */}
          <div>
            <select
              value={labFilter}
              onChange={(e) => setLabFilter(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 font-medium"
            >
              <option value="All">All Laboratories</option>
              <option value="Lab 1">Lab 1 (Networking)</option>
              <option value="Lab 2">Lab 2 (AI & GPU)</option>
              <option value="Lab 3">Lab 3 (Cloud)</option>
              <option value="Lab 4">Lab 4 (Operating Systems)</option>
              <option value="Lab 5">Lab 5 (Software Eng)</option>
              <option value="Lab 6">Lab 6 (IoT & Embedded)</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 font-medium"
            >
              <option value="All">All Categories</option>
              <option value="Network">Network</option>
              <option value="Hardware">Hardware</option>
              <option value="Software">Software</option>
              <option value="OS / Driver">OS / Driver</option>
              <option value="Server / Login">Server / Login</option>
            </select>
          </div>
        </div>

        {/* Tickets Table */}
        <div className="glass-panel-elevated rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
          {tickets.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-500">
              No support tickets found matching the specified filter criteria.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 text-slate-400 font-mono text-[11px] uppercase border-b border-slate-800">
                  <tr>
                    <th className="p-3.5">Ticket #</th>
                    <th className="p-3.5">Student</th>
                    <th className="p-3.5">Lab & PC</th>
                    <th className="p-3.5">Issue Headline</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Severity</th>
                    <th className="p-3.5">AI Error Code</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-sans">
                  {tickets.map((t) => (
                    <tr key={t._id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-3.5 font-mono font-bold text-sky-300">
                        {t.ticketNumber}
                      </td>

                      <td className="p-3.5">
                        <div className="font-semibold text-white">
                          {t.studentName}
                        </div>
                        <div className="text-[11px] font-mono text-slate-400">
                          {t.studentRollNo}
                        </div>
                      </td>

                      <td className="p-3.5">
                        <span className="font-mono text-slate-200 font-medium">
                          {t.labNumber}
                        </span>
                        <div className="text-[11px] font-mono text-slate-400">
                          {t.pcNumber}
                        </div>
                      </td>

                      <td className="p-3.5 max-w-xs truncate font-medium text-slate-200">
                        {t.title}
                      </td>

                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
                          {t.category}
                        </span>
                      </td>

                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          t.severity === 'Critical'
                            ? 'bg-rose-950 text-rose-300 border border-rose-800'
                            : t.severity === 'High'
                            ? 'bg-orange-950 text-orange-300 border border-orange-800'
                            : 'bg-slate-800 text-slate-300 border border-slate-700'
                        }`}>
                          {t.severity}
                        </span>
                      </td>

                      <td className="p-3.5 font-mono text-[11px] text-sky-400">
                        {t.aiResult?.errorCode || 'MANUAL_REPORT'}
                      </td>

                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          t.status === 'Resolved' || t.status === 'Closed'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : t.status === 'In Progress'
                            ? 'bg-amber-950 text-amber-400 border border-amber-800'
                            : 'bg-sky-950 text-sky-400 border border-sky-800'
                        }`}>
                          {t.status}
                        </span>
                      </td>

                      <td className="p-3.5 text-right space-x-1.5">
                        <button
                          onClick={() => handleOpenTicket(t)}
                          className="px-2.5 py-1 rounded-lg bg-sky-600/80 hover:bg-sky-500 text-white text-[11px] font-semibold transition-colors"
                        >
                          Triage & Notes
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Detailed Triage Modal / Drawer */}
        {selectedTicket && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-sky-400">
                      {selectedTicket.ticketNumber}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                      {selectedTicket.category}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-1">
                    {selectedTicket.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-5 text-xs">
                {/* Meta details */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono">
                  <div>
                    <span className="text-slate-400 block text-[10px]">STUDENT</span>
                    <span className="text-white font-semibold">{selectedTicket.studentName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">ROLL NUMBER</span>
                    <span className="text-slate-200">{selectedTicket.studentRollNo}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">LABORATORY</span>
                    <span className="text-sky-300 font-semibold">{selectedTicket.labNumber}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">PC WORKSTATION</span>
                    <span className="text-sky-300 font-semibold">{selectedTicket.pcNumber}</span>
                  </div>
                </div>

                {/* Description */}
                {selectedTicket.description && (
                  <div>
                    <h4 className="font-semibold text-slate-300 mb-1">Student Problem Description:</h4>
                    <p className="p-3 rounded-lg bg-slate-800/40 border border-slate-800 text-slate-200 leading-relaxed">
                      {selectedTicket.description}
                    </p>
                  </div>
                )}

                {/* Attached Screenshot */}
                {selectedTicket.imageUrl && (
                  <div>
                    <h4 className="font-semibold text-slate-300 mb-1">Attached Error Screenshot:</h4>
                    <div className="rounded-xl overflow-hidden border border-slate-800 bg-black p-2">
                      <img
                        src={selectedTicket.imageUrl}
                        alt="Error Screen"
                        className="max-h-56 mx-auto object-contain rounded-lg"
                      />
                    </div>
                  </div>
                )}

                {/* Attached AI Diagnostic Summary */}
                {selectedTicket.aiResult && selectedTicket.aiResult.errorCode && (
                  <div className="p-3.5 rounded-xl bg-sky-950/20 border border-sky-500/20 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sky-300 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                        AI Diagnostic Extraction
                      </span>
                      <span className="font-mono text-slate-400 text-[11px]">
                        Confidence: {selectedTicket.aiResult.confidence}%
                      </span>
                    </div>
                    <div className="font-mono text-slate-200">
                      Error Code: <strong className="text-white">{selectedTicket.aiResult.errorCode}</strong>
                    </div>
                    {selectedTicket.aiResult.matchedKbTitle && (
                      <div className="text-slate-300">
                        Matched Solution: {selectedTicket.aiResult.matchedKbTitle}
                      </div>
                    )}
                  </div>
                )}

                {/* Technician Triage Update Form */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <h4 className="font-semibold text-white uppercase tracking-wider text-[11px]">
                    Technician Action & Resolution Notes
                  </h4>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 mb-1 text-[11px]">Ticket Status</label>
                      <select
                        value={statusUpdate}
                        onChange={(e) => setStatusUpdate(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                      >
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1 text-[11px]">Assigned Technician</label>
                      <select
                        value={assignedToUpdate}
                        onChange={(e) => setAssignedToUpdate(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                      >
                        <option value="Unassigned">Unassigned</option>
                        <option value="Suresh Patil (Hardware & Net Tech)">Suresh Patil (Hardware & Net Tech)</option>
                        <option value="Prof. Rajesh Sharma (Head IT Admin)">Prof. Rajesh Sharma (Head IT Admin)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1 text-[11px]">
                      Technician Resolution Notes (Visible to Student)
                    </label>
                    <textarea
                      rows={3}
                      value={notesUpdate}
                      onChange={(e) => setNotesUpdate(e.target.value)}
                      placeholder="e.g. Re-crimped RJ-45 connector and tested link with Fluke network tester..."
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                    />
                  </div>
                </div>

                {/* Modal footer */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => handleDelete(selectedTicket._id)}
                    className="p-2 rounded-lg text-rose-400 hover:bg-rose-500/10 flex items-center gap-1.5"
                  >
                    <Trash2 className="w-4 h-4" /> Delete Ticket
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedTicket(null)}
                      className="px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveTicket}
                      disabled={isUpdating}
                      className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold flex items-center gap-1.5 shadow-lg shadow-sky-600/20"
                    >
                      <Save className="w-4 h-4" />
                      {isUpdating ? 'Saving...' : 'Save & Update Ticket'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
