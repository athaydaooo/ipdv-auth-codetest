import configs from "@configs/index";
import { authInvalidCredentials } from "@errors/auth";
import { parseDuration } from "@helpers/parse-duration";
import { Session, User } from "@prisma/client";
import { SessionRepository } from "@repositories/session-repository";
import { UserRepository } from "@repositories/user-repository";
import { crypto } from "@utils/crypto";
import { jwtAuth } from "@utils/jwt";
import { JwtPayload } from "../../../types/auth/jwt-payload";

interface LoginServiceResponse { user: User; session: Session }

export class LoginService {
    async execute(email: string, password: string): Promise<LoginServiceResponse> {
        const userRepository = new UserRepository();
        const sessionRepository = new SessionRepository();

        const user = await userRepository.getUserByEmail(email);
        if (!user) { throw authInvalidCredentials; }

        const decryptedPassword = await crypto.decrypt({ data: password });
        if (decryptedPassword !== password) { throw authInvalidCredentials; }

        const jwtPayload = {
            userId: user.id,
            name: user.name,
            email: user.email,
            role: [], 
        } as JwtPayload; 

        const roles = await userRepository.getRolesByUser(user.id);
        jwtPayload.role = roles.map(role => role.name);

        const sesionToken = await sessionRepository.createSession({
            userId: user.id,
            accessToken: jwtAuth.generateToken(jwtPayload),
            refreshToken: jwtAuth.generateToken(jwtPayload, configs.jwtRefreshExpiration),
            accessTokenExpiresAt: new Date(Date.now() + parseDuration(configs.jwtExpiration)),
            refreshTokenExpiresAt: new Date(Date.now() + parseDuration(configs.jwtRefreshExpiration)),
            isRevoked: false,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        return {
            user,
            session: sesionToken,
        };
    }
}