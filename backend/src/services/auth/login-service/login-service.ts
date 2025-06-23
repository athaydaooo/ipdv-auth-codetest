import { authInvalidCredentials } from "@errors/auth";
import { Session, User } from "@prisma/client";
import { SessionRepository } from "@repositories/session-repository";
import { UserRepository } from "@repositories/user-repository";
import { crypto } from "@utils/crypto";
import { jwtAuth } from "@utils/jwt";

interface LoginServiceResponse { user: User; session: Session }

export class LoginService {
    private userRepository: UserRepository;
    private sessionRepository: SessionRepository;

    constructor(userRepository: UserRepository, sessionRepository: SessionRepository) {
        this.userRepository = userRepository;
        this.sessionRepository = sessionRepository;
    }

    /**
     * Logs in a user by validating their email and password, and creating a session.
     * @param email - The user's email address.
     * @param password - The user's password.
     * @returns A promise that resolves to an object containing the user and session information.
     * @throws authInvalidCredentials if the email or password is incorrect.
     */
    async execute(email: string, password: string): Promise<LoginServiceResponse> {
        const user = await this.userRepository.getUserByEmail(email);
        if (!user) { throw authInvalidCredentials; }

        const decryptedPassword = crypto.decrypt({ data: user.password });
        if (password !== decryptedPassword) 
         throw authInvalidCredentials;

        const roles = (await this.userRepository.getRolesByUser(user.id)).map(role => role.name);
        const sessionData = jwtAuth.generateSessionByUser(user, roles);

        const session = await this.sessionRepository.createSession(sessionData);

        return {
            user,
            session,
        };
    }
}