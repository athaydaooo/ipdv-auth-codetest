import { authInvalidCredentials } from "@errors/auth";
import { Role, Session } from "@prisma/client";
import { SessionRepository } from "@repositories/session-repository";
import { UserRepository } from "@repositories/user-repository";
import { crypto } from "@utils/crypto";
import { jwtAuth } from "@utils/jwt";
import { LoginService } from "./login-service";


jest.mock('@repositories/user-repository');
jest.mock('@repositories/session-repository');
jest.mock('@utils/crypto');
jest.mock('@utils/jwt');

describe('LoginService', () => {
    let loginService: LoginService;
    let userRepository: jest.Mocked<UserRepository>;
    let sessionRepository: jest.Mocked<SessionRepository>;
    let mockCrypto = crypto as jest.Mocked<typeof crypto>;
    let mockJwt = jwtAuth as jest.Mocked<typeof jwtAuth>;


    beforeEach(() => {
        jest.clearAllMocks();
        userRepository = new UserRepository() as jest.Mocked<UserRepository>;
        sessionRepository = new SessionRepository() as jest.Mocked<SessionRepository>;
        loginService = new LoginService(userRepository, sessionRepository);
    });

    it('should login successfully and return user and session', async () => {

        const inputPassword = 'plainPassword';
        const encryptedPassword = 'hashedPassword';
        const userRoles = [
            { id: 'role1', name: 'admin', description: null, createdAt: new Date(), updatedAt: new Date() },
            { id: 'role2', name: 'user', description: null, createdAt: new Date(), updatedAt: new Date() }
        ] as Role[];

        const mockUser = {
            id: '1',
            name: 'Test User',
            email: 'test@example.com',
            password: encryptedPassword,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            roles: userRoles
        };

        const session: Session = {
            id: 'session-id',
            userId: mockUser.id,
            accessToken: 'mockAccessToken',
            refreshToken: 'mockRefreshToken',
            accessTokenExpiresAt: new Date(),
            refreshTokenExpiresAt: new Date(),
            isRevoked: false,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        userRepository.getUserByEmail.mockResolvedValue(mockUser);
        userRepository.getRolesByUser.mockResolvedValue(userRoles);
        mockCrypto.decrypt.mockReturnValue(inputPassword);
        sessionRepository.createSession.mockResolvedValue(session);
        mockJwt.generateSessionByUser.mockReturnValue(session);
        
        const result = await loginService.execute(mockUser.email, inputPassword);

        expect(userRepository.getUserByEmail).toHaveBeenCalledWith(mockUser.email);
        expect(mockCrypto.decrypt).toHaveBeenCalledWith({"data": mockUser.password});
        expect(sessionRepository.createSession).toHaveBeenCalledWith(session);
        expect(result).toEqual({
            user: mockUser,
            session: session,
        });
    });

    it('should throw error if user not found', async () => {
        userRepository.getUserByEmail.mockResolvedValue(null);

        await expect(loginService.execute('notfound@example.com', 'anyPassword')).rejects.toThrow(authInvalidCredentials);
    });
    
    it('should throw error if invalid credentials', async () => {
        const mockUser = {
            id: '1',
            name: 'Test User',
            email: 'test@example.com',
            password: crypto.encrypt({ data: 'decryptedPassword' }),
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            roles: []
        };
        userRepository.getUserByEmail.mockResolvedValue(mockUser);
        crypto.decrypt = jest.fn().mockReturnValue('decryptedPassword');

        await expect(loginService.execute(mockUser.email, 'wrongPassword')).rejects.toThrow(authInvalidCredentials);
    });
});