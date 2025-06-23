import { authAlreadyRevokedSession, authSessionNotFound, authUserNotFound } from "@errors/auth";
import { Session } from "@prisma/client";
import { SessionRepository } from "@repositories/session-repository";
import { UserRepository } from "@repositories/user-repository";
import { jwtAuth } from "@utils/jwt";

export class RefreshTokenService {
    private sessionRepository: SessionRepository;
    private userRepository: UserRepository;

    constructor(sessionRepository: SessionRepository, userRepository: UserRepository) {
        this.sessionRepository = sessionRepository;
        this.userRepository = userRepository;
    }
    
    /**
     * Refreshes the session using the provided refresh token.
     * @param refreshToken - The refresh token to use for refreshing the session.
     * @returns A new session object.
     * @throws authSessionNotFound if the session with the provided refresh token does not exist.
     * @throws authRevokedSession if the session has been revoked.
     * @throws authUserNotFound if the user associated with the session does not exist.
     */
    async execute(refreshToken: string): Promise<Session> {

        const session = await this.sessionRepository.getSessionByRefreshToken(refreshToken);
        if (!session) { throw authSessionNotFound;}

        if(session.isRevoked) { throw authAlreadyRevokedSession; }

        const user = await this.userRepository.getUserById(session.userId);
        if (!user) { throw authUserNotFound; }

        const roles = (await this.userRepository.getRolesByUser(user.id)).map(role => role.name);
        const newSessionData = jwtAuth.generateSessionByUser(user, roles);

        const newSession = await this.sessionRepository.createSession(newSessionData);

        await this.sessionRepository.revokeSession(session.accessToken);

        return newSession;
    }
}