import React from 'react';
import { Sparkles, Terminal, Cpu, Network, Shield, RefreshCw } from 'lucide-react';

const SAMPLE_ERRORS = [
  {
    id: 'dns',
    title: 'DNS Resolution Failure',
    errorCode: 'DNS_PROBE_FINISHED_NXDOMAIN',
    category: 'Network',
    lab: 'Lab 4',
    pc: 'PC-12',
    description: 'Browser shows DNS_PROBE_FINISHED_NXDOMAIN when accessing university library server.',
    icon: Network,
    badgeColor: 'text-sky-400 bg-sky-950/60 border-sky-800',
  },
  {
    id: 'cuda',
    title: 'NVIDIA CUDA Kernel Mismatch',
    errorCode: 'CUDA_DEVICE_INITIALIZATION_FAILED',
    category: 'OS / Driver',
    lab: 'Lab 1',
    pc: 'PC-04',
    description: 'nvidia-smi error: Driver/library version mismatch when starting TensorFlow lab.',
    icon: Cpu,
    badgeColor: 'text-purple-400 bg-purple-950/60 border-purple-800',
  },
  {
    id: 'cable',
    title: 'Ethernet Cable Unplugged',
    errorCode: 'ERR_INTERNET_DISCONNECTED',
    category: 'Network',
    lab: 'Lab 5',
    pc: 'PC-19',
    description: 'Windows network icon shows red cross. Physical Ethernet disconnected.',
    icon: Terminal,
    badgeColor: 'text-amber-400 bg-amber-950/60 border-amber-800',
  },
  {
    id: 'bsod',
    title: 'Windows BSOD Kernel Fault',
    errorCode: 'BSOD_SYSTEM_SERVICE_EXCEPTION',
    category: 'Hardware',
    lab: 'Lab 3',
    pc: 'PC-28',
    description: 'Blue Screen of Death: SYSTEM_SERVICE_EXCEPTION during Android Studio emulator compile.',
    icon: Shield,
    badgeColor: 'text-rose-400 bg-rose-950/60 border-rose-800',
  },
  {
    id: 'dhcp',
    title: 'DHCP Lease Timeout (169.254.x.x)',
    errorCode: 'DHCP_LEASE_TIMEOUT',
    category: 'Network',
    lab: 'Lab 6',
    pc: 'PC-02',
    description: 'Workstation received APIPA address 169.254.120.44. Lab DHCP server unresponsive.',
    icon: RefreshCw,
    badgeColor: 'text-emerald-400 bg-emerald-950/60 border-emerald-800',
  },
];

export default function SampleErrorSelector({ onSelect }) {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-400">
          <Sparkles className="w-4 h-4 text-sky-400 animate-pulse" />
          Quick Demo Presets (1-Click Test Scenarios)
        </div>
        <span className="text-[11px] text-slate-400">Click to autofill diagnostic test</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {SAMPLE_ERRORS.map((sample) => {
          const Icon = sample.icon;
          return (
            <button
              key={sample.id}
              type="button"
              onClick={() => onSelect(sample)}
              className="group text-left p-2.5 rounded-lg bg-slate-800/40 hover:bg-slate-800 border border-slate-700/60 hover:border-sky-500/50 transition-all flex items-start gap-2.5"
            >
              <div className={`p-1.5 rounded-md ${sample.badgeColor} border shrink-0 mt-0.5 group-hover:scale-105 transition-transform`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <h4 className="text-xs font-semibold text-slate-200 group-hover:text-sky-300 truncate">
                    {sample.title}
                  </h4>
                  <span className="text-[10px] font-mono text-slate-400 shrink-0">
                    {sample.lab}
                  </span>
                </div>
                <p className="text-[11px] font-mono text-slate-400 truncate mt-0.5">
                  {sample.errorCode}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
