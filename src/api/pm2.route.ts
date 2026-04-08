// @mostajs/pm2 — API route handlers
// Author: Dr Hamid MADANI drmdh@msn.com

import { Pm2Client } from '../lib/pm2-client.js'
import type { Pm2Config } from '../types/index.js'

export function createPm2Handlers(client?: Pm2Client) {
  const pm2 = client ?? new Pm2Client()

  /** GET /pm2/list — List all PM2 processes */
  async function listProcesses(): Promise<Response> {
    try {
      const procs = await pm2.list()
      return Response.json(procs)
    } catch (e: any) {
      return Response.json({ error: 'PM2_ERROR', message: e.message }, { status: 500 })
    }
  }

  /** GET /pm2/:name — Describe a process */
  async function describeProcess(name: string): Promise<Response> {
    try {
      const proc = await pm2.describe(name)
      if (!proc) return Response.json({ error: 'PROCESS_NOT_FOUND' }, { status: 404 })
      return Response.json(proc)
    } catch (e: any) {
      return Response.json({ error: 'PM2_ERROR', message: e.message }, { status: 500 })
    }
  }

  /** POST /pm2/:name/start — Start a process */
  async function startProcess(name: string, config?: Pm2Config): Promise<Response> {
    try {
      await pm2.start(config ?? { script: name, name })
      return Response.json({ ok: true, action: 'start', name })
    } catch (e: any) {
      return Response.json({ error: 'PM2_ERROR', message: e.message }, { status: 500 })
    }
  }

  /** POST /pm2/:name/stop — Stop a process */
  async function stopProcess(name: string): Promise<Response> {
    try {
      await pm2.stop(name)
      return Response.json({ ok: true, action: 'stop', name })
    } catch (e: any) {
      return Response.json({ error: 'PM2_ERROR', message: e.message }, { status: 500 })
    }
  }

  /** POST /pm2/:name/restart — Restart a process */
  async function restartProcess(name: string): Promise<Response> {
    try {
      await pm2.restart(name)
      return Response.json({ ok: true, action: 'restart', name })
    } catch (e: any) {
      return Response.json({ error: 'PM2_ERROR', message: e.message }, { status: 500 })
    }
  }

  /** DELETE /pm2/:name — Delete a process */
  async function deleteProcess(name: string): Promise<Response> {
    try {
      await pm2.delete(name)
      return Response.json({ ok: true, action: 'delete', name })
    } catch (e: any) {
      return Response.json({ error: 'PM2_ERROR', message: e.message }, { status: 500 })
    }
  }

  /** POST /pm2/:name/flush — Flush logs */
  async function flushLogs(name: string): Promise<Response> {
    try {
      await pm2.flush(name)
      return Response.json({ ok: true, action: 'flush', name })
    } catch (e: any) {
      return Response.json({ error: 'PM2_ERROR', message: e.message }, { status: 500 })
    }
  }

  /** GET /pm2/metrics — Global metrics */
  async function getMetrics(): Promise<Response> {
    try {
      const m = await pm2.metrics()
      return Response.json(m)
    } catch (e: any) {
      return Response.json({ error: 'PM2_ERROR', message: e.message }, { status: 500 })
    }
  }

  return {
    listProcesses, describeProcess, startProcess, stopProcess,
    restartProcess, deleteProcess, flushLogs, getMetrics,
    client: pm2,
  }
}
