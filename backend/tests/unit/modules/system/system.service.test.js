import { afterEach, describe, expect, test } from 'bun:test';
import { getSystemInfo } from '../../../../src/modules/system/system.service.js';

const environmentKeys = [
  'APP_ENV',
  'APP_VERSION',
  'POD_NAME',
  'POD_NAMESPACE',
  'POD_IP',
  'NODE_NAME',
];

const originalEnvironment = Object.fromEntries(
  environmentKeys.map((key) => [key, process.env[key]]),
);

afterEach(() => {
  for (const key of environmentKeys) {
    const originalValue = originalEnvironment[key];

    if (originalValue === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = originalValue;
    }
  }
});

describe('getSystemInfo', () => {
  test('returns local defaults outside Kubernetes', () => {
    for (const key of environmentKeys) {
      delete process.env[key];
    }

    const info = getSystemInfo();

    expect(info.application).toEqual({
      environment: 'local',
      version: 'development',
      runtime: `Bun ${Bun.version}`,
    });
    expect(info.kubernetes).toEqual({
      enabled: false,
      podName: null,
      namespace: null,
      podIp: null,
      nodeName: null,
    });
    expect(Number.isNaN(Date.parse(info.timestamp))).toBe(false);
  });

  test('returns application and pod metadata from the environment', () => {
    process.env.APP_ENV = 'production';
    process.env.APP_VERSION = '1.2.3';
    process.env.POD_NAME = 'api-7c9d';
    process.env.POD_NAMESPACE = 'k3s-basic-app';
    process.env.POD_IP = '10.42.0.15';
    process.env.NODE_NAME = 'k3s-node-1';

    const info = getSystemInfo();

    expect(info.application.environment).toBe('production');
    expect(info.application.version).toBe('1.2.3');
    expect(info.kubernetes).toEqual({
      enabled: true,
      podName: 'api-7c9d',
      namespace: 'k3s-basic-app',
      podIp: '10.42.0.15',
      nodeName: 'k3s-node-1',
    });
  });
});
