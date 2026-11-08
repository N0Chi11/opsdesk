import test from 'node:test';
import assert from 'node:assert/strict';
import { readyServicePort, waitForServicePort } from '../../static/js/auto-open.js';

test('仅打开受控进程实际监听的端口', () => {
  assert.equal(readyServicePort({ running: false, port: 3080 }), null);
  assert.equal(readyServicePort({ running: true, port: 3080, listening: false, ports: [] }), null);
  assert.equal(readyServicePort({ running: true, port: 3080, listening: true }), 3080);
  assert.equal(readyServicePort({ running: true, port: 3080, listening: false, ports: [3000] }), 3000);
  assert.equal(readyServicePort({ running: true, port: 3080, listening: true, portOccupied: true }), null);
});

test('轮询直到服务监听，并在停止时退出', async () => {
  const states = [
    { running: true, port: 3080, listening: false },
    { running: true, port: 3080, listening: true },
  ];
  let index = -1;
  const result = await waitForServicePort({
    getApp: () => states[index], refresh: async () => { index++; },
    canceled: () => false, pause: async () => {},
  });
  assert.equal(result.port, 3080);

  const stopped = [{ running: true, port: 3080 }, { running: false, port: 3080 }];
  index = -1;
  const outcome = await waitForServicePort({
    getApp: () => stopped[index], refresh: async () => { index++; },
    canceled: () => false, pause: async () => {},
  });
  assert.equal(outcome.reason, 'stopped');
});

test('超时或用户关闭等待页时不会打开服务', async () => {
  let clock = 0;
  const timeout = await waitForServicePort({
    getApp: () => ({ running: true, port: 3080, listening: false }),
    refresh: async () => {}, canceled: () => false,
    pause: async ms => { clock += ms; }, now: () => clock, timeoutMs: 2000,
  });
  assert.equal(timeout.reason, 'timeout');
  const canceled = await waitForServicePort({
    getApp: () => null, refresh: async () => {}, canceled: () => true,
    pause: async () => {},
  });
  assert.equal(canceled.reason, 'canceled');
});
