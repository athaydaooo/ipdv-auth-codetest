import configs from '@configs/index';
import { authInvalidJWT, authRevokedSession, authSessionExpired, authSessionNotFound, authUserDeactivated, authUserNotFound } from '@errors/auth';
import { parseDuration } from '@helpers/parse-duration';
import { Session, User } from '@prisma/client';
import { UserRepository } from '@repositories/user-repository';
import jwt from 'jsonwebtoken';
import { JwtPayload } from 'src/types/auth/jwt-payload';
import { SessionRepository } from '../repositories/session-repository';

class JwtAuth {
    private userRepository: UserRepository;
    private sessionRepository: SessionRepository;
    constructor() {
        this.userRepository = new UserRepository();
        this.sessionRepository = new SessionRepository();
    }
    generateToken(
        payload: JwtPayload,
        expiresIn: string = '1h'
        ): string {
        return jwt.sign(
            {
            ...payload,
            iss: 'ipdv-auth-codetest',
            },
            configs.jwtSecret as string,
            { expiresIn: expiresIn || configs.jwtExpiration } as jwt.SignOptions
        );
    };

    verifyToken(token: string): jwt.JwtPayload {
        return jwt.verify(token, configs.jwtSecret) as jwt.JwtPayload;
    }

    async verifySession(token: string): Promise<jwt.JwtPayload> {

        let userJwt;
        
        try {
            userJwt = this.verifyToken(token) as jwt.JwtPayload;
        }
        catch {
            throw authInvalidJWT;
        }

        const user = await this.userRepository.getUserById(userJwt.userId);
        if (!user) { throw authUserNotFound; }
        if(!user.isActive){ throw authUserDeactivated; }

        const session = await this.sessionRepository.getSessionByAccessToken(token);
        if (!session) { throw authSessionNotFound; }
        if(session.isRevoked) { throw authRevokedSession; }
        if(session.accessTokenExpiresAt < new Date()) {
            throw authSessionExpired;
        }


        return userJwt;
    };

    generateSessionByUser(user: User, role: string []): Session {
        const jwtPayload: JwtPayload = {
            userId: user.id,
            name: user.name,
            email: user.email,
            role,
        };
        
        const accessToken = this.generateToken(jwtPayload, configs.jwtExpiration);
        const refreshToken = this.generateToken(jwtPayload, configs.jwtRefreshExpiration);
        const accessTokenExpiresAt = new Date(Date.now() + parseDuration(configs.jwtExpiration));
        const refreshTokenExpiresAt = new Date(Date.now() + parseDuration(configs.jwtRefreshExpiration));

        return {
            id: '', // This will be set by the database
            userId: user.id,
            accessToken,
            refreshToken,
            accessTokenExpiresAt,
            refreshTokenExpiresAt,
            isRevoked: false,
            createdAt: new Date(),
            updatedAt: new Date(),
        } as Session;

    }

    public readonly jwtRegex: RegExp = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/;
}

let jwtAuth = new JwtAuth()

export { jwtAuth };
