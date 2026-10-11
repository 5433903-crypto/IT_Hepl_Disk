import React, { useState, useEffect } from 'react';
import {
  Database,
  Search,
  Plus,
  BookOpen,
  Terminal,
  CheckCircle,
  AlertCircle,
  Copy,
  Check,
  X,
  RefreshCw,
  Sparkles,
  Cpu,
} from 'lucide-react';
import { getAllKB, createKB, deleteKB } from '../services/api';

export default function KnowledgeBasePage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [copiedCmd, setCopiedCmd] = useState(null);

  // New Article Modal
  const [showModal, setShowModal] = useState(false);
  const [errorCode, setErrorCode] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Network');
  const [symptoms, setSymptoms] = useState('');
  const [resolutionSteps, setResolutionSteps] = useState('');
  const [suggestedCommands, setSuggestedCommands] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadArticles();
  }, [search, categoryFilter]);

  const loadArticles = async () => {
    setLoading(true);
    try {
      const res = await getAllKB({
        search,
        category: categoryFilter,
      });
      if (res.data.success) {
        setArticles(res.data.articles);
      }
    } catch (err) {
      console.error('Failed to load KB articles', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateArticle = async (e) => {
    e.preventDefault();
    if (!errorCode || !title || !resolutionSteps) {
      alert('Please fill out error code, title, and resolution steps.');
      return;
    }

    setIsSubmitting(true);
    try {
      const stepsArray = resolutionSteps.split('\n').filter(s => s.trim().length > 0);
      const cmdsArray = suggestedCommands.split('\n').filter(s => s.trim().length > 0);
      const symptomsArray = symptoms.split('\n').filter(s => s.trim().length > 0);

      const res = await createKB({
        errorCode: errorCode.trim().toUpperCase(),
        title: title.trim(),
        category,
        symptoms: symptomsArray,
        resolutionSteps: stepsArray,
        suggestedCommands: cmdsArray,
      });

      if (res.data.success) {
        setShowModal(false);
        setErrorCode('');
        setTitle('');
        setSymptoms('');
        setResolutionSteps('');
        setSuggestedCommands('');
        loadArticles();
      }
    } catch (err) {
      alert('Failed to create article');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (cmd, id) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold uppercase tracking-wider bg-sky-500/20 text-sky-300 border border-sky-500/30">
                Pre-Indexed Knowledge Base
              </span>
              <span className="text-xs text-slate-400 font-mono">Automated Fallback Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Campus IT Diagnostic Solutions Repository
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Curated resolution steps and terminal commands utilized by the local AI/OCR diagnostic matcher
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadArticles}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>

            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white shadow-lg shadow-sky-500/20 flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4" />
              Add KB Article
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="glass-panel rounded-2xl p-4 border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Error Code (e.g. DNS_PROBE, CUDA, BSOD), keyword, or symptom..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 font-medium"
            />
          </div>

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

        {/* Articles Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {articles.map((article) => (
            <div
              key={article._id}
              className="glass-panel-elevated rounded-2xl p-6 border border-slate-800 hover:border-sky-500/40 transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-mono text-xs font-bold text-sky-400 bg-sky-950/80 px-2 py-0.5 rounded border border-sky-800">
                    {article.errorCode}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-300">
                      {article.category}
                    </span>
                    <span className="text-[11px] font-mono text-emerald-400 font-semibold">
                      {article.successRate || 92}% Solved
                    </span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-white mb-2">
                  {article.title}
                </h3>

                {article.symptoms && article.symptoms.length > 0 && (
                  <div className="mb-3">
                    <span className="text-[11px] text-slate-400 font-semibold block mb-1">Common Symptoms:</span>
                    <ul className="text-xs text-slate-300 list-disc list-inside space-y-0.5">
                      {article.symptoms.map((symp, i) => (
                        <li key={i}>{symp}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Resolution Steps */}
                <div className="mb-3">
                  <span className="text-[11px] text-slate-400 font-semibold block mb-1">Standard Resolution Steps:</span>
                  <div className="space-y-1.5">
                    {article.resolutionSteps?.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-200">
                        <span className="w-4 h-4 rounded-full bg-slate-800 text-sky-300 font-mono text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Suggested terminal commands */}
                {article.suggestedCommands && article.suggestedCommands.length > 0 && (
                  <div>
                    <span className="text-[11px] text-slate-400 font-semibold block mb-1">Copyable Fix Commands:</span>
                    <div className="space-y-1.5">
                      {article.suggestedCommands.map((cmd, idx) => {
                        const copyId = `${article._id}-${idx}`;
                        return (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-2 rounded-lg bg-black/60 border border-slate-800 font-mono text-xs text-sky-300"
                          >
                            <span className="truncate mr-2">$ {cmd}</span>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(cmd, copyId)}
                              className="p-1 rounded text-slate-400 hover:text-white transition-colors shrink-0"
                            >
                              {copiedCmd === copyId ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {article.escalateIf && (
                <div className="pt-3 border-t border-slate-800/80 text-[11px] text-amber-300/90 flex items-center gap-1.5 italic">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Escalate to tech if: {article.escalateIf}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Create KB Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Create Knowledge Base Solution</h3>
                    <p className="text-xs text-slate-400">Index new diagnostic pattern</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateArticle} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">Error Code Identifier *</label>
                    <input
                      type="text"
                      value={errorCode}
                      onChange={(e) => setErrorCode(e.target.value)}
                      placeholder="e.g. ERR_SSL_PROTOCOL_ERROR"
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white font-mono uppercase"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                    >
                      <option value="Network">Network</option>
                      <option value="Hardware">Hardware</option>
                      <option value="Software">Software</option>
                      <option value="OS / Driver">OS / Driver</option>
                      <option value="Server / Login">Server / Login</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Article Title *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Campus SSL Proxy Handshake Failure"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">
                    Common Symptoms (1 per line)
                  </label>
                  <textarea
                    rows={2}
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    placeholder="e.g. Browser reports connection is not private..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">
                    Step-by-Step Resolution Steps * (1 per line)
                  </label>
                  <textarea
                    rows={3}
                    value={resolutionSteps}
                    onChange={(e) => setResolutionSteps(e.target.value)}
                    placeholder="Step 1: Check system clock&#10;Step 2: Reinstall campus root certificate&#10;Step 3: Flush DNS cache"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">
                    Suggested Terminal Commands (1 per line)
                  </label>
                  <textarea
                    rows={2}
                    value={suggestedCommands}
                    onChange={(e) => setSuggestedCommands(e.target.value)}
                    placeholder="w32tm /resync&#10;ipconfig /flushdns"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white font-mono"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold shadow-lg shadow-sky-600/20"
                  >
                    {isSubmitting ? 'Saving...' : 'Save Knowledge Base Article'}
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
