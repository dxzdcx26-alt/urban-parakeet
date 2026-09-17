import React, { useState } from 'react';
import { Globe, RefreshCw, Zap, ShieldAlert, Wifi } from 'lucide-react';

interface NetworkBoostProps {
  ping: number;
  onOptimizeDNS: (provider: string) => void;
  isOptimizing: boolean;
}

export default function NetworkBoost({ ping, onOptimizeDNS, isOptimizing }: NetworkBoostProps) {
  const [selectedDNS, setSelectedDNS] = useState('CLOUDFLARE');
  const [lastTestTime, setLastTestTime] = useState<string>('Never');

  const dnsProviders = [
    { id: 'CLOUDFLARE', name: 'Cloudflare Core (1.1.1.1)', speed: 'Ultra Fast', latency: '12ms' },
    { id: 'GOOGLE', name: 'Google Public DNS (8.8.8.8)', speed: 'Fast', latency: '15ms' },
    { id: 'QUAD9', name: 'Quad9 Security (9.9.9.9)', speed: 'Secure / Mid', latency: '21ms' }
  ];

  const handleOptimizeClick = () => {
    onOptimizeDNS(selectedDNS);
    const now = new Date();
    setLastTestTime(now.toLocaleTimeString());
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-xl flex flex-col justify-between h-full" id="network-boost-container">
      <div>
        <div className="flex items-center justify-between mb-4" id="network-header">
          <h2 className="font-mono text-sm font-bold text-neutral-300 tracking-wide flex items-center gap-2">
            <span className="w-1.5 h-3 bg-emerald-400 rounded-sm"></span>
            LATENCY BUFFER & DNS booster
          </h2>

          <div className="flex items-center gap-1.5 font-mono text-[10px]" id="network-latencies">
            <span className="text-neutral-500">PING:</span>
            <span className={`px-2 py-0.5 rounded border font-bold tabular-nums ${
              ping < 15 
                ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/20' 
                : 'bg-amber-950/40 text-amber-400 border-amber-500/20'
            }`}>
              {ping} ms
            </span>
          </div>
        </div>

        {/* DNS selection radio list */}
        <div className="grid grid-cols-1 gap-2.5 mb-4" id="dns-provider-selection">
          {dnsProviders.map((provider) => {
            const isSelected = selectedDNS === provider.id;
            return (
              <button
                key={provider.id}
                id={`dns-btn-${provider.id}`}
                disabled={isOptimizing}
                onClick={() => setSelectedDNS(provider.id)}
                className={`flex items-center justify-between p-3 rounded-lg border text-left transition-all font-mono cursor-pointer disabled:opacity-50 ${
                  isSelected 
                    ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300' 
                    : 'bg-neutral-950/40 border-neutral-800/80 hover:border-neutral-700 text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <div className="flex items-center gap-2.5" id={`dns-left-${provider.id}`}>
                  <Globe className={`w-4 h-4 ${isSelected ? 'text-emerald-400' : 'text-neutral-500'}`} />
                  <div>
                    <span className="text-xs font-bold block">{provider.name}</span>
                    <span className="text-[9px] text-neutral-500 uppercase font-semibold">Priority: {provider.speed}</span>
                  </div>
                </div>

                <div className="text-right" id={`dns-right-${provider.id}`}>
                  <span className={`text-xs font-bold font-mono ${isSelected ? 'text-emerald-400' : 'text-neutral-400'}`}>
                    {provider.latency}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Action DNS flushing button */}
        <button
          onClick={handleOptimizeClick}
          disabled={isOptimizing}
          id="flush-dns-btn"
          className="w-full py-2.5 px-4 font-mono font-bold text-xs border border-emerald-500/40 bg-emerald-950/10 hover:bg-emerald-500 hover:text-neutral-950 text-emerald-400 transition-all rounded-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
        >
          {isOptimizing ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              FLUSHING RESOLVER CACHE & RE-ROUTING PING...
            </>
          ) : (
            <>
              <Zap className="w-3.5 h-3.5" />
              FLUSH DNS & OPTIMIZE SPEED
            </>
          )}
        </button>
      </div>

      {/* Tracer Visualizer Animation and meta logs */}
      <div className="mt-4" id="network-trace-panel">
        <div className="bg-neutral-950 border border-neutral-800 p-3 rounded-lg font-mono text-[10px]" id="tracer-box">
          <div className="flex justify-between text-neutral-500 font-bold mb-1.5" id="tracer-header">
            <span>PACKET ROUTING TRACE</span>
            <span>LAST RUN: {lastTestTime}</span>
          </div>

          <div className="space-y-1 text-neutral-400" id="tracer-log">
            <div className="flex justify-between" id="tracer-row-1">
              <span>HOP 1: LOCALHOST (127.0.0.1)</span>
              <span className="text-emerald-400 tabular-nums">0.12 ms</span>
            </div>
            <div className="flex justify-between" id="tracer-row-2">
              <span>HOP 2: GATEWAY (192.168.1.1)</span>
              <span className="text-emerald-400 tabular-nums">1.45 ms</span>
            </div>
            <div className="flex justify-between" id="tracer-row-3">
              <span>HOP 3: DNS EDGE ({selectedDNS === 'CLOUDFLARE' ? '1.1.1.1' : selectedDNS === 'GOOGLE' ? '8.8.8.8' : '9.9.9.9'})</span>
              <span className="text-emerald-400 font-bold tabular-nums">{ping} ms</span>
            </div>
          </div>
        </div>

        <div className="mt-3.5 flex items-center gap-2 text-[10px] font-mono text-neutral-500" id="network-footer-note">
          <Wifi className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
          <span>Configuring third-party secure DNS providers resolves server lookups significantly faster than default ISP gateway resolvers.</span>
        </div>
      </div>
    </div>
  );
}
