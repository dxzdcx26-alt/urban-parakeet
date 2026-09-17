import React, { useState, useEffect, useCallback } from 'react';
import { 
  Terminal, 
  Cpu, 
  ShieldAlert, 
  HardDrive, 
  Settings, 
  Activity, 
  Wifi, 
  LayoutGrid, 
  Info,
  Power
} from 'lucide-react';

// Subcomponents
import MetricsPanel from './components/MetricsPanel';
import ProfileSelector from './components/ProfileSelector';
import ConsoleTerminal from './components/ConsoleTerminal';
import ProcessManager from './components/ProcessManager';
import JunkCleaner from './components/JunkCleaner';
import StartupManager from './components/StartupManager';
import NetworkBoost from './components/NetworkBoost';

// Types & Utilities
import { 
  SystemMetrics, 
  OptimizationTask, 
  BackgroundProcess, 
  JunkItem, 
  StartupApp, 
  LogEntry, 
  PerformancePreset 
} from './types';
import { 
  INITIAL_METRICS, 
  INITIAL_OPTIMIZATIONS, 
  INITIAL_PROCESSES, 
  INITIAL_JUNK_ITEMS, 
  INITIAL_STARTUP_APPS, 
  getTimestamp 
} from './utils';

export default function App() {
  // --- APPLICATION STATE ---
  const [metrics, setMetrics] = useState<SystemMetrics>(INITIAL_METRICS);
  const [preset, setPreset] = useState<PerformancePreset>('CUSTOM'); // Custom by default to match prompt manual states
  const [optimizations, setOptimizations] = useState<OptimizationTask[]>(INITIAL_OPTIMIZATIONS);
  const [processes, setProcesses] = useState<BackgroundProcess[]>(INITIAL_PROCESSES);
  const [junkItems, setJunkItems] = useState<JunkItem[]>(INITIAL_JUNK_ITEMS);
  const [startupApps, setStartupApps] = useState<StartupApp[]>(INITIAL_STARTUP_APPS);
  
  // Terminal logs state
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: 'log_init_1',
      timestamp: getTimestamp(),
      level: 'info',
      message: 'SPEED 7 Optimization Engine v7.4.2 Initialization Successful.'
    },
    {
      id: 'log_init_2',
      timestamp: getTimestamp(),
      level: 'info',
      message: 'Monitoring 8 hardware cores, LPDDR5 RAM stack, and NVMe sector storage.'
    },
    {
      id: 'log_init_3',
      timestamp: getTimestamp(),
      level: 'warn',
      message: 'Bottlenecks detected! Performance Health Score is at 74%. Run optimization to purge standby memory leak.'
    }
  ]);

  // Telemetry histories for sparklines
  const [history, setHistory] = useState<{ cpu: number[]; ram: number[]; gpu: number[] }>({
    cpu: Array(20).fill(72),
    ram: Array(20).fill(53),
    gpu: Array(20).fill(10)
  });

  // Action Pending States
  const [activeTab, setActiveTab] = useState<'SHELL' | 'PROCESSES' | 'STORAGE' | 'STARTUP' | 'NETWORK'>('SHELL');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [isCleaning, setIsCleaning] = useState(false);
  const [isOptimizingDNS, setIsOptimizingDNS] = useState(false);

  // --- LOGGING HELPER ---
  const addLog = useCallback((message: string, level: 'info' | 'success' | 'warn' | 'error' = 'info') => {
    const newLog: LogEntry = {
      id: `log_${Date.now()}_${Math.random()}`,
      timestamp: getTimestamp(),
      level,
      message
    };
    setLogs((prev) => [...prev, newLog]);
  }, []);

  // --- STARTUP APP BOOT TIME CALCULATION ---
  // Recalculates estimated boot time based on remaining enabled startup apps
  const recalculateBootTime = useCallback((currentApps: StartupApp[]) => {
    let baseTime = 4.0; // Kernels/Hardware initialization
    currentApps.forEach((app) => {
      if (app.enabled) {
        if (app.impact === 'High') baseTime += 2.4;
        else if (app.impact === 'Medium') baseTime += 1.2;
        else if (app.impact === 'Low') baseTime += 0.4;
      }
    });
    setMetrics((prev) => ({
      ...prev,
      bootTime: parseFloat(baseTime.toFixed(1))
    }));
  }, []);

  // --- NATURAL METRICS FLUCTUATION ---
  // Simulates standard real-time system metrics jitter depending on the active Preset configuration
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) => {
        let cpuTarget = prev.cpu;
        let cpuSpeedTarget = prev.cpuSpeed;
        let ramTarget = prev.ram;
        let gpuTarget = prev.gpu;
        let fanTarget = prev.fanSpeed;
        let cpuTempTarget = prev.cpuTemp;
        let gpuTempTarget = prev.gpuTemp;

        // Base metrics depend heavily on Preset configuration
        if (preset === 'SPEED_7_MAX') {
          // Optimized high efficiency state
          cpuTarget = Math.max(8, Math.min(22, prev.cpu + (Math.random() * 4 - 2)));
          cpuSpeedTarget = 4.40 + Math.random() * 0.35;
          ramTarget = Math.max(28, Math.min(36, prev.ram + (Math.random() * 1.5 - 0.75)));
          gpuTarget = Math.max(2, Math.min(8, prev.gpu + (Math.random() * 2 - 1)));
          fanTarget = Math.max(1600, Math.min(1900, prev.fanSpeed + Math.round(Math.random() * 60 - 30)));
          cpuTempTarget = Math.max(40, Math.min(48, prev.cpuTemp + (Math.random() * 2 - 1)));
          gpuTempTarget = Math.max(38, Math.min(44, prev.gpuTemp + (Math.random() * 1.5 - 0.75)));
        } else if (preset === 'BALANCED') {
          // Dynamic moderate state
          cpuTarget = Math.max(30, Math.min(48, prev.cpu + (Math.random() * 8 - 4)));
          cpuSpeedTarget = 3.20 + Math.random() * 0.40;
          ramTarget = Math.max(45, Math.min(50, prev.ram + (Math.random() * 2 - 1)));
          gpuTarget = Math.max(6, Math.min(14, prev.gpu + (Math.random() * 3 - 1.5)));
          fanTarget = Math.max(2000, Math.min(2300, prev.fanSpeed + Math.round(Math.random() * 100 - 50)));
          cpuTempTarget = Math.max(52, Math.min(62, prev.cpuTemp + (Math.random() * 3 - 1.5)));
          gpuTempTarget = Math.max(46, Math.min(54, prev.gpuTemp + (Math.random() * 2 - 1)));
        } else if (preset === 'BATTERY_SAVER') {
          // Energy throttled state
          cpuTarget = Math.max(12, Math.min(28, prev.cpu + (Math.random() * 4 - 2)));
          cpuSpeedTarget = 1.60 + Math.random() * 0.15;
          ramTarget = Math.max(42, Math.min(48, prev.ram + (Math.random() * 1.5 - 0.75)));
          gpuTarget = Math.max(1, Math.min(5, prev.gpu + (Math.random() * 1 - 0.5)));
          fanTarget = Math.max(800, Math.min(1100, prev.fanSpeed + Math.round(Math.random() * 30 - 15)));
          cpuTempTarget = Math.max(35, Math.min(41, prev.cpuTemp + (Math.random() * 1.5 - 0.75)));
          gpuTempTarget = Math.max(34, Math.min(39, prev.gpuTemp + (Math.random() * 1 - 0.5)));
        } else if (preset === 'SILENT') {
          // Heat restrained low-noise state
          cpuTarget = Math.max(18, Math.min(34, prev.cpu + (Math.random() * 6 - 3)));
          cpuSpeedTarget = 2.10 + Math.random() * 0.20;
          ramTarget = Math.max(46, Math.min(52, prev.ram + (Math.random() * 2 - 1)));
          gpuTarget = Math.max(3, Math.min(8, prev.gpu + (Math.random() * 2 - 1)));
          fanTarget = 1100; // Locked quiet speed
          cpuTempTarget = Math.max(44, Math.min(51, prev.cpuTemp + (Math.random() * 2 - 1)));
          gpuTempTarget = Math.max(42, Math.min(48, prev.gpuTemp + (Math.random() * 1.5 - 0.75)));
        } else {
          // Custom / Initial suboptimal state (matches mockup prompt stats loosely)
          cpuTarget = Math.max(65, Math.min(78, prev.cpu + (Math.random() * 6 - 3)));
          cpuSpeedTarget = 3.35 + Math.random() * 0.15;
          ramTarget = Math.max(51, Math.min(56, prev.ram + (Math.random() * 1.2 - 0.6)));
          gpuTarget = Math.max(8, Math.min(13, prev.gpu + (Math.random() * 2 - 1)));
          fanTarget = Math.max(2100, Math.min(2400, prev.fanSpeed + Math.round(Math.random() * 60 - 30)));
          cpuTempTarget = Math.max(64, Math.min(71, prev.cpuTemp + (Math.random() * 2 - 1)));
          gpuTempTarget = Math.max(50, Math.min(56, prev.gpuTemp + (Math.random() * 1 - 0.5)));
        }

        // Maintain GB equivalent of RAM relative to percentage
        const calculatedRamUsed = (ramTarget / 100) * 16.0;

        return {
          ...prev,
          cpu: parseFloat(cpuTarget.toFixed(0)),
          cpuSpeed: parseFloat(cpuSpeedTarget.toFixed(2)),
          ram: parseFloat(ramTarget.toFixed(0)),
          ramUsed: parseFloat(calculatedRamUsed.toFixed(1)),
          gpu: parseFloat(gpuTarget.toFixed(0)),
          fanSpeed: fanTarget,
          cpuTemp: parseFloat(cpuTempTarget.toFixed(0)),
          gpuTemp: parseFloat(gpuTempTarget.toFixed(0))
        };
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [preset]);

  // --- RECORD TELEMETRY HISTORIES ---
  // Pushes latest values to histories array to maintain scrolling graphs
  useEffect(() => {
    setHistory((prev) => {
      const nextCpu = [...prev.cpu.slice(1), metrics.cpu];
      const nextRam = [...prev.ram.slice(1), metrics.ram];
      const nextGpu = [...prev.gpu.slice(1), metrics.gpu];
      return { cpu: nextCpu, ram: nextRam, gpu: nextGpu };
    });
  }, [metrics.cpu, metrics.ram, metrics.gpu]);

  // --- INDIVIDUAL TWEAKS OR ACTIONS ---

  // OPTIMIZATION CHECKBOX TOGGLER
  const handleToggleOptimization = (id: string) => {
    setOptimizations((prev) =>
      prev.map((opt) => (opt.id === id ? { ...opt, checked: !opt.checked } : opt))
    );
    const item = optimizations.find((o) => o.id === id);
    if (item) {
      addLog(`Toggled configuration directive: ${item.name} -> ${!item.checked ? 'ENABLED' : 'DISABLED'}`, 'info');
    }
  };

  // PROFILE SELECTION CHANGER
  const handlePresetChange = (newPreset: PerformancePreset) => {
    setPreset(newPreset);
    addLog(`System preset changed. Aligning cores scheduler to: [ ${newPreset.replace('_', ' ')} ]`, 'info');

    if (newPreset === 'SPEED_7_MAX') {
      // Re-apply optimizations visually if selecting MAX preset
      setOptimizations((prev) => prev.map((opt) => ({ ...opt, checked: true })));
      setMetrics((prev) => ({
        ...prev,
        healthScore: 98,
        bootTime: 6.8,
        ping: 12
      }));
    } else if (newPreset === 'BALANCED') {
      setOptimizations((prev) => prev.map((opt) => ({ ...opt, applied: false })));
      setMetrics((prev) => ({
        ...prev,
        healthScore: 82,
        bootTime: 10.4,
        ping: 24
      }));
    } else if (newPreset === 'BATTERY_SAVER') {
      setOptimizations((prev) => prev.map((opt) => ({ ...opt, applied: false })));
      setMetrics((prev) => ({
        ...prev,
        healthScore: 80,
        bootTime: 12.8,
        ping: 48
      }));
    } else if (newPreset === 'SILENT') {
      setOptimizations((prev) => prev.map((opt) => ({ ...opt, applied: false })));
      setMetrics((prev) => ({
        ...prev,
        healthScore: 84,
        bootTime: 11.5,
        ping: 32
      }));
    }
  };

  // TASK TERMINATOR (PROCESS MANAGER)
  const handleKillProcess = (id: string) => {
    const processToKill = processes.find((p) => p.id === id);
    if (!processToKill) return;

    setProcesses((prev) => prev.filter((p) => p.id !== id));
    
    // Visually lower RAM and CPU occupancy immediately
    const reclaimedRAM_GB = processToKill.ram / 1024;
    setMetrics((prev) => ({
      ...prev,
      cpu: Math.max(10, prev.cpu - Math.round(processToKill.cpu)),
      ramUsed: Math.max(3.0, prev.ramUsed - reclaimedRAM_GB),
      ram: Math.max(20, Math.round(((prev.ramUsed - reclaimedRAM_GB) / 16.0) * 100))
    }));

    addLog(
      `Forced termination of process: ${processToKill.name} (Type: ${processToKill.type}). Reclaimed ${processToKill.ram} MB of volatile buffer.`,
      'warn'
    );
  };

  // JUNK DIRECTORY FLUSHER
  const handleToggleJunk = (id: string) => {
    setJunkItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const handleCleanJunk = () => {
    const checkedItems = junkItems.filter((j) => j.checked);
    if (checkedItems.length === 0) return;

    setIsCleaning(true);
    addLog(`Initiating Storage Garbage Collection on NVMe sectors...`, 'info');

    setTimeout(() => {
      const purgedMB = checkedItems.reduce((acc, curr) => acc + curr.sizeMB, 0);
      const purgedGB = purgedMB / 1024;

      setJunkItems((prev) => prev.filter((j) => !j.checked));
      setMetrics((prev) => ({
        ...prev,
        ssdUsed: Math.max(120.0, prev.ssdUsed - purgedGB),
        ssd: Math.max(1, Math.round(((prev.ssdUsed - purgedGB) / 512) * 100)), // hypothetical 512GB drive
        healthScore: Math.min(100, prev.healthScore + 2)
      }));

      checkedItems.forEach((item) => {
        addLog(`[PURGE] Cleaned ${item.name} directory -> Reclaimed ${item.sizeMB} MB.`, 'success');
      });

      addLog(`Storage Garbage Collector successfully reclaimed ${purgedGB.toFixed(2)} GB of disk space. NVMe health normalized.`, 'success');
      setIsCleaning(false);
    }, 1800);
  };

  // STARTUP COMPONENT TOGGLER
  const handleToggleStartupApp = (id: string) => {
    const updatedApps = startupApps.map((app) => 
      app.id === id ? { ...app, enabled: !app.enabled } : app
    );
    setStartupApps(updatedApps);
    recalculateBootTime(updatedApps);

    const app = startupApps.find((a) => a.id === id);
    if (app) {
      addLog(
        `Startup service [ ${app.name} ] state set to: ${!app.enabled ? 'ENABLED' : 'DISABLED'}. Boot order synchronized.`,
        'info'
      );
    }
  };

  // DNS & LATENCY TUNER
  const handleOptimizeDNS = (providerId: string) => {
    setIsOptimizingDNS(true);
    addLog(`Initializing WAN ping diagnostics & DNS Cache purging...`, 'info');

    setTimeout(() => {
      let optimizedPing = 12;
      if (providerId === 'CLOUDFLARE') optimizedPing = 12;
      else if (providerId === 'GOOGLE') optimizedPing = 15;
      else if (providerId === 'QUAD9') optimizedPing = 21;

      setMetrics((prev) => ({
        ...prev,
        ping: optimizedPing,
        healthScore: Math.min(100, prev.healthScore + 3)
      }));

      addLog(`[DNS] Flushed local socket resolver cache successfully.`, 'success');
      addLog(`[DNS] WAN priority route locked on ${providerId === 'CLOUDFLARE' ? '1.1.1.1' : providerId === 'GOOGLE' ? '8.8.8.8' : '9.9.9.9'}. Latency synchronized to ${optimizedPing} ms.`, 'success');
      
      setIsOptimizingDNS(false);
    }, 1500);
  };

  // --- CORE SYSTEM WIDE ACTION TRIGGERS ---

  // [ APPLY SPEED 7 OPTIMIZATION ]
  const handleApply = () => {
    const checkedOpts = optimizations.filter((opt) => opt.checked);
    if (checkedOpts.length === 0) {
      addLog('Optimization halted: No checklist parameters selected to apply.', 'error');
      return;
    }

    setIsOptimizing(true);
    setPreset('SPEED_7_MAX');
    addLog('DEPLOYING SYSTEM-WIDE SPEED 7 PERFORMANCE MATRIX...', 'info');

    // Sequential simulation of deployment with log feedback
    setTimeout(() => {
      if (optimizations.some(o => o.id === 'cpu_unpark' && o.checked)) {
        addLog('[CPUCORE] Core unparking algorithm deployed. Secondary cores unlocked.', 'success');
      }
    }, 500);

    setTimeout(() => {
      if (optimizations.some(o => o.id === 'bg_tasks' && o.checked)) {
        addLog('[RAMCACHE] Standard memory standby cache list flushed (reclaimed 2.8 GB memory overhead).', 'success');
      }
    }, 1000);

    setTimeout(() => {
      if (optimizations.some(o => o.id === 'power_plan' && o.checked)) {
        addLog('[POWER] Custom Ultra Power Plan deployed. CPU frequency ceilings relaxed.', 'success');
      }
    }, 1500);

    setTimeout(() => {
      if (optimizations.some(o => o.id === 'startup_boost' && o.checked)) {
        addLog('[BOOT] Startup boot priority order compressed. Delays buffer synchronized.', 'success');
      }
    }, 2000);

    setTimeout(() => {
      // Mark applied items as true
      setOptimizations((prev) =>
        prev.map((opt) => (opt.checked ? { ...opt, applied: true } : opt))
      );

      // Settle down the system metrics to represent outstanding success
      setMetrics((prev) => ({
        ...prev,
        cpu: 14,
        ram: 32,
        ramUsed: 5.1,
        gpu: 3,
        cpuTemp: 44,
        gpuTemp: 40,
        fanSpeed: 1650,
        healthScore: 98,
        bootTime: 6.8,
        ping: 12
      }));

      addLog('SPEED 7 CORE SEQUENCING NORMALIZED. Performance optimization score: 98%. System status EXCELLENT.', 'success');
      setIsOptimizing(false);
    }, 2500);
  };

  // [ RESTORE ]
  const handleRestore = () => {
    setIsRestoring(true);
    setPreset('CUSTOM');
    addLog('REVERTING PERFORMANCE INSTRUCTIONS TO FACTORY STANDARD DEFAULT...', 'info');

    setTimeout(() => {
      addLog('[CPUCORE] Restricted cores scheduler to OS dynamic scheduling policy.', 'info');
    }, 600);

    setTimeout(() => {
      addLog('[POWER] Reinstated dynamic ACPI Energy saving throttling standard.', 'info');
    }, 1200);

    setTimeout(() => {
      // Reset all applied states to false
      setOptimizations((prev) => prev.map((opt) => ({ ...opt, applied: false })));

      // Revert system parameters to initial suboptimal state
      setMetrics(INITIAL_METRICS);
      setStartupApps(INITIAL_STARTUP_APPS);
      setProcesses(INITIAL_PROCESSES);
      setJunkItems(INITIAL_JUNK_ITEMS);

      addLog('System parameter restoration complete. Standard parameters active. Optimizer idle.', 'warn');
      setIsRestoring(false);
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-[#0e0f11] text-neutral-100 flex flex-col selection:bg-emerald-500/30 selection:text-emerald-300" id="app-root-container">
      {/* RETRO TOP NAVIGATION HEADER */}
      <header className="border-b border-neutral-800 bg-[#0c0d0f] sticky top-0 z-50 px-6 py-4" id="app-header">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4" id="header-container">
          <div className="flex items-center gap-3.5" id="header-left">
            <div className="w-9 h-9 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex items-center justify-center" id="logo-icon-box">
              <Cpu className="w-5 h-5 text-emerald-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2" id="title-wrapper">
                <h1 className="font-mono text-base font-black tracking-widest text-neutral-100">
                  SPEED 7
                </h1>
                <span className="font-mono text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded font-bold">
                  PRO v7.4
                </span>
              </div>
              <p className="font-mono text-[10px] text-neutral-500 mt-0.5 tracking-wider uppercase">
                Active System Optimization & Telemetry Diagnostics Suite
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 font-mono text-[11px]" id="header-right">
            <div className="flex items-center gap-1.5 bg-neutral-950 px-3 py-1.5 rounded-md border border-neutral-800/80" id="header-status-box">
              <span className="text-neutral-500 uppercase">Optimizer status:</span>
              {preset === 'SPEED_7_MAX' ? (
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  MAXIMA_ACTIVE
                </span>
              ) : (
                <span className="text-amber-500 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                  SUBOPTIMAL
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 bg-neutral-950 px-3 py-1.5 rounded-md border border-neutral-800/80" id="header-time-box">
              <span className="text-neutral-500 uppercase">SYS_CLOCK:</span>
              <span className="text-neutral-300 font-bold tabular-nums">115200 Hz</span>
            </div>
          </div>
        </div>
      </header>

      {/* PRIMARY DASHBOARD CONTENT AREA */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 space-y-6" id="app-main">
        {/* UPPER PANEL: LIVE PROGRESS METERS AND ROLLING CHARTS */}
        <section id="upper-telemetry-section">
          <MetricsPanel metrics={metrics} history={history} />
        </section>

        {/* LOWER PANEL: DUAL COLUMN DIAGNOSTIC DECK & PROFILES CONFIG */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="lower-interactive-section">
          {/* LEFT DECK (7/12 Width): TABBED DIAGNOSTICS SUITE */}
          <div className="lg:col-span-8 flex flex-col" id="left-diagnostics-deck">
            {/* Elegant Monospaced Tab Switchers */}
            <div className="flex flex-wrap gap-1 bg-[#101114] p-1.5 border border-neutral-800 rounded-t-xl overflow-x-auto scrollbar-none font-mono" id="diagnostics-tab-switchers">
              <button
                id="tab-btn-shell"
                onClick={() => setActiveTab('SHELL')}
                className={`px-4 py-2.5 text-xs font-bold uppercase rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'SHELL'
                    ? 'bg-neutral-800 text-neutral-100 shadow'
                    : 'text-neutral-500 hover:text-neutral-300'
                }`}
              >
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                [ TERMINAL CHELL ]
              </button>

              <button
                id="tab-btn-processes"
                onClick={() => setActiveTab('PROCESSES')}
                className={`px-4 py-2.5 text-xs font-bold uppercase rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'PROCESSES'
                    ? 'bg-neutral-800 text-neutral-100 shadow'
                    : 'text-neutral-500 hover:text-neutral-300'
                }`}
              >
                <Cpu className="w-3.5 h-3.5 text-red-400" />
                [ PROCESS MONITOR ]
              </button>

              <button
                id="tab-btn-storage"
                onClick={() => setActiveTab('STORAGE')}
                className={`px-4 py-2.5 text-xs font-bold uppercase rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'STORAGE'
                    ? 'bg-neutral-800 text-neutral-100 shadow'
                    : 'text-neutral-500 hover:text-neutral-300'
                }`}
              >
                <HardDrive className="w-3.5 h-3.5 text-rose-400" />
                [ STORAGE CACHE ]
              </button>

              <button
                id="tab-btn-startup"
                onClick={() => setActiveTab('STARTUP')}
                className={`px-4 py-2.5 text-xs font-bold uppercase rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'STARTUP'
                    ? 'bg-neutral-800 text-neutral-100 shadow'
                    : 'text-neutral-500 hover:text-neutral-300'
                }`}
              >
                <Power className="w-3.5 h-3.5 text-sky-400" />
                [ STARTUP DELAYS ]
              </button>

              <button
                id="tab-btn-network"
                onClick={() => setActiveTab('NETWORK')}
                className={`px-4 py-2.5 text-xs font-bold uppercase rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'NETWORK'
                    ? 'bg-neutral-800 text-neutral-100 shadow'
                    : 'text-neutral-500 hover:text-neutral-300'
                }`}
              >
                <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                [ NETWORK SPEED ]
              </button>
            </div>

            {/* Render selected Diagnostic Panel Tab, framed in matching container */}
            <div className="bg-neutral-900 border-l border-r border-b border-neutral-800 p-0 rounded-b-xl overflow-hidden min-h-[430px] flex flex-col justify-stretch" id="diagnostics-tab-body">
              {activeTab === 'SHELL' && (
                <ConsoleTerminal
                  optimizations={optimizations}
                  onToggleOptimization={handleToggleOptimization}
                  onApply={handleApply}
                  onRestore={handleRestore}
                  logs={logs}
                  isOptimizing={isOptimizing}
                  isRestoring={isRestoring}
                />
              )}

              {activeTab === 'PROCESSES' && (
                <ProcessManager
                  processes={processes}
                  onKillProcess={handleKillProcess}
                />
              )}

              {activeTab === 'STORAGE' && (
                <JunkCleaner
                  junkItems={junkItems}
                  onToggleJunk={handleToggleJunk}
                  onCleanJunk={handleCleanJunk}
                  isCleaning={isCleaning}
                />
              )}

              {activeTab === 'STARTUP' && (
                <StartupManager
                  apps={startupApps}
                  onToggleApp={handleToggleStartupApp}
                  bootTime={metrics.bootTime}
                />
              )}

              {activeTab === 'NETWORK' && (
                <NetworkBoost
                  ping={metrics.ping}
                  onOptimizeDNS={handleOptimizeDNS}
                  isOptimizing={isOptimizingDNS}
                />
              )}
            </div>
          </div>

          {/* RIGHT PANEL (5/12 Width): PROFILES AND HARDWARE METRIC CARD */}
          <div className="lg:col-span-4 flex flex-col gap-6" id="right-profiles-panel">
            <ProfileSelector 
              currentPreset={preset} 
              onPresetChange={handlePresetChange} 
              metrics={metrics}
            />

            {/* Quick Informational System Specs card */}
            <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-xl font-mono" id="system-info-card">
              <h3 className="text-xs font-bold text-neutral-400 mb-3 tracking-wider flex items-center gap-1.5 uppercase">
                <Info className="w-4 h-4 text-emerald-400" />
                STATIC SYSTEM MANIFEST
              </h3>
              
              <div className="space-y-2 text-[11px]" id="specs-list">
                <div className="flex justify-between border-b border-neutral-800/40 pb-1.5" id="spec-row-cpu">
                  <span className="text-neutral-500">PROCESSOR:</span>
                  <span className="text-neutral-300 font-semibold text-right">Intel Core i7-14700K (8C / 16T)</span>
                </div>
                <div className="flex justify-between border-b border-neutral-800/40 pb-1.5" id="spec-row-gpu">
                  <span className="text-neutral-500">GRAPHICS:</span>
                  <span className="text-neutral-300 font-semibold text-right">NVIDIA RTX 4070 Ti (12GB VRAM)</span>
                </div>
                <div className="flex justify-between border-b border-neutral-800/40 pb-1.5" id="spec-row-ram">
                  <span className="text-neutral-500">MEMORY CAPACITY:</span>
                  <span className="text-neutral-300 font-semibold text-right">16.0 GB dual-channel LPDDR5</span>
                </div>
                <div className="flex justify-between border-b border-neutral-800/40 pb-1.5" id="spec-row-storage">
                  <span className="text-neutral-500">HARD STORAGE:</span>
                  <span className="text-neutral-300 font-semibold text-right">Samsung 990 Pro 1TB M.2 NVMe</span>
                </div>
                <div className="flex justify-between" id="spec-row-os">
                  <span className="text-neutral-500">BOOT KERNEL:</span>
                  <span className="text-emerald-400 font-semibold text-right">SPEED 7 Optimized Win-X64</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* APP FOOTER BRANDING */}
      <footer className="border-t border-neutral-800/60 bg-[#0c0d0f] py-4 text-center text-neutral-600 font-mono text-[10px]" id="app-footer">
        <p className="tracking-widest uppercase">
          [ SPEED 7 CORES SYSTEM REGISTER ENGINE ] • ALL SYSTEMS OPTIMIZED & EXECUTING SECURELY
        </p>
      </footer>
    </div>
  );
}
