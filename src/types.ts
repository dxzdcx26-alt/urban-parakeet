export interface SystemMetrics {
  cpu: number;       // percentage
  cpuSpeed: number;  // in GHz
  cpuTemp: number;   // in °C
  ram: number;       // percentage
  ramUsed: number;   // in GB
  gpu: number;       // percentage
  gpuTemp: number;   // in °C
  ssd: number;       // percentage (used or junk)
  ssdUsed: number;   // in GB
  fanSpeed: number;  // in RPM
  healthScore: number; // overall system score
  bootTime: number;  // in seconds
  ping: number;      // in ms
}

export interface OptimizationTask {
  id: string;
  name: string;
  category: 'cpu' | 'ram' | 'gpu' | 'ssd' | 'network' | 'startup';
  checked: boolean;
  applied: boolean;
  description: string;
}

export interface BackgroundProcess {
  id: string;
  name: string;
  cpu: number; // percentage
  ram: number; // in MB
  type: 'System' | 'User' | 'Service';
  status: 'Running' | 'Suspended';
}

export interface JunkItem {
  id: string;
  name: string;
  sizeMB: number;
  category: 'Temp' | 'Cache' | 'Log' | 'System';
  checked: boolean;
}

export interface StartupApp {
  id: string;
  name: string;
  publisher: string;
  impact: 'High' | 'Medium' | 'Low' | 'None';
  enabled: boolean;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'success' | 'warn' | 'error';
  message: string;
}

export type PerformancePreset = 'SPEED_7_MAX' | 'BALANCED' | 'BATTERY_SAVER' | 'SILENT' | 'CUSTOM';
