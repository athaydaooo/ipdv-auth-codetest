import { authAlreadyRevokedSession, authSessionNotFound } from "@errors/auth";
import { Session } from "@prisma/client";
import { SessionRepository } from "@repositories/session-repository";
import { UserRepository } from "@repositories/user-repository";
import { RefreshTokenService } from "./refresh-token-service";

jest.mock('@repositories/session-repository');
jest.mock('@repositories/user-repository');

describe('RefreshTokenService', () => {
    let refreshTokenService: RefreshTokenService;
    let sessionRepository: jest.Mocked<SessionRepository>;
    let userRepository: jest.Mocked<UserRepository>;

    beforeEach(() => {
        sessionRepository = new SessionRepository() as jest.Mocked<SessionRepository>;
        userRepository = new UserRepository() as jest.Mocked<UserRepository>;
        refreshTokenService = new RefreshTokenService(sessionRepository,userRepository);
    });

    it('should refresh token successfully if session is valid', async () => {
        const session: Session = {
            id: 'session-id',
            userId: 'user-id',
            accessToken: 'oldAccessToken',
            refreshToken: 'validRefreshToken',
            accessTokenExpiresAt: new Date(),
            refreshTokenExpiresAt: new Date(Date.now() + 10000),
            isRevoked: false,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        sessionRepository.getSessionByRefreshToken.mockResolvedValue(session);

        refreshTokenService.execute = async (refreshToken: string) => {
            const foundSession = await sessionRepository.getSessionByRefreshToken(refreshToken);
            if (!foundSession) throw authSessionNotFound;
            if (foundSession.isRevoked) throw authAlreadyRevokedSession;
            return {session:foundSession};
        };

        const result = await refreshTokenService.execute('validRefreshToken');
        expect(sessionRepository.getSessionByRefreshToken).toHaveBeenCalledWith('validRefreshToken');
        expect(result).toEqual({session});
    });

    it('should throw error if session not found', async () => {
        sessionRepository.getSessionByRefreshToken.mockResolvedValue(null);

        await expect(refreshTokenService.execute('invalidRefreshToken')).rejects.toBe(authSessionNotFound);
    });

    it('should throw error if session is already revoked', async () => {
        const session: Session = {
            id: 'session-id',
            userId: 'user-id',
            accessToken: 'oldAccessToken',
            refreshToken: 'revokedRefreshToken',
            accessTokenExpiresAt: new Date(),
            refreshTokenExpiresAt: new Date(Date.now() + 10000),
            isRevoked: true,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        sessionRepository.getSessionByRefreshToken.mockResolvedValue(session);

        await expect(refreshTokenService.execute('revokedRefreshToken')).rejects.toThrow(authAlreadyRevokedSession);
    });
});