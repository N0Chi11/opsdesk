'use strict';
import { actualPorts, preferredOpenPort } from './ports.js';

/* 只在受控服务确实监听时打开，不把配置端口当作就绪凭据。 */
export function readyServicePort(app) {
  if (!app || !app.running || app.portOccupied || app.portConflict) return null;
  const port = preferredOpenPort(app);
  if (!port) return null;
  return app.listening === true || actualPorts(app).includes(port) ? port : null;
}

export async function waitForServicePort({ getApp, refresh, canceled, pause,
  now = Date.now, timeoutMs = 30000, intervalMs = 1000 }) {
  const deadline = now() + timeoutMs;
  let sawRunning = false;
  while (!canceled() && now() < deadline) {
    await refresh();
    if (canceled()) return { reason: 'canceled' };
    const app = getApp();
    if (!app) return { reason: 'missing' };
    if (app.running) sawRunning = true;
    else if (sawRunning) return { reason: 'stopped' };
    const port = readyServicePort(app);
    if (port) return { app, port };
    await pause(intervalMs);
  }
  return { reason: canceled() ? 'canceled' : 'timeout' };
}
