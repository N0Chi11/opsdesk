'use strict';
import { waitForServicePort } from './auto-open.js';

const id = new URLSearchParams(location.search).get('app') || '';
const title = document.querySelector('#title');
const status = document.querySelector('#status');
let current = { running: false };

async function refresh() {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch('/api/state', { cache: 'no-store', signal: controller.signal });
    if (!response.ok) throw new Error('状态读取失败');
    const data = await response.json();
    current = (data.apps || []).find(app => app.id === id) || null;
  } catch (_) {
    status.textContent = '正在连接 OpsDesk，服务准备好后会自动跳转。';
  } finally {
    clearTimeout(timer);
  }
}

async function run() {
  if (!/^[0-9a-f]{8}$/i.test(id)) {
    title.textContent = '无法识别服务';
    status.textContent = '请返回 OpsDesk，重新点击服务卡片上的启动按钮。';
    return;
  }
  const result = await waitForServicePort({
    getApp: () => current, refresh, canceled: () => false,
    pause: ms => new Promise(resolve => setTimeout(resolve, ms)),
    timeoutMs: 90000,
  });
  if (result.port) {
    const bound = result.app.openHosts && result.app.openHosts[String(result.port)];
    const host = bound === 'localhost' ? 'localhost' : '127.0.0.1';
    location.replace('http://' + host + ':' + result.port + '/');
    return;
  }
  title.textContent = '暂时无法打开服务';
  status.textContent = result.reason === 'stopped'
    ? '服务已经停止，请返回 OpsDesk 查看日志和启动诊断。'
    : result.reason === 'missing'
      ? '未找到这张服务卡片，请返回 OpsDesk 确认配置。'
      : '等待超时。请返回 OpsDesk 查看服务状态和日志，或点击卡片上的端口手动打开。';
}

void run();
