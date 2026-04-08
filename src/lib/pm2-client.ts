// @mostajs/pm2 — PM2 client wrapper
// Author: Dr Hamid MADANI drmdh@msn.com

import type { Pm2ProcessDTO, Pm2Config, Pm2Metrics, ProcessStatus } from '../types/index.js'

let pm2Module: any = null

async function getPm2(): Promise<any> {
  if (!pm2Module) {
    try {
      pm2Module = await import(/* webpackIgnore: true */ 'pm2' as string)
      // Handle both ESM default and CJS
      if (pm2Module.default) pm2Module = pm2Module.default
    } catch {
      throw new Error('pm2 is not installed. Install it: npm install pm2')
    }
  }
  return pm2Module
}

function promisify(fn: Function, ...args: any[]): Promise<any> {
  return new Promise((resolve, reject) => {
    fn(...args, (err: any, result: any) => {
      if (err) reject(err)
      else resolve(result)
    })
  })
}

function toProcessDTO(proc: any): Pm2ProcessDTO {
  const env = proc.pm2_env ?? {}
  const monit = proc.monit ?? {}
  return {
    name: env.name ?? proc.name ?? 'unknown',
    pid: proc.pid ?? 0,
    pm_id: env.pm_id ?? proc.pm_id ?? 0,
    status: (env.status ?? 'stopped') as ProcessStatus,
    cpu: monit.cpu ?? 0,
    memory: monit.memory ?? 0,
    uptime: env.pm_uptime ? Date.now() - env.pm_uptime : 0,
    restarts: env.restart_time ?? 0,
    unstableRestarts: env.unstable_restarts ?? 0,
    createdAt: env.created_at ?? 0,
  }
}

export class Pm2Client {
  private connected = false

  async connect(): Promise<void> {
    if (this.connected) return
    const pm2 = await getPm2()
    await promisify(pm2.connect.bind(pm2))
    this.connected = true
  }

  async disconnect(): Promise<void> {
    if (!this.connected) return
    const pm2 = await getPm2()
    pm2.disconnect()
    this.connected = false
  }

  async list(): Promise<Pm2ProcessDTO[]> {
    await this.connect()
    const pm2 = await getPm2()
    const procs = await promisify(pm2.list.bind(pm2))
    return (procs ?? []).map(toProcessDTO)
  }

  async describe(name: string): Promise<Pm2ProcessDTO | null> {
    await this.connect()
    const pm2 = await getPm2()
    const procs = await promisify(pm2.describe.bind(pm2), name)
    if (!procs || procs.length === 0) return null
    return toProcessDTO(procs[0])
  }

  async start(config: Pm2Config): Promise<void> {
    await this.connect()
    const pm2 = await getPm2()
    await promisify(pm2.start.bind(pm2), config)
  }

  async stop(name: string): Promise<void> {
    await this.connect()
    const pm2 = await getPm2()
    await promisify(pm2.stop.bind(pm2), name)
  }

  async restart(name: string): Promise<void> {
    await this.connect()
    const pm2 = await getPm2()
    await promisify(pm2.restart.bind(pm2), name)
  }

  async delete(name: string): Promise<void> {
    await this.connect()
    const pm2 = await getPm2()
    await promisify(pm2.delete.bind(pm2), name)
  }

  async flush(name: string): Promise<void> {
    await this.connect()
    const pm2 = await getPm2()
    await promisify(pm2.flush.bind(pm2), name)
  }

  async metrics(): Promise<Pm2Metrics> {
    const procs = await this.list()
    return {
      totalCpu: procs.reduce((sum, p) => sum + p.cpu, 0),
      totalMem: procs.reduce((sum, p) => sum + p.memory, 0),
      processes: procs.length,
    }
  }

  get isConnected(): boolean { return this.connected }
}
