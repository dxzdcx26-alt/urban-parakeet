import React from 'react';
import { Zap, Shield, Battery, VolumeX, AlertCircle } from 'lucide-react';
import { PerformancePreset, SystemMetrics } from '../types';

interface ProfileSelectorProps {
  currentPreset: PerformancePreset;
  onPresetChange: (preset: PerformancePreset) => void;
  metrics: SystemMetrics;
}

export default function ProfileSelector({ currentPreset, onPresetChange, metrics }: ProfileSelectorProps) {
  // Configs for presets
  const presets = [
    {
      id: 'SPEED_7_MAX' as PerformancePreset,
      name: 'SPEED 7 MAX',
      icon: Zap,
      color: 'text-amber-500 border-amber-500/30 bg-amber-500/5',
      activeColor: 'text-amber-400 border-amber-400 bg-amber-400/10 ring-2 ring-amber-400/20',
      description: 'Maximum clock limits, all optimization tasks active, zero latency scheduler.',
      specs: { clock: 'Up to 4.80GHz', power: 'Unrestricted', fan: 'Turbo Active' }
    },
    {
      id: 'BALANCED' as PerformancePreset,
      name: 'BALANCED',
      icon: Shield,
      color: 'text-emerald-500 border-emerald-500/30 bg-emerald-500/5',
      activeColor: 'text-emerald-400 border-emerald-400 bg-emerald-400/10 ring-2 ring-emerald-400/20',
      description: 'Dynamic power adjustment based on workload. Medium fan noise and optimal response.',
      specs: { clock: 'Up to 3.50GHz', power: 'Dynamic', fan: 'Acoustic Balanced' }
    },
    {
      id: 'BATTERY_SAVER' as PerformancePreset,
      name: 'BATTERY SAVER',
      icon: Battery,
      color: 'text-sky-500 border-sky-500/30 bg-sky-500/5',
      activeColor: 'text-sky-400 border-sky-400 bg-sky-400/10 ring-2 ring-sky-400/20',
      description: 'Underclocks active CPU/GPU cores and suspends background processes for longer cell life.',
      specs: { clock: 'Limited 1.80GHz', power: 'Eco Mode (15W)', fan: 'Passive Safe' }
    },
    {
      id: 'SILENT' as PerformancePreset,
      name: 'SILENT PROFILE',
      icon: VolumeX,
      color: 'text-neutral-400 border-neutral-700 bg-neutral-900/40',
      activeColor: 'text-neutral-200 border-neutral-200 bg-neutral-800 ring-2 ring-neutral-200/20',
      description: 'Locks fan speed below 1200 RPM, capping performance to prevent heat build-up.',
      specs: { clock: 'Limited 2.20GHz', power: 'Quiet Max (25W)', fan: 'Locked low-noise' }
    }
  ];

  // Map Preset database key to array id
  const activePresetId = currentPreset === 'CUSTOM' ? 'SPEED_7_MAX' : currentPreset;

  return (
    <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl flex flex-col justify-between h-full" id="profile-selector-container">
      <div>
        <div className="flex items-center justify-between mb-4" id="profile-header">
          <h2 className="font-mono text-sm font-bold text-neutral-300 tracking-wide flex items-center gap-2">
            <span className="w-1.5 h-3 bg-amber-400 rounded-sm"></span>
            PERFORMANCE PROFILES
          </h2>
          {currentPreset === 'CUSTOM' && (
            <span className="font-mono text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded uppercase font-bold animate-pulse">
              Custom Engine Tweaks Active
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" id="profile-cards-grid">
          {presets.map((preset) => {
            const isSelected = currentPreset === preset.id || (currentPreset === 'CUSTOM' && preset.id === 'SPEED_7_MAX');
            const IconComponent = preset.icon;
            return (
              <button
                key={preset.id}
                id={`preset-btn-${preset.id}`}
                onClick={() => onPresetChange(preset.id)}
                className={`flex flex-col text-left p-3.5 border rounded-xl transition-all duration-300 relative group cursor-pointer ${
                  isSelected ? preset.activeColor : `${preset.color} hover:border-neutral-700 hover:bg-neutral-800/40`
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5" id={`preset-header-${preset.id}`}>
                  <IconComponent className={`w-4 h-4 ${isSelected ? 'animate-pulse' : ''}`} />
                  <span className="font-mono text-xs font-bold uppercase tracking-wider">{preset.name}</span>
                </div>
                <p className="text-[11px] text-neutral-400 leading-relaxed min-h-[48px]" id={`preset-desc-${preset.id}`}>
                  {preset.description}
                </p>

                {/* Meta details */}
                <div className="mt-3 pt-2.5 border-t border-neutral-800/80 flex items-center justify-between text-[9px] font-mono text-neutral-500" id={`preset-meta-${preset.id}`}>
                  <div>
                    <span className="text-neutral-600">CLOCK: </span>
                    <span className="text-neutral-400 font-semibold">{preset.specs.clock}</span>
                  </div>
                  <div>
                    <span className="text-neutral-600">FAN: </span>
                    <span className="text-neutral-400 font-semibold">{preset.specs.fan}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* HEALTH INDEX */}
      <div className="mt-6 pt-5 border-t border-neutral-800 flex flex-col sm:flex-row items-center gap-5" id="health-index-panel">
        {/* Circle Ring Progress for Overall System Health Score */}
        <div className="relative w-24 h-24 shrink-0 flex items-center justify-center" id="health-gauge-container">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="48"
              cy="48"
              r="40"
              stroke="#1e2124"
              strokeWidth="6"
              fill="transparent"
            />
            <circle
              cx="48"
              cy="48"
              r="40"
              stroke={metrics.healthScore > 90 ? '#34d399' : '#f59e0b'}
              strokeWidth="6"
              fill="transparent"
              strokeDasharray={2 * Math.PI * 40}
              strokeDashoffset={2 * Math.PI * 40 * (1 - metrics.healthScore / 100)}
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center" id="health-score-inner">
            <span className="font-mono text-2xl font-bold text-neutral-100 tabular-nums">
              {metrics.healthScore}
            </span>
            <span className="text-[8px] font-mono text-neutral-500 tracking-wider">HEALTH %</span>
          </div>
        </div>

        <div className="flex-1" id="health-status-details">
          <div className="flex items-center gap-1.5 mb-1" id="health-status-badge-row">
            <span className="text-xs font-mono font-bold text-neutral-200">OPTIMIZER CORE STATUS</span>
            <span className={`inline-block w-2 h-2 rounded-full ${metrics.healthScore > 90 ? 'bg-emerald-500 animate-ping' : 'bg-amber-500 animate-pulse'}`}></span>
          </div>
          <p className="text-xs text-neutral-400 leading-relaxed mb-3">
            {metrics.healthScore > 90 
              ? 'Excellent. All latency buffers flushed, background telemetry purged, and CPU/GPU scaling profiles optimized to SPEED 7 standards.'
              : 'Suboptimal latency bottlenecks detected. Startup delay overhead is at 14.2s, standby RAM caches are cluttered, and core frequency is throttled.'
            }
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] font-mono text-neutral-500" id="health-substats">
            <div>
              <span className="text-neutral-600">BOOT SPEED:</span>{' '}
              <span className="text-neutral-300 font-semibold">{metrics.bootTime.toFixed(1)}s</span>
            </div>
            <div>
              <span className="text-neutral-600">SYS LATENCY:</span>{' '}
              <span className="text-neutral-300 font-semibold">{metrics.ping}ms</span>
            </div>
            <div>
              <span className="text-neutral-600">POWER ALLOC:</span>{' '}
              <span className="text-amber-400 font-semibold">{currentPreset === 'BATTERY_SAVER' ? '15W' : currentPreset === 'SILENT' ? '25W' : '95W Dynamic'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
