import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export default function CountdownTimer({ targetDate, compact = false }) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    if (!targetDate) return { hours: 0, minutes: 0, seconds: 0, expired: true };
    const difference = new Date(targetDate).getTime() - new Date().getTime();
    if (difference <= 0) {
      return { hours: 0, minutes: 0, seconds: 0, expired: true };
    }

    const hours = Math.floor(difference / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return { hours, minutes, seconds, expired: false };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (timeLeft.expired) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-500/20 text-amber-400 text-xs font-mono font-medium border border-amber-500/30">
        <Clock className="w-3.5 h-3.5 animate-pulse" />
        ETA Reached (Verification in Progress)
      </span>
    );
  }

  if (compact) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono text-xs border border-rose-500/30">
        <Clock className="w-3 h-3 animate-spin-slow" />
        {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
      </span>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1.5 bg-black/40 border border-rose-500/40 px-3 py-1.5 rounded-lg shadow-inner">
        <Clock className="w-4 h-4 text-rose-400 animate-pulse" />
        <span className="text-xs text-rose-200/80 font-medium uppercase tracking-wider mr-1">Estimated ETA:</span>
        <div className="flex items-center gap-1 font-mono text-sm font-bold text-rose-400">
          <span className="bg-rose-950/60 px-1.5 py-0.5 rounded border border-rose-800/40">
            {String(timeLeft.hours).padStart(2, '0')}h
          </span>
          <span>:</span>
          <span className="bg-rose-950/60 px-1.5 py-0.5 rounded border border-rose-800/40">
            {String(timeLeft.minutes).padStart(2, '0')}m
          </span>
          <span>:</span>
          <span className="bg-rose-950/60 px-1.5 py-0.5 rounded border border-rose-800/40">
            {String(timeLeft.seconds).padStart(2, '0')}s
          </span>
        </div>
      </div>
    </div>
  );
}
