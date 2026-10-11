import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { analyzeReport, createTicket, getTickets } from '../services/api';
import OutageBanner from '../components/OutageBanner';
import SampleErrorSelector from '../components/SampleErrorSelector';
import CountdownTimer from '../components/CountdownTimer';
import {
  Upload,
  Cpu,
  CheckCircle,
  AlertTriangle,
  Send,
  Sparkles,
  Terminal,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  Check,
  Copy,
  Clock,
  Eye,
  FileCheck2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

export default function StudentDashboard() {
  const { user } = useAuth();

  // Form State
  const [labNumber, setLabNumber] = useState(user?.assignedLab || 'Lab 2');
  const [pcNumber, setPcNumber] = useState(user?.assignedPc || 'PC-14');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Diagnostic State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [diagnosticResult, setDiagnosticResult] = useState(null);
  const [analysisStep, setAnalysisStep] = useState('');

  // Escalation / Ticket State
  const [isEscalating, setIsEscalating] = useState(false);
  const [escalatedTicket, setEscalatedTicket] = useState(null);
  const [solvedSuccessfully, setSolvedSuccessfully] = useState(false);

  // Student Tickets History
  const [studentTickets, setStudentTickets] = useState([]);
  const [copiedIndex, setCopiedIndex] = useState(null);

  useEffect(() => {
    loadMyTickets();
  }, [user]);

  const loadMyTickets = async () => {
    try {
      const res = await getTickets({
        studentId: user?.id,
        search: user?.rollNo,
      });
      if (res.data.success) {
        setStudentTickets(res.data.tickets);
      }
    } catch (err) {
      console.error('Failed to load tickets', err);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSelectSample = (sample) => {
    setLabNumber(sample.lab);
    setPcNumber(sample.pc);
    setDescription(sample.description);
    setDiagnosticResult(null);
    setEscalatedTicket(null);
    setSolvedSuccessfully(false);

    // Create a mock canvas image for visual realism
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 360;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, 640, 360);
    ctx.fillStyle = '#f43f5e';
    ctx.font = 'bold 20px monospace';
    ctx.fillText(`[ERROR DIAGNOSTIC SCREEN - ${sample.errorCode}]`, 40, 60);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '14px monospace';
    ctx.fillText(`Target: ${sample.lab} - ${sample.pc}`, 40, 100);
    ctx.fillText(`Message: ${sample.description}`, 40, 130);
    ctx.fillStyle = '#38bdf8';
    ctx.fillText(`Category: ${sample.category}`, 40, 170);

    canvas.toBlob((blob) => {
      const mockFile = new File([blob], `${sample.errorCode.toLowerCase()}.png`, { type: 'image/png' });
      setImageFile(mockFile);
      setImagePreview(canvas.toDataURL());
    });
  };

  const handleRunDiagnostics = async (e) => {
    e.preventDefault();
    if (!labNumber) {
      alert('Please select your laboratory number');
      return;
    }

    setIsAnalyzing(true);
    setDiagnosticResult(null);
    setEscalatedTicket(null);
    setSolvedSuccessfully(false);

    // Step 1: Simulate scanning stages for high-tech user experience
    setAnalysisStep('Querying Campus Outage Registry for ' + labNumber + '...');

    const formData = new FormData();
    formData.append('labNumber', labNumber);
    formData.append('pcNumber', pcNumber || 'PC-01');
    formData.append('description', description);
    formData.append('studentName', user?.name || 'Student');
    formData.append('studentRollNo', user?.rollNo || 'N/A');
    if (imageFile) {
      formData.append('errorImage', imageFile);
    }

    try {
      // Step 2: Call backend API endpoint
      const res = await analyzeReport(formData);

      if (res.data.success) {
        if (res.data.type === 'OUTAGE_ALERT') {
          setAnalysisStep('Active Outage Flagged! Halting AI scan.');
          setDiagnosticResult({
            type: 'OUTAGE_ALERT',
            data: res.data,
          });
        } else {
          setAnalysisStep('No active outage. Vision AI OCR & Pattern Matching complete.');
          setDiagnosticResult({
            type: 'AI_SOLUTION',
            solution: res.data.solution,
            imageUrl: res.data.imageUrl,
          });
        }
      }
    } catch (err) {
      console.error('Diagnostic error', err);
      alert(err.response?.data?.message || 'Error executing diagnostic check');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleOneClickEscalate = async () => {
    setIsEscalating(true);
    try {
      const solution = diagnosticResult?.solution;
      const formData = new FormData();
      formData.append('labNumber', labNumber);
      formData.append('pcNumber', pcNumber);
      formData.append('title', solution ? `Escalated: ${solution.title}` : `Unresolved Issue at ${labNumber} - ${pcNumber}`);
      formData.append('description', description || (solution ? `Symptoms: ${solution.symptoms?.join(', ')}` : 'Issue reported by student.'));
      formData.append('category', solution?.category || 'Network');
      formData.append('severity', 'High');
      formData.append('studentName', user?.name || 'Student');
      formData.append('studentRollNo', user?.rollNo || 'N/A');
      formData.append('department', user?.department || 'Computer Engineering');
      if (solution) {
        formData.append('aiResult', JSON.stringify(solution));
      }
      if (imageFile) {
        formData.append('errorImage', imageFile);
      }

      const res = await createTicket(formData);
      if (res.data.success) {
        setEscalatedTicket(res.data.ticket);
        loadMyTickets();
      }
    } catch (err) {
      console.error('Escalation failed', err);
      alert('Failed to escalate ticket. Please notify lab technician directly.');
    } finally {
      setIsEscalating(false);
    }
  };

  const copyToClipboard = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 pb-16">
      {/* College-wide active outage top broadcast */}
      <OutageBanner />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Student Session Context Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl glass-panel border border-sky-500/20 mb-8 bg-gradient-to-r from-slate-900/90 via-sky-950/20 to-slate-900/90 shadow-xl">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold uppercase tracking-wider bg-sky-500/20 text-sky-300 border border-sky-500/30">
                Student Terminal Session
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {user?.department || 'Computer Engineering'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white mt-1.5 flex items-center gap-2">
              Welcome, {user?.name || 'Student'}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Roll No: <span className="font-mono text-slate-200 font-semibold">{user?.rollNo || 'CS-2022-042'}</span> | Assigned Lab: <span className="text-sky-300 font-medium">{user?.assignedLab || 'Lab 2'}</span> ({user?.assignedPc || 'PC-14'})
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700/80 text-center">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">Fast-Check Flow</div>
              <div className="text-xs font-mono font-bold text-emerald-400 flex items-center justify-center gap-1 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                Dual-Tier Active
              </div>
            </div>
          </div>
        </div>

        {/* 1-Click Test Scenarios Selector */}
        <SampleErrorSelector onSelect={handleSelectSample} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT COLUMN: Report Issue & Diagnostic Submission (5 cols) */}
          <div className="lg:col-span-5">
            <div className="glass-panel-elevated rounded-2xl p-6 border border-slate-800 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
                    <Terminal className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">Laboratory Diagnostic Scanner</h2>
                    <p className="text-xs text-slate-400">Step 1: Outage Check • Step 2: Vision AI Analysis</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleRunDiagnostics} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Laboratory Location *
                    </label>
                    <select
                      value={labNumber}
                      onChange={(e) => setLabNumber(e.target.value)}
                      className="w-full bg-slate-900/90 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 font-medium"
                    >
                      <option value="Lab 1">Lab 1 (Networking & Cyber)</option>
                      <option value="Lab 2">Lab 2 (AI, GPU & HPC) [Outage Demo]</option>
                      <option value="Lab 3">Lab 3 (Cloud & Distributed)</option>
                      <option value="Lab 4">Lab 4 (Operating Systems)</option>
                      <option value="Lab 5">Lab 5 (Software Engineering)</option>
                      <option value="Lab 6">Lab 6 (IoT & Embedded)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      PC / Workstation ID *
                    </label>
                    <input
                      type="text"
                      value={pcNumber}
                      onChange={(e) => setPcNumber(e.target.value)}
                      placeholder="e.g. PC-14"
                      className="w-full bg-slate-900/90 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Error Description / Symptoms
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe what happened: e.g. DNS NXDOMAIN error in browser, network cable light not blinking..."
                    className="w-full bg-slate-900/90 border border-slate-700 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-sky-500"
                  />
                </div>

                {/* Screenshot Upload or Preview */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center justify-between">
                    <span>Upload Error Screenshot / Photo</span>
                    <span className="text-[11px] text-slate-400 font-normal">Optional (JPG, PNG)</span>
                  </label>

                  {imagePreview ? (
                    <div className="relative rounded-xl overflow-hidden border border-sky-500/40 bg-slate-950 p-2 group">
                      <img
                        src={imagePreview}
                        alt="Error preview"
                        className="w-full h-40 object-contain rounded-lg bg-black"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview(null);
                        }}
                        className="absolute top-3 right-3 bg-rose-600/90 hover:bg-rose-500 text-white text-[11px] px-2.5 py-1 rounded-md shadow transition-colors"
                      >
                        Remove Image
                      </button>
                    </div>
                  ) : (
                    <label className="border-2 border-dashed border-slate-700 hover:border-sky-500/70 rounded-xl p-5 flex flex-col items-center justify-center cursor-pointer bg-slate-900/40 hover:bg-slate-900/70 transition-all">
                      <Upload className="w-6 h-6 text-sky-400 mb-2" />
                      <span className="text-xs font-medium text-slate-300">
                        Click to upload error screenshot
                      </span>
                      <span className="text-[11px] text-slate-500 mt-0.5">
                        Captured via Snipping Tool or phone camera
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isAnalyzing}
                  className="w-full py-3 px-4 rounded-xl font-semibold text-xs sm:text-sm bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>{analysisStep || 'Analyzing Laboratory Issue...'}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Run Intelligent Diagnostics</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* RIGHT COLUMN: Diagnostic Results / Outage Card / Escalation (7 cols) */}
          <div className="lg:col-span-7">
            {/* If analyzing: High-tech scanning visual */}
            {isAnalyzing && (
              <div className="glass-panel-elevated rounded-2xl p-8 border border-sky-500/40 text-center flex flex-col items-center justify-center min-h-[400px]">
                <div className="relative w-20 h-20 mb-4">
                  <div className="absolute inset-0 rounded-full border-4 border-sky-500/20 animate-ping" />
                  <div className="absolute inset-0 rounded-full border-4 border-t-sky-400 border-r-transparent border-b-indigo-500 border-l-transparent animate-spin" />
                  <div className="absolute inset-3 rounded-full bg-slate-900 flex items-center justify-center text-sky-400">
                    <Cpu className="w-7 h-7 animate-pulse" />
                  </div>
                </div>
                <h3 className="text-base font-bold text-white mb-1">
                  Executing Dual-Tiered Diagnostic Sequence
                </h3>
                <p className="text-xs text-sky-300 font-mono max-w-md animate-pulse">
                  {analysisStep}
                </p>
                <div className="mt-6 flex items-center gap-4 text-[11px] text-slate-400 font-mono">
                  <span className="flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> DB Outage Check
                  </span>
                  <span>→</span>
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-sky-400" /> Vision AI / OCR
                  </span>
                  <span>→</span>
                  <span className="flex items-center gap-1">
                    <Terminal className="w-3.5 h-3.5 text-indigo-400" /> KB Matching
                  </span>
                </div>
              </div>
            )}

            {/* CASE 1: ACTIVE OUTAGE DETECTED */}
            {!isAnalyzing && diagnosticResult?.type === 'OUTAGE_ALERT' && (
              <div className="glass-panel-elevated rounded-2xl p-6 border-2 border-rose-500/60 bg-gradient-to-b from-rose-950/40 via-slate-900/90 to-slate-900 shadow-2xl relative overflow-hidden">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/40 shrink-0">
                      <AlertTriangle className="w-6 h-6 animate-pulse" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-600/40 text-rose-300 border border-rose-500/40">
                          Known Outage Detected
                        </span>
                        <span className="text-xs font-semibold text-slate-300">
                          Affected: {diagnosticResult.data.affectedLocation}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-white mt-1">
                        {diagnosticResult.data.title}
                      </h3>
                    </div>
                  </div>
                </div>

                <div className="bg-black/40 rounded-xl p-4 border border-rose-500/20 mb-4">
                  <p className="text-xs text-rose-200/90 leading-relaxed">
                    {diagnosticResult.data.description || 'An active laboratory outage or scheduled maintenance is currently in progress for this location.'}
                  </p>

                  <div className="mt-4 pt-3 border-t border-rose-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Live Countdown</span>
                      <CountdownTimer targetDate={diagnosticResult.data.estimatedEndTime} />
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Severity</span>
                      <span className="text-xs font-bold text-rose-400 uppercase">
                        {diagnosticResult.data.severity} Impact
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white">Intelligent Flow Benefit:</span> No redundant Vision AI credits were spent. IT technicians are already dispatched and actively resolving this maintenance event.
                  </div>
                </div>
              </div>
            )}

            {/* CASE 2: AI SOLUTION GENERATED (No outage active) */}
            {!isAnalyzing && diagnosticResult?.type === 'AI_SOLUTION' && (
              <div className="glass-panel-elevated rounded-2xl p-6 border border-sky-500/30 bg-slate-900/80 shadow-2xl space-y-5">
                {/* Header & Badges */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        {diagnosticResult.solution.category}
                      </span>
                      <span className="text-xs font-mono text-slate-400">
                        Error: <span className="text-sky-300 font-semibold">{diagnosticResult.solution.errorCode}</span>
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white mt-1">
                      {diagnosticResult.solution.title}
                    </h3>
                  </div>

                  {/* AI Provider Transparency Badge */}
                  <div className="text-right shrink-0">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${
                      diagnosticResult.solution.isAiFallback
                        ? 'bg-amber-950/60 text-amber-300 border-amber-700/50'
                        : 'bg-indigo-950/60 text-indigo-300 border-indigo-700/50'
                    }`}>
                      <Sparkles className="w-3.5 h-3.5" />
                      {diagnosticResult.solution.provider}
                    </span>
                    <div className="text-[10px] text-slate-400 mt-1">
                      Confidence Score: <span className="font-mono text-emerald-400 font-bold">{diagnosticResult.solution.confidence}%</span>
                    </div>
                  </div>
                </div>

                {/* Step-by-Step Actionable Checklist */}
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2.5 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    Targeted Troubleshooting Steps (Try at your PC)
                  </h4>
                  <div className="space-y-2">
                    {diagnosticResult.solution.resolutionSteps?.map((step, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60 text-xs text-slate-200"
                      >
                        <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 font-mono text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="leading-relaxed">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Copyable Terminal Commands */}
                {diagnosticResult.solution.suggestedCommands && diagnosticResult.solution.suggestedCommands.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
                      <Terminal className="w-4 h-4 text-sky-400" />
                      Terminal Fix Commands
                    </h4>
                    <div className="space-y-1.5">
                      {diagnosticResult.solution.suggestedCommands.map((cmd, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2 rounded-lg bg-black/60 border border-slate-800 font-mono text-xs text-sky-300"
                        >
                          <span className="truncate mr-2">$ {cmd}</span>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(cmd, idx)}
                            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0"
                            title="Copy command"
                          >
                            {copiedIndex === idx ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Feedback & One-Click Escalation */}
                {!escalatedTicket && !solvedSuccessfully && (
                  <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 mt-4">
                    <h5 className="text-xs font-semibold text-white mb-2">
                      Did this solve the issue at your computer?
                    </h5>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setSolvedSuccessfully(true)}
                        className="px-4 py-2 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 transition-colors"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        Yes, Problem Resolved!
                      </button>

                      <button
                        type="button"
                        onClick={handleOneClickEscalate}
                        disabled={isEscalating}
                        className="px-4 py-2 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white flex items-center gap-1.5 shadow-lg shadow-rose-600/20 transition-all disabled:opacity-50"
                      >
                        {isEscalating ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Send className="w-3.5 h-3.5" />
                        )}
                        No, Escalate to IT Support Ticket
                      </button>
                    </div>
                  </div>
                )}

                {/* Solved celebration */}
                {solvedSuccessfully && (
                  <div className="p-4 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                    <div className="text-xs">
                      <span className="font-bold text-white block">Glad to hear that!</span>
                      No technician ticket was opened, saving IT department queue time. You may continue your lab session.
                    </div>
                  </div>
                )}

                {/* Escalated confirmation card */}
                {escalatedTicket && (
                  <div className="p-4 rounded-xl bg-sky-950/50 border border-sky-500/40 text-sky-300">
                    <div className="flex items-center gap-2">
                      <FileCheck2 className="w-5 h-5 text-sky-400 shrink-0" />
                      <div>
                        <span className="font-bold text-white text-sm">
                          Ticket Escalated: {escalatedTicket.ticketNumber}
                        </span>
                        <p className="text-xs text-sky-200/80 mt-0.5">
                          Assigned to IT technician queue with attached diagnostic logs & PC #{escalatedTicket.pcNumber}.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Empty state when no test has run yet */}
            {!isAnalyzing && !diagnosticResult && (
              <div className="glass-panel rounded-2xl p-8 border border-slate-800 text-center flex flex-col items-center justify-center min-h-[380px]">
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-slate-500 mb-3">
                  <Terminal className="w-8 h-8 text-sky-400/60" />
                </div>
                <h3 className="text-base font-bold text-white">
                  Automated Lab Diagnostic System Ready
                </h3>
                <p className="text-xs text-slate-400 max-w-sm mt-1">
                  Select your Lab PC on the left and run diagnostics, or click one of the 1-Click Test Scenarios above to simulate a real hardware/network failure!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* BOTTOM SECTION: Student's Ticket History */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-sky-400" />
                My Support Tickets & Escalation History
              </h2>
              <p className="text-xs text-slate-400">Track technician progress on unresolved laboratory issues</p>
            </div>
            <button
              onClick={loadMyTickets}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </button>
          </div>

          <div className="glass-panel rounded-xl border border-slate-800 overflow-hidden">
            {studentTickets.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                No tickets filed under your student roll number yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/80 text-slate-400 font-mono text-[11px] uppercase border-b border-slate-800">
                    <tr>
                      <th className="p-3">Ticket ID</th>
                      <th className="p-3">Location</th>
                      <th className="p-3">Title / Issue</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Assigned Tech</th>
                      <th className="p-3">Technician Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-sans">
                    {studentTickets.map((t) => (
                      <tr key={t._id} className="hover:bg-slate-800/30">
                        <td className="p-3 font-mono font-semibold text-sky-300">
                          {t.ticketNumber}
                        </td>
                        <td className="p-3 font-mono text-slate-300">
                          {t.labNumber} • {t.pcNumber}
                        </td>
                        <td className="p-3 font-medium text-white max-w-xs truncate">
                          {t.title}
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
                            {t.category}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            t.status === 'Resolved'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : t.status === 'In Progress'
                              ? 'bg-amber-950 text-amber-400 border border-amber-800'
                              : 'bg-sky-950 text-sky-400 border border-sky-800'
                          }`}>
                            {t.status}
                          </span>
                        </td>
                        <td className="p-3 text-slate-300">
                          {t.assignedTo || 'Unassigned'}
                        </td>
                        <td className="p-3 text-slate-400 italic max-w-xs truncate">
                          {t.technicianNotes || 'Awaiting technician review'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
