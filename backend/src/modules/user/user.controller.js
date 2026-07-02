import { ValidationError } from '../../shared/errors/validation.error.js';
import * as userService from './user.service.js';

export async function createUser(req, res) {
  const user = await userService.createUser(req.body);

  return res.status(201).json(user);
}

export async function findUserById(req, res) {
  const id = parseUserId(req.params.id);
  const user = await userService.findUserById(id);

  return res.status(200).json(user);
}

export async function updateUser(req, res) {
  const id = parseUserId(req.params.id);
  const user = await userService.updateUserById(id, req.body);

  return res.status(200).json(user);
}

export async function deleteUser(req, res) {
  const id = parseUserId(req.params.id);

  await userService.deleteUserById(id);

  return res.status(204).send();
}

function parseUserId(value) {
  const id = Number(value);

  if (!Number.isInteger(id) || id <= 0) {
    throw new ValidationError([
      {
        field: 'id',
        message: 'ID must be a positive integer',
      },
    ]);
  }

  return id;
}
