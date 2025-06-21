import { Session } from "@prisma/client";
import { SessionRepository } from "@repositories/session-repository";
import { UserRepository } from "@repositories/user-repository";
import { crypto } from "@utils/crypto";
import { authInvalidToken, authUserNotFound } from "src/errors/auth";
import { LoginService } from "./login-service";


jest.mock('@repositories/user-repository');
jest.mock('@repositories/session-repository');
jest.mock('@utils/crypto');

describe('LoginService', () => {
    let loginService: LoginService;
    let userRepository: jest.Mocked<UserRepository>;
    let sessionRepository: jest.Mocked<SessionRepository>;

    beforeEach(() => {
        userRepository = new UserRepository() as jest.Mocked<UserRepository>;
        sessionRepository = new SessionRepository() as jest.Mocked<SessionRepository>;
        loginService = new LoginService();
    });

    it('should login successfully and return user and session', async () => {
        const mockUser = {
            id: '1',
            name: 'Test User',
            email: 'test@example.com',
            password: 'hashedPassword',
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        const inputPassword = 'plainPassword';
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

        // Simulate password decryption and comparison
        crypto.decrypt = jest.fn().mockReturnValue(inputPassword);

        sessionRepository.createSession.mockResolvedValue(session);
        const result = await loginService.execute(mockUser.email, inputPassword);

        expect(userRepository.getUserByEmail).toHaveBeenCalledWith(mockUser.email);
        expect(crypto.decrypt).toHaveBeenCalledWith(mockUser.password);
        const { id, ...mockUserWithoutId } = mockUser;
        expect(sessionRepository.createSession).toHaveBeenCalledWith(mockUserWithoutId);
        expect(result).toEqual({
            user: mockUser,
            session: session,
        });
    });

    it('should throw error if user not found', async () => {
        userRepository.getUserByEmail.mockResolvedValue(null);

        await expect(loginService.execute('notfound@example.com', 'anyPassword')).rejects.toThrow(authUserNotFound);
    });
    
    it('should throw error if invalid credentials', async () => {
        const mockUser = {
            id: '1',
            name: 'Test User',
            email: 'test@example.com',
            password: crypto.encrypt({ data: 'decryptedPassword' }),
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        userRepository.getUserByEmail.mockResolvedValue(mockUser);
        crypto.decrypt = jest.fn().mockReturnValue('decryptedPassword');

        await expect(loginService.execute(mockUser.email, 'wrongPassword')).rejects.toThrow(authInvalidToken);
    });
});