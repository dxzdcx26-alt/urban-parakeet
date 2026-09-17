import React from 'react';
import { Cpu, HardDrive, Fan, Thermometer, ShieldCheck } from 'lucide-react';
import { SystemMetrics } from '../types';

interface MetricsPanelProps {
  metrics: SystemMetrics;
  history: {
    cpu: number[];
    ram: number[];
    gpu: number[];
  };
}

export default function MetricsPanel({ metrics, history }: MetricsPanelProps) {
  // Helper to draw a sleek SVG sparkline path
  const renderSparkline = (data: number[], colorClass: string, maxVal: number = 100) => {
    if (data.length < 2) return null;
    const width = 280;
    const height = 35;
    const padding = 2;
    const points = data.map((val, i) => {
      const x = (i / (data.length - 1)) * (width - padding * 2) + padding;
      const y = height - (val / maxVal) * (height - padding * 2) - padding;
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg className="w-full h-8 overflow-visible" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" id={`sparkline-${colorClass}`}>
        <defs>
          <linearGradient id={`grad-${colorClass}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.15" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.0" />
          </linearGradient>
        </defs>
        {/* Fill Area */}
        <path
          d={`M ${padding},${height} L ${points} L ${width - padding},${height} Z`}
          fill={`url(#grad-${colorClass})`}
          className={`${colorClass}`}
        />
        {/* Line */}
        <polyline
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          points={points}
          className={`${colorClass} transition-all duration-300`}
        />
      </svg>
    );
  };

  // Helper for generating custom classic ASCII progress blocks: ████████░░░░░░
  const getAsciiBar = (pct: number, totalBlocks: number = 16) => {
    const activeBlocks = Math.round((pct / 100) * totalBlocks);
    const cappedActive = Math.max(0, Math.min(totalBlocks, activeBlocks));
    const inactiveBlocks = totalBlocks - cappedActive;
    return (
      <span className="font-mono text-xs tracking-wider" id={`ascii-bar-${pct}`}>
        <span className="text-emerald-400">{'█'.repeat(cappedActive)}</span>
        <span className="text-neutral-700">{'░'.repeat(inactiveBlocks)}</span>
      </span>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" id="metrics-panel-container">
      {/* CPU MODULE */}
      <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl flex flex-col justify-between" id="cpu-metric-card">
        <div>
          <div className="flex items-center justify-between mb-2" id="cpu-card-header">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span className="font-mono text-xs font-semibold text-neutral-300">CPU UNIT</span>
            </div>
            <span className="font-mono text-[10px] text-neutral-500 bg-neutral-950 px-1.5 py-0.5 rounded border border-neutral-800">
              8C / 16T
            </span>
          </div>

          <div className="flex items-baseline justify-between mt-3 mb-1" id="cpu-stats-row">
            <span className="font-mono text-3xl font-bold text-neutral-100 tabular-nums">
              {metrics.cpu}<span className="text-sm font-medium text-neutral-400">%</span>
            </span>
            <span className="font-mono text-xs text-neutral-400 tabular-nums">
              {metrics.cpuSpeed.toFixed(2)} GHz
            </span>
          </div>

          <div className="mb-3" id="cpu-bar-container">
            {getAsciiBar(metrics.cpu)}
          </div>
        </div>

        <div className="pt-2 border-t border-neutral-800/60" id="cpu-sparkline-area">
          <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 mb-1" id="cpu-meta-row">
            <span className="flex items-center gap-1">
              <Thermometer className="w-3 h-3 text-amber-500" />
              {metrics.cpuTemp}°C
            </span>
            <span>ROLLING FREQ</span>
          </div>
          {renderSparkline(history.cpu, 'text-emerald-500')}
        </div>
      </div>

      {/* RAM MODULE */}
      <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl flex flex-col justify-between" id="ram-metric-card">
        <div>
          <div className="flex items-center justify-between mb-2" id="ram-card-header">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-sky-400" />
              <span className="font-mono text-xs font-semibold text-neutral-300">RAM MEMORY</span>
            </div>
            <span className="font-mono text-[10px] text-neutral-500 bg-neutral-950 px-1.5 py-0.5 rounded border border-neutral-800">
              LPDDR5
            </span>
          </div>

          <div className="flex items-baseline justify-between mt-3 mb-1" id="ram-stats-row">
            <span className="font-mono text-3xl font-bold text-neutral-100 tabular-nums">
              {metrics.ram}<span className="text-sm font-medium text-neutral-400">%</span>
            </span>
            <span className="font-mono text-xs text-neutral-400 tabular-nums">
              {metrics.ramUsed.toFixed(1)} GB / 16 GB
            </span>
          </div>

          <div className="mb-3" id="ram-bar-container">
            {getAsciiBar(metrics.ram)}
          </div>
        </div>

        <div className="pt-2 border-t border-neutral-800/60" id="ram-sparkline-area">
          <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 mb-1" id="ram-meta-row">
            <span>VOLATILE CACHE</span>
            <span>STANDBY DUMP</span>
          </div>
          {renderSparkline(history.ram, 'text-sky-500')}
        </div>
      </div>

      {/* GPU MODULE */}
      <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl flex flex-col justify-between" id="gpu-metric-card">
        <div>
          <div className="flex items-center justify-between mb-2" id="gpu-card-header">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-amber-500" />
              <span className="font-mono text-xs font-semibold text-neutral-300">GPU GRAPHICS</span>
            </div>
            <span className="font-mono text-[10px] text-neutral-500 bg-neutral-950 px-1.5 py-0.5 rounded border border-neutral-800">
              RTX PRO
            </span>
          </div>

          <div className="flex items-baseline justify-between mt-3 mb-1" id="gpu-stats-row">
            <span className="font-mono text-3xl font-bold text-neutral-100 tabular-nums">
              {metrics.gpu}<span className="text-sm font-medium text-neutral-400">%</span>
            </span>
            <span className="font-mono text-xs text-neutral-400 tabular-nums">
              CORE 1950 MHz
            </span>
          </div>

          <div className="mb-3" id="gpu-bar-container">
            {getAsciiBar(metrics.gpu)}
          </div>
        </div>

        <div className="pt-2 border-t border-neutral-800/60" id="gpu-sparkline-area">
          <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 mb-1" id="gpu-meta-row">
            <span className="flex items-center gap-1">
              <Thermometer className="w-3 h-3 text-red-500" />
              {metrics.gpuTemp}°C
            </span>
            <span>VRAM ALLOC</span>
          </div>
          {renderSparkline(history.gpu, 'text-amber-500')}
        </div>
      </div>

      {/* SSD STORAGE */}
      <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl flex flex-col justify-between" id="ssd-metric-card">
        <div>
          <div className="flex items-center justify-between mb-2" id="ssd-card-header">
            <div className="flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-rose-500" />
              <span className="font-mono text-xs font-semibold text-neutral-300">SSD STATUS</span>
            </div>
            <span className="font-mono text-[10px] text-neutral-500 bg-neutral-950 px-1.5 py-0.5 rounded border border-neutral-800">
              NVMe M.2
            </span>
          </div>

          <div className="flex items-baseline justify-between mt-3 mb-1" id="ssd-stats-row">
            <span className="font-mono text-3xl font-bold text-neutral-100 tabular-nums">
              {metrics.ssd}<span className="text-xs font-medium text-neutral-400">%</span>
            </span>
            <span className="font-mono text-xs text-neutral-400 tabular-nums">
              {metrics.ssdUsed.toFixed(1)} GB USED
            </span>
          </div>

          <div className="mb-3" id="ssd-bar-container">
            {getAsciiBar(metrics.ssd)}
          </div>
        </div>

        <div className="pt-2 border-t border-neutral-800/60 flex flex-col gap-1 text-[10px] font-mono text-neutral-400" id="ssd-metrics-meta">
          <div className="flex justify-between" id="ssd-meta-row-1">
            <span className="text-neutral-500">READ RATE:</span>
            <span className="text-neutral-300 tabular-nums">3,240 MB/s</span>
          </div>
          <div className="flex justify-between" id="ssd-meta-row-2">
            <span className="text-neutral-500">FAN SPEED:</span>
            <span className="text-emerald-400 tabular-nums flex items-center gap-0.5">
              <Fan className="w-2.5 h-2.5 animate-spin duration-3000" />
              {metrics.fanSpeed} RPM
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
