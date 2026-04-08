// @mostajs/pm2 — Types
// Author: Dr Hamid MADANI drmdh@msn.com

export type ProcessStatus = 'online' | 'stopping' | 'stopped' | 'launching' | 'errored' | 'one-launch-status'

export interface Pm2ProcessDTO {
  name: string
  pid: number
  pm_id: number
  status: ProcessStatus
  cpu: number
  memory: number        // bytes
  uptime: number        // ms
  restarts: number
  unstableRestarts: number
  createdAt: number     // timestamp
}

export interface Pm2Config {
  script: string
  name: string
  cwd?: string
  args?: string
  instances?: number
  exec_mode?: 'fork' | 'cluster'
  max_memory_restart?: string
  env?: Record<string, string>
}

export interface Pm2LogEntry {
  type: 'out' | 'err'
  data: string
  timestamp?: number
  process: { name: string; pm_id: number }
}

export interface Pm2Metrics {
  totalCpu: number
  totalMem: number     // bytes
  processes: number
}
