import React, { useRef, useEffect } from 'react';
import { Terminal, Check, Square, Play, RotateCcw, AlertTriangle } from 'lucide-react';
import { OptimizationTask, LogEntry } from '../types';

interface ConsoleTerminalProps {
  optimizations: OptimizationTask[];
  onToggleOptimization: (id: string) => void;
  onApply: () => void;
  onRestore: () => void;
  logs: LogEntry[];
  isOptimizing: boolean;
  isRestoring: boolean;
}

export default function ConsoleTerminal({
  optimizations,
  onToggleOptimization,
  onApply,
  onRestore,
  logs,
  isOptimizing,
  isRestoring
}: ConsoleTerminalProps) {
  const logEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll console terminal to bottom on new logs
  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  return (
    <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl flex flex-col justify-between h-full font-mono" id="console-terminal-wrapper">
      <div>
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-neutral-800/60" id="terminal-header-area">
          <h2 className="text-sm font-bold text-neutral-300 tracking-wide flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            SPEED 7 CORES & PROFILE TASKS
          </h2>
          <span className="text-[10px] text-neutral-500 font-mono select-none">SYSTEM_V7_OPT.SYS</span>
        </div>

        {/* Dynamic Optimization Tasks List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6" id="tasks-checklist-grid">
          {optimizations.map((task) => (
            <button
              key={task.id}
              id={`task-toggle-${task.id}`}
              onClick={() => !isOptimizing && !isRestoring && onToggleOptimization(task.id)}
              disabled={isOptimizing || isRestoring}
              className={`flex items-start gap-3 p-3 rounded-lg border text-left transition-all group ${
                task.applied 
                  ? 'bg-emerald-950/20 border-emerald-500/20 text-emerald-300'
                  : 'bg-neutral-950/40 border-neutral-800/80 hover:border-neutral-700 text-neutral-400 hover:text-neutral-200'
              } cursor-pointer disabled:opacity-60`}
            >
              <div className="mt-0.5" id={`task-icon-container-${task.id}`}>
                {task.applied ? (
                  <div className="w-4 h-4 bg-emerald-500 text-neutral-950 rounded flex items-center justify-center font-bold" id={`task-applied-check-${task.id}`}>
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                ) : task.checked ? (
                  <div className="w-4 h-4 border border-emerald-500/80 rounded flex items-center justify-center bg-neutral-900" id={`task-checked-box-${task.id}`}>
                    <div className="w-2 h-2 bg-emerald-500 rounded-sm"></div>
                  </div>
                ) : (
                  <Square className="w-4 h-4 text-neutral-600 group-hover:text-neutral-500" />
                )}
              </div>

              <div>
                <div className="flex items-center gap-1.5" id={`task-title-row-${task.id}`}>
                  <span className="text-xs font-bold uppercase tracking-wider">{task.name}</span>
                  {task.applied && (
                    <span className="text-[8px] bg-emerald-500/10 text-emerald-400 px-1 py-0.2 rounded font-mono">
                      ✓ APPLIED
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-neutral-500 leading-normal mt-0.5 group-hover:text-neutral-400 transition-colors">
                  {task.description}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* BRACKET BUTTONS: [ APPLY ] and [ RESTORE ] */}
        <div className="flex items-center gap-4 mb-6" id="bracket-actions-row">
          <button
            onClick={onApply}
            disabled={isOptimizing || isRestoring}
            id="apply-optimizations-btn"
            className="flex-1 py-3 px-4 font-mono font-bold text-sm tracking-widest border border-emerald-500 bg-emerald-950/10 text-emerald-400 hover:bg-emerald-500 hover:text-neutral-950 transition-all rounded-lg shadow-lg hover:shadow-emerald-500/10 flex items-center justify-center gap-2 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current stroke-0" />
            [ APPLY SPEED 7 OPTIMIZATION ]
          </button>

          <button
            onClick={onRestore}
            disabled={isOptimizing || isRestoring}
            id="restore-optimizations-btn"
            className="py-3 px-6 font-mono font-bold text-sm tracking-widest border border-neutral-700 bg-neutral-950/30 text-neutral-400 hover:border-neutral-500 hover:text-neutral-200 hover:bg-neutral-900 transition-all rounded-lg flex items-center justify-center gap-2 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            [ RESTORE ]
          </button>
        </div>
      </div>

      {/* CONSOLE TERMINAL OUTPUT LOGS */}
      <div>
        <div className="flex items-center justify-between bg-neutral-950 border-t border-l border-r border-neutral-800 px-3 py-1.5 rounded-t-lg text-[10px] text-neutral-500" id="console-logs-header">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            SHELL STDOUT - LIVE RECT_LOG
          </span>
          <span>115200 BAUD</span>
        </div>

        <div className="bg-neutral-950 border border-neutral-800 p-4 rounded-b-lg h-[160px] overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-800" id="console-logs-body">
          <div className="space-y-1" id="console-logs-list">
            {logs.map((log) => {
              let levelColor = 'text-neutral-400';
              let badge = 'INFO';
              if (log.level === 'success') {
                levelColor = 'text-emerald-400';
                badge = 'OK';
              } else if (log.level === 'warn') {
                levelColor = 'text-amber-400';
                badge = 'WARN';
              } else if (log.level === 'error') {
                levelColor = 'text-red-400';
                badge = 'ERR';
              }

              return (
                <div key={log.id} className="text-[11px] leading-relaxed flex items-start gap-1 font-mono hover:bg-neutral-900/50 p-0.5 rounded transition-colors" id={`log-${log.id}`}>
                  <span className="text-neutral-600 shrink-0 select-none">[{log.timestamp}]</span>
                  <span className={`${levelColor} shrink-0 font-bold select-none`}>[{badge}]</span>
                  <span className="text-neutral-300 break-all">{log.message}</span>
                </div>
              );
            })}
            
            {(isOptimizing || isRestoring) && (
              <div className="text-[11px] text-emerald-400 font-bold flex items-center gap-1.5 animate-pulse pt-1" id="console-spinner">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>PROCESSING SYSTEM REGISTRIES... PLEASE STAND BY</span>
              </div>
            )}
          </div>
          <div ref={logEndRef} />
        </div>
      </div>
    </div>
  );
}
