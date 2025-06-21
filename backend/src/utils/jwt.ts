// src/utils/jwt.ts
import configs from '@config/index';
import jwt from 'jsonwebtoken';
import { JwtPayload } from 'src/types/auth/jwt-payload';

class JwtAuth {
    generateToken = (
        payload: JwtPayload,
        ): string => {
        return jwt.sign(
            {
            ...payload,
            iss: 'ipdv-auth-codetest',
            },
            configs.jwtSecret as string,
            { expiresIn: configs.jwtExpiration || '1h' } as jwt.SignOptions
        );
    };

    verifyToken = (token: string): jwt.JwtPayload => {
        return jwt.verify(token, configs.jwtSecret) as jwt.JwtPayload;
    };
}

let jwtAuth = new JwtAuth()

export { jwtAuth };
