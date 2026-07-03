import * as systemService from './system.service.js';

export function getSystemInfo(_req, res) {
  const info = systemService.getSystemInfo();

  return res.status(200).json(info);
}
