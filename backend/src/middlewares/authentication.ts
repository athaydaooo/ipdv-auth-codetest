import { authInvalidToken, authMissingToken } from '@errors/auth';
import { jwtAuth } from '@util/jwt';
import { NextFunction, Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';

// Extend Express Request interface to include 'user'
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export default function autenticationMiddleware(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) {
        throw authMissingToken;
    }

    try {
        const user = jwtAuth.verifyToken(token);
        req.user = user;
        next();
    } catch (err) {
        throw authInvalidToken;
    }
}