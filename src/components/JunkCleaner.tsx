import React, { useState } from 'react';
import { HardDrive, CheckSquare, Square, Trash2, ShieldCheck, RefreshCw } from 'lucide-react';
import { JunkItem } from '../types';

interface JunkCleanerProps {
  junkItems: JunkItem[];
  onToggleJunk: (id: string) => void;
  onCleanJunk: () => void;
  isCleaning: boolean;
}

export default function JunkCleaner({ junkItems, onToggleJunk, onCleanJunk, isCleaning }: JunkCleanerProps) {
  const [isAnalyzed, setIsAnalyzed] = useState(true);

  // Totals
  const selectedSizeMB = junkItems
    .filter(item => item.checked)
    .reduce((acc, curr) => acc + curr.sizeMB, 0);

  const totalSizeMB = junkItems.reduce((acc, curr) => acc + curr.sizeMB, 0);

  // Select all toggler
  const isAllChecked = junkItems.every(item => item.checked);
  const handleToggleAll = () => {
    // We can iterate and toggle all in parent. For a nice UI, we can trigger individual clicks, 
    // or call standard toggles. Let's make toggle individual triggers for simplicity or let parent handle.
    junkItems.forEach(item => {
      if ((isAllChecked && item.checked) || (!isAllChecked && !item.checked)) {
        onToggleJunk(item.id);
      }
    });
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-xl flex flex-col justify-between h-full" id="junk-cleaner-container">
      <div>
        <div className="flex items-center justify-between mb-4" id="junk-header">
          <h2 className="font-mono text-sm font-bold text-neutral-300 tracking-wide flex items-center gap-2">
            <span className="w-1.5 h-3 bg-rose-500 rounded-sm"></span>
            SSD STORAGE CACHE PURGE
          </h2>

          <div className="flex items-center gap-2 font-mono text-[10px]" id="junk-header-stats">
            <span className="text-neutral-500">SELECTED:</span>
            <span className="text-rose-400 bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800/80 font-bold tabular-nums">
              {(selectedSizeMB / 1024).toFixed(2)} GB
            </span>
          </div>
        </div>

        {/* Action Header Banner */}
        <div className="bg-neutral-950 border border-neutral-800/60 p-3 rounded-lg mb-4 flex items-center justify-between font-mono text-xs" id="junk-banner">
          <div id="junk-banner-text">
            <div className="text-neutral-400 font-bold">TOTAL ANALYSIS DETECTED</div>
            <div className="text-neutral-500 text-[10px] mt-0.5">{(totalSizeMB / 1024).toFixed(2)} GB of safe-to-delete temp data.</div>
          </div>
          <button
            onClick={onCleanJunk}
            disabled={isCleaning || selectedSizeMB === 0}
            id="clean-cache-btn"
            className="bg-rose-950/20 hover:bg-rose-500 hover:text-neutral-950 text-rose-400 border border-rose-500/30 hover:border-rose-500 transition-all font-mono font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
          >
            {isCleaning ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                PURGING...
              </>
            ) : (
              <>
                <Trash2 className="w-3.5 h-3.5" />
                CLEAN CACHE
              </>
            )}
          </button>
        </div>

        {/* Junk Items List Checkbox */}
        <div className="border border-neutral-800/60 rounded-lg overflow-hidden bg-neutral-950/40" id="junk-table-wrapper">
          <div className="flex items-center justify-between bg-neutral-950 px-3 py-2 text-[10px] font-mono text-neutral-500 font-bold border-b border-neutral-800/60" id="junk-table-header">
            <button
              onClick={handleToggleAll}
              disabled={isCleaning}
              className="flex items-center gap-1.5 hover:text-neutral-300 cursor-pointer text-left font-bold disabled:opacity-50"
              id="junk-toggle-all-btn"
            >
              {isAllChecked ? (
                <CheckSquare className="w-3.5 h-3.5 text-rose-500" />
              ) : (
                <Square className="w-3.5 h-3.5" />
              )}
              CLEANABLE DIRECTORIES
            </button>
            <div id="junk-th-size">SIZE (MB)</div>
          </div>

          <div className="divide-y divide-neutral-800/40 max-h-[195px] overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-800" id="junk-list">
            {junkItems.length > 0 ? (
              junkItems.map((item) => (
                <button
                  key={item.id}
                  id={`junk-item-${item.id}`}
                  onClick={() => !isCleaning && onToggleJunk(item.id)}
                  disabled={isCleaning}
                  className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-neutral-900/40 text-left transition-colors font-mono disabled:opacity-60 cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5" id={`junk-item-left-${item.id}`}>
                    <div id={`junk-check-container-${item.id}`}>
                      {item.checked ? (
                        <CheckSquare className="w-3.5 h-3.5 text-rose-500" />
                      ) : (
                        <Square className="w-3.5 h-3.5 text-neutral-600 group-hover:text-neutral-400" />
                      )}
                    </div>
                    <div>
                      <div className="text-xs text-neutral-300 font-bold group-hover:text-neutral-100 transition-colors">{item.name}</div>
                      <div className="text-[9px] text-neutral-500 mt-0.5">Category: {item.category}</div>
                    </div>
                  </div>

                  <div className="text-xs text-rose-400 font-semibold tabular-nums" id={`junk-item-size-${item.id}`}>
                    {item.sizeMB} MB
                  </div>
                </button>
              ))
            ) : (
              <div className="p-8 text-center text-neutral-600 font-mono text-xs" id="junk-no-results">
                <ShieldCheck className="w-5 h-5 mx-auto text-emerald-500 mb-2" />
                All temporary folders fully optimized and purged!
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 text-[10px] font-mono text-neutral-500 bg-neutral-950 p-2.5 rounded-lg border border-neutral-800/50" id="junk-footer-banner">
        <HardDrive className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
        <span>Disk garbage collector purges DirectX shaders, system minidumps, browser cookies, and staging variables, preventing sector fatigue.</span>
      </div>
    </div>
  );
}
