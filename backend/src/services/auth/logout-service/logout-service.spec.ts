import { Session } from "@prisma/client";
import { SessionRepository } from "@repositories/session-repository";
import { authAlreadyRevokedSession, authSessionNotFound } from "src/errors/auth";
import { LogoutService } from "./logout-service";

jest.mock('@repositories/session-repository');

describe('LogoutService', () => {
    let logoutService: LogoutService;
    let sessionRepository: jest.Mocked<SessionRepository>;

    beforeEach(() => {
        sessionRepository = new SessionRepository() as jest.Mocked<SessionRepository>;
        logoutService = new LogoutService();
    });

    it('should logout successfully and revoke session', async () => {
        const session: Session = {
            id: 'session-id',
            userId: 'user-id',
            accessToken: 'mockAccessToken',
            refreshToken: 'mockRefreshToken',
            accessTokenExpiresAt: new Date(),
            refreshTokenExpiresAt: new Date(),
            isRevoked: false,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        sessionRepository.getSessionByAccessToken.mockResolvedValue(session);

        const result = await logoutService.execute('mockAccessToken');

        expect(sessionRepository.getSessionByAccessToken).toHaveBeenCalledWith('mockAccessToken');
        expect(sessionRepository.revokeSession).toHaveBeenCalledWith(session.accessToken);
        expect(result).toBeUndefined();
    });

    it('should throw error if session not found', async () => {
        sessionRepository.getSessionByAccessToken.mockResolvedValue(null);

        await expect(logoutService.execute('invalidToken')).rejects.toThrow(authSessionNotFound);
    });

    it('should throw error if session is already revoked', async () => {
        const session: Session = {
            id: 'session-id',
            userId: 'user-id',
            accessToken: 'mockAccessToken',
            refreshToken: 'mockRefreshToken',
            accessTokenExpiresAt: new Date(),
            refreshTokenExpiresAt: new Date(),
            isRevoked: true,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        sessionRepository.getSessionByAccessToken.mockResolvedValue(session);

        await expect(logoutService.execute('mockAccessToken')).rejects.toThrow(authAlreadyRevokedSession);
    });
    
});
