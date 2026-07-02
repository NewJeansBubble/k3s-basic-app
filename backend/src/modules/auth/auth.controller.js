import * as authService from './auth.service.js';

export async function login(req, res) {
  const result = await authService.login(req.body);

  return res.status(200).json(result);
}
