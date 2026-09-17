import { 
  SystemMetrics, 
  OptimizationTask, 
  BackgroundProcess, 
  JunkItem, 
  StartupApp, 
  LogEntry 
} from './types';

export function getTimestamp(): string {
  const now = new Date();
  const hrs = String(now.getHours()).padStart(2, '0');
  const mins = String(now.getMinutes()).padStart(2, '0');
  const secs = String(now.getSeconds()).padStart(2, '0');
  const ms = String(now.getMilliseconds()).padStart(3, '0');
  return `${hrs}:${mins}:${secs}.${ms}`;
}

export const INITIAL_METRICS: SystemMetrics = {
  cpu: 72,
  cpuSpeed: 3.47,
  cpuTemp: 68,
  ram: 53,
  ramUsed: 8.5,
  gpu: 10,
  gpuTemp: 52,
  ssd: 4,
  ssdUsed: 198.4,
  fanSpeed: 2100,
  healthScore: 74,
  bootTime: 14.2,
  ping: 34
};

export const INITIAL_OPTIMIZATIONS: OptimizationTask[] = [
  {
    id: 'cpu_unpark',
    name: 'CPU Core Unparking',
    category: 'cpu',
    checked: true,
    applied: false,
    description: 'Enables secondary cores to wake up instantly under load, eliminating micro-stutters.'
  },
  {
    id: 'bg_tasks',
    name: 'Background Task Limiter',
    category: 'ram',
    checked: true,
    applied: false,
    description: 'Suspends low-priority telemetry, update agents, and third-party helper processes.'
  },
  {
    id: 'power_plan',
    name: 'SPEED 7 Ultimate Power Plan',
    category: 'gpu',
    checked: true,
    applied: false,
    description: 'Configures CPU/GPU dynamic frequency scaling to prefer peak performance bounds.'
  },
  {
    id: 'startup_boost',
    name: 'Startup Delays Controller',
    category: 'startup',
    checked: true,
    applied: false,
    description: 'Applies millisecond delays to startup programs to allow quick desktop initialization.'
  },
  {
    id: 'memory_flush',
    name: 'Memory Cache Standby Flush',
    category: 'ram',
    checked: true,
    applied: false,
    description: 'Purges non-active cache chunks from the standby list back to free memory.'
  },
  {
    id: 'dns_latency',
    name: 'DNS Query Fast Routing',
    category: 'network',
    checked: false,
    applied: false,
    description: 'Flushes local DNS resolver cache and updates primary configuration to high-speed DNS.'
  }
];

export const INITIAL_PROCESSES: BackgroundProcess[] = [
  { id: 'proc_1', name: 'chrome.exe (Helper)', cpu: 14.5, ram: 1420, type: 'User', status: 'Running' },
  { id: 'proc_2', name: 'telemetry_agent.exe', cpu: 12.1, ram: 280, type: 'Service', status: 'Running' },
  { id: 'proc_3', name: 'discord_overlay.exe', cpu: 8.2, ram: 410, type: 'User', status: 'Running' },
  { id: 'proc_4', name: 'steam_web_helper.exe', cpu: 9.8, ram: 630, type: 'User', status: 'Running' },
  { id: 'proc_5', name: 'update_assistant.exe', cpu: 18.4, ram: 310, type: 'Service', status: 'Running' },
  { id: 'proc_6', name: 'svchost.exe (CryptoSvc)', cpu: 4.2, ram: 120, type: 'System', status: 'Running' },
  { id: 'proc_7', name: 'node_dev_server.exe', cpu: 5.0, ram: 350, type: 'User', status: 'Running' }
];

export const INITIAL_JUNK_ITEMS: JunkItem[] = [
  { id: 'junk_1', name: 'Temporary AppData Files', sizeMB: 1240, category: 'Temp', checked: true },
  { id: 'junk_2', name: 'DirectX Shader Cache', sizeMB: 840, category: 'Cache', checked: true },
  { id: 'junk_3', name: 'Browser Crash Dumps', sizeMB: 2310, category: 'Log', checked: true },
  { id: 'junk_4', name: 'Windows Update Backup Log', sizeMB: 4120, category: 'System', checked: true },
  { id: 'junk_5', name: 'Offline Map Cache', sizeMB: 450, category: 'Cache', checked: false },
  { id: 'junk_6', name: 'Prefetch & Minidumps', sizeMB: 310, category: 'Temp', checked: true }
];

export const INITIAL_STARTUP_APPS: StartupApp[] = [
  { id: 'start_1', name: 'Spotify Web Helper', publisher: 'Spotify AB', impact: 'Medium', enabled: true },
  { id: 'start_2', name: 'Steam Client Bootstrapper', publisher: 'Valve Corp', impact: 'High', enabled: true },
  { id: 'start_3', name: 'OneDrive Sync Client', publisher: 'Microsoft Corp', impact: 'High', enabled: true },
  { id: 'start_4', name: 'Discord Bootstrapper', publisher: 'Discord Inc', impact: 'Medium', enabled: true },
  { id: 'start_5', name: 'Epic Games Launcher', publisher: 'Epic Games', impact: 'High', enabled: false },
  { id: 'start_6', name: 'Logitech G HUB', publisher: 'Logitech Inc', impact: 'Low', enabled: true }
];
