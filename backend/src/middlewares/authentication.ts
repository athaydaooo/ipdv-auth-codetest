import { authMissingToken } from '@errors/auth';
import { jwtAuth } from '@utils/jwt';
import { NextFunction, Request, Response } from 'express';

export default async function autenticationMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) { throw authMissingToken; }

  await jwtAuth.verifySession(token);
  next();
}