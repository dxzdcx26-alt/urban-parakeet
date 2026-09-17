import React, { useState } from 'react';
import { Search, ShieldAlert, Cpu, HardDrive, Trash2, SlidersHorizontal } from 'lucide-react';
import { BackgroundProcess } from '../types';

interface ProcessManagerProps {
  processes: BackgroundProcess[];
  onKillProcess: (id: string) => void;
}

export default function ProcessManager({ processes, onKillProcess }: ProcessManagerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'ALL' | 'USER' | 'SYSTEM' | 'SERVICE'>('ALL');

  // Filter processes
  const filteredProcesses = processes.filter((proc) => {
    const matchesSearch = proc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = 
      activeTab === 'ALL' || 
      (activeTab === 'USER' && proc.type === 'User') ||
      (activeTab === 'SYSTEM' && proc.type === 'System') ||
      (activeTab === 'SERVICE' && proc.type === 'Service');
    return matchesSearch && matchesTab;
  });

  // Calculate metrics
  const totalCpuOverhead = processes.reduce((acc, curr) => acc + curr.cpu, 0);
  const totalRamOverheadMB = processes.reduce((acc, curr) => acc + curr.ram, 0);

  return (
    <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-xl flex flex-col justify-between h-full" id="process-manager-container">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4" id="proc-header-row">
          <h2 className="font-mono text-sm font-bold text-neutral-300 tracking-wide flex items-center gap-2">
            <span className="w-1.5 h-3 bg-red-500 rounded-sm"></span>
            ACTIVE PROCESS CONTROLLER
          </h2>

          <div className="flex items-center gap-2 text-[10px] font-mono" id="proc-stats-summary">
            <span className="text-neutral-500">CONSUMPTION:</span>
            <span className="text-neutral-300 bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800/80">
              {totalCpuOverhead.toFixed(1)}% CPU
            </span>
            <span className="text-neutral-300 bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800/80">
              {(totalRamOverheadMB / 1024).toFixed(2)} GB RAM
            </span>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col sm:flex-row gap-2.5 mb-4" id="proc-controls-row">
          <div className="relative flex-1" id="proc-search-container">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-neutral-500" />
            <input
              type="text"
              placeholder="Search background tasks (e.g., chrome, steam)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-neutral-300 placeholder-neutral-600 focus:outline-none focus:border-neutral-700 font-mono transition-colors"
            />
          </div>

          <div className="flex gap-1 bg-neutral-950 p-1 border border-neutral-800/60 rounded-lg font-mono" id="proc-filters">
            {(['ALL', 'USER', 'SYSTEM', 'SERVICE'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-2.5 py-1 text-[10px] font-semibold rounded-md transition-colors ${
                  activeTab === tab
                    ? 'bg-neutral-800 text-neutral-100'
                    : 'text-neutral-500 hover:text-neutral-300'
                } cursor-pointer`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Process list table */}
        <div className="border border-neutral-800/60 rounded-lg overflow-hidden bg-neutral-950/40" id="proc-table-wrapper">
          <div className="grid grid-cols-12 gap-2 bg-neutral-950 px-3 py-2 text-[10px] font-mono text-neutral-500 font-bold border-b border-neutral-800/60" id="proc-table-header">
            <div className="col-span-5" id="th-name">PROCESS NAME</div>
            <div className="col-span-2 text-right" id="th-cpu">CPU %</div>
            <div className="col-span-2 text-right" id="th-ram">RAM MB</div>
            <div className="col-span-2 text-center" id="th-type">TYPE</div>
            <div className="col-span-1" id="th-actions"></div>
          </div>

          <div className="divide-y divide-neutral-800/40 max-h-[195px] overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-800" id="proc-list">
            {filteredProcesses.length > 0 ? (
              filteredProcesses.map((proc) => (
                <div
                  key={proc.id}
                  id={`proc-row-${proc.id}`}
                  className="grid grid-cols-12 gap-2 px-3 py-2.5 items-center hover:bg-neutral-900/40 transition-colors group"
                >
                  <div className="col-span-5 flex items-center gap-2" id={`proc-name-col-${proc.id}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                    <span className="font-mono text-xs text-neutral-300 font-bold break-all">{proc.name}</span>
                  </div>

                  <div className="col-span-2 text-right font-mono text-xs text-amber-500/90 font-semibold tabular-nums" id={`proc-cpu-col-${proc.id}`}>
                    {proc.cpu}%
                  </div>

                  <div className="col-span-2 text-right font-mono text-xs text-neutral-400 tabular-nums" id={`proc-ram-col-${proc.id}`}>
                    {proc.ram} MB
                  </div>

                  <div className="col-span-2 text-center" id={`proc-type-col-${proc.id}`}>
                    <span className={`inline-block font-mono text-[9px] px-1.5 py-0.5 rounded ${
                      proc.type === 'System' 
                        ? 'bg-red-500/10 text-red-400 border border-red-500/10' 
                        : proc.type === 'Service'
                        ? 'bg-sky-500/10 text-sky-400 border border-sky-500/10'
                        : 'bg-neutral-800 text-neutral-400 border border-neutral-700/60'
                    }`}>
                      {proc.type}
                    </span>
                  </div>

                  <div className="col-span-1 text-right" id={`proc-action-col-${proc.id}`}>
                    <button
                      onClick={() => onKillProcess(proc.id)}
                      title="Force terminate process"
                      className="p-1 rounded text-neutral-600 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-neutral-600 font-mono text-xs" id="proc-no-results">
                <ShieldAlert className="w-5 h-5 mx-auto text-neutral-700 mb-2" />
                No matching active processes found.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 text-[10px] font-mono text-neutral-500 bg-neutral-950 p-2.5 rounded-lg border border-neutral-800/50" id="proc-footer-disclaimer">
        <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
        <span>Stopping high-priority processes decreases CPU cores temperature and releases system buffer queues immediately. Use with caution.</span>
      </div>
    </div>
  );
}
