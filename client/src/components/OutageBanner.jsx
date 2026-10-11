import React, { useEffect, useState } from 'react';
import { AlertTriangle, Radio, ShieldAlert, ChevronRight, X } from 'lucide-react';
import CountdownTimer from './CountdownTimer';
import { getActiveOutages } from '../services/api';

export default function OutageBanner({ staticOutage, onDismiss }) {
  const [activeOutages, setActiveOutages] = useState([]);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (staticOutage) {
      setActiveOutages([staticOutage]);
      return;
    }

    const loadOutages = async () => {
      try {
        const res = await getActiveOutages();
        if (res.data.success && res.data.outages.length > 0) {
          setActiveOutages(res.data.outages);
        }
      } catch (err) {
        console.error('Failed to load active outages for banner', err);
      }
    };

    loadOutages();
    const interval = setInterval(loadOutages, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, [staticOutage]);

  if (dismissed || activeOutages.length === 0) return null;

  const current = activeOutages[0];

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-rose-950/80 via-slate-900 to-rose-950/70 border-b border-rose-500/40 px-4 py-3 text-rose-100 shadow-lg backdrop-blur-md">
      {/* Background glowing indicator */}
      <div className="absolute -left-10 -top-10 w-40 h-40 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3 relative z-10">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-rose-500/20 border border-rose-500/30 text-rose-400 shrink-0 mt-0.5">
            <Radio className="w-5 h-5 animate-pulse text-rose-400" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider bg-rose-600/40 text-rose-300 border border-rose-500/50">
                <AlertTriangle className="w-3 h-3" />
                Active Outage Alert
              </span>

              <span className="px-2 py-0.5 rounded text-xs font-semibold bg-slate-800 text-sky-300 border border-slate-700">
                Location: {current.affectedLocation}
              </span>

              <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                current.severity === 'Critical'
                  ? 'bg-red-950 text-red-300 border border-red-700'
                  : 'bg-amber-950 text-amber-300 border border-amber-700'
              }`}>
                {current.severity} Severity
              </span>
            </div>

            <h3 className="text-sm font-semibold text-white mt-1">
              {current.title}
            </h3>

            {current.description && (
              <p className="text-xs text-rose-200/80 mt-0.5 max-w-3xl line-clamp-2 md:line-clamp-1">
                {current.description}
              </p>
            )}

            {current.impactedServices && current.impactedServices.length > 0 && (
              <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                <span className="text-[11px] text-slate-400">Impacted:</span>
                {current.impactedServices.map((svc, idx) => (
                  <span key={idx} className="text-[11px] px-1.5 py-0.2 rounded bg-slate-800/90 text-slate-300 border border-slate-700">
                    {svc}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 self-end md:self-center shrink-0">
          <CountdownTimer targetDate={current.estimatedEndTime} />

          <button
            onClick={() => {
              setDismissed(true);
              if (onDismiss) onDismiss();
            }}
            className="p-1 rounded-md text-rose-300/70 hover:text-white hover:bg-rose-500/20 transition-colors"
            title="Dismiss notice"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
