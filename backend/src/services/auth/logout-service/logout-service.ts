import { authAlreadyRevokedSession, authSessionNotFound } from "@errors/auth";
import { SessionRepository } from "@repositories/session-repository";

export class LogoutService {
    private sessionRepository: SessionRepository;

    constructor(sessionRepository: SessionRepository) {
        this.sessionRepository = sessionRepository;
    }
    
    /**
     * Logs out the user by revoking their session using the provided access token.
     * @param accessToken - The access token of the session to be revoked.
     * @throws authSessionNotFound if the session with the provided access token does not exist.
     */
    async execute(accessToken: string): Promise<void> {
        const session = await this.sessionRepository.getSessionByAccessToken(accessToken);
        if (!session) { throw authSessionNotFound; }

        if (session.isRevoked) { throw authAlreadyRevokedSession;}

        await this.sessionRepository.revokeSession(accessToken);
    }
}