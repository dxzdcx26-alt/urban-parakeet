import React from 'react';
import { Power, HelpCircle, Shield, Zap, AlertCircle } from 'lucide-react';
import { StartupApp } from '../types';

interface StartupManagerProps {
  apps: StartupApp[];
  onToggleApp: (id: string) => void;
  bootTime: number;
}

export default function StartupManager({ apps, onToggleApp, bootTime }: StartupManagerProps) {
  const enabledAppsCount = apps.filter(app => app.enabled).length;

  return (
    <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-xl flex flex-col justify-between h-full" id="startup-manager-container">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4" id="startup-header-row">
          <h2 className="font-mono text-sm font-bold text-neutral-300 tracking-wide flex items-center gap-2">
            <span className="w-1.5 h-3 bg-sky-500 rounded-sm"></span>
            STARTUP SERVICES & AGENTS
          </h2>

          {/* Boot speed feedback display */}
          <div className="flex items-center gap-2 text-[10px] font-mono" id="startup-stats">
            <span className="text-neutral-500">BOOT TIME ESTIMATE:</span>
            <span className={`px-2 py-0.5 rounded border font-bold tabular-nums ${
              bootTime < 8 
                ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/20' 
                : 'bg-amber-950/40 text-amber-400 border-amber-500/20'
            }`}>
              {bootTime.toFixed(1)}s
            </span>
          </div>
        </div>

        {/* Informative Header Status */}
        <div className="bg-neutral-950 border border-neutral-800/60 p-3 rounded-lg mb-4 flex items-center justify-between font-mono text-xs" id="startup-summary-banner">
          <div id="startup-summary-text">
            <span className="text-neutral-400 font-bold">STARTUP OVERHEAD METRICS</span>
            <div className="text-neutral-500 text-[10px] mt-0.5">
              {enabledAppsCount} apps running at login. Disabling high impact items cuts kernel delays.
            </div>
          </div>
          <Zap className={`w-4 h-4 text-sky-400 ${bootTime < 8 ? 'animate-pulse' : ''}`} />
        </div>

        {/* List of Startup apps */}
        <div className="border border-neutral-800/60 rounded-lg overflow-hidden bg-neutral-950/40" id="startup-table-wrapper">
          <div className="grid grid-cols-12 gap-2 bg-neutral-950 px-3 py-2 text-[10px] font-mono text-neutral-500 font-bold border-b border-neutral-800/60" id="startup-table-header">
            <div className="col-span-5" id="sth-app">APPLICATION / SERVICE</div>
            <div className="col-span-3" id="sth-publisher">PUBLISHER</div>
            <div className="col-span-2 text-center" id="sth-impact">IMPACT</div>
            <div className="col-span-2 text-center" id="sth-status">STATUS</div>
          </div>

          <div className="divide-y divide-neutral-800/40 max-h-[195px] overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-800" id="startup-list">
            {apps.map((app) => (
              <div
                key={app.id}
                id={`startup-app-row-${app.id}`}
                className="grid grid-cols-12 gap-2 px-3 py-2.5 items-center hover:bg-neutral-900/40 transition-colors group"
              >
                <div className="col-span-5 flex items-center gap-2" id={`app-name-col-${app.id}`}>
                  <Power className={`w-3.5 h-3.5 ${app.enabled ? 'text-sky-400' : 'text-neutral-600'}`} />
                  <div>
                    <span className="font-mono text-xs text-neutral-300 font-bold block">{app.name}</span>
                  </div>
                </div>

                <div className="col-span-3 font-mono text-[10px] text-neutral-500 truncate" id={`app-publisher-col-${app.id}`}>
                  {app.publisher}
                </div>

                <div className="col-span-2 text-center" id={`app-impact-col-${app.id}`}>
                  <span className={`inline-block font-mono text-[9px] px-1.5 py-0.5 rounded font-bold ${
                    app.impact === 'High'
                      ? 'bg-red-500/10 text-red-400'
                      : app.impact === 'Medium'
                      ? 'bg-amber-500/10 text-amber-400'
                      : 'bg-emerald-500/10 text-emerald-400'
                  }`}>
                    {app.impact}
                  </span>
                </div>

                {/* Toggle Controller */}
                <div className="col-span-2 text-center" id={`app-status-col-${app.id}`}>
                  <button
                    onClick={() => onToggleApp(app.id)}
                    id={`toggle-app-btn-${app.id}`}
                    className={`px-2.5 py-0.5 text-[10px] font-mono font-bold rounded-full border transition-all cursor-pointer ${
                      app.enabled
                        ? 'bg-sky-500/10 text-sky-400 border-sky-500/30 hover:bg-sky-500/20'
                        : 'bg-neutral-800 text-neutral-500 border-neutral-700 hover:bg-neutral-700/60 hover:text-neutral-300'
                    }`}
                  >
                    {app.enabled ? 'ENABLED' : 'DISABLED'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 text-[10px] font-mono text-neutral-500 bg-neutral-950 p-2.5 rounded-lg border border-neutral-800/50" id="startup-footer-banner">
        <AlertCircle className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
        <span>Preloaded desktop apps delay system initialization. Disabling non-essential services releases handles from the Windows boot kernel.</span>
      </div>
    </div>
  );
}
