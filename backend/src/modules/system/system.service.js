export function getSystemInfo() {
  return {
    application: {
      environment: process.env.APP_ENV ?? 'local',
      version: process.env.APP_VERSION ?? 'development',
      runtime: `Bun ${Bun.version}`,
    },
    kubernetes: {
      enabled: Boolean(process.env.POD_NAME),
      podName: process.env.POD_NAME ?? null,
      namespace: process.env.POD_NAMESPACE ?? null,
      podIp: process.env.POD_IP ?? null,
      nodeName: process.env.NODE_NAME ?? null,
    },
    timestamp: new Date().toISOString(),
  };
}
