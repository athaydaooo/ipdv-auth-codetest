import { authUserNotFound } from "@errors/auth";
import { User } from "@prisma/client";
import { UserRepository } from "@repositories/user-repository";
import { crypto } from "@utils/crypto";
import { UpdatePasswordByIdService } from "./update-password-by-id-service";


jest.mock('@repositories/user-repository');
jest.mock('@utils/crypto');

describe('UpdatePasswordByIdService', () => {
    let updatePasswordByIdService: UpdatePasswordByIdService;
    let userRepository: jest.Mocked<UserRepository>;
    let mockCrypto = crypto as jest.Mocked<typeof crypto>;

    beforeEach(() => {
        jest.clearAllMocks();
        userRepository = new UserRepository() as jest.Mocked<UserRepository>;
        updatePasswordByIdService = new UpdatePasswordByIdService(userRepository);
    });

    it('should update the user password successfully', async () => {
        const userId = 'user-1';
        const plainPassword = 'newPassword';
        const hashedPassword = 'hashedPassword';
        const mockUser: User = {
            id: userId,
            name: 'Test User',
            email: 'test@example.com',
            password: 'oldHashedPassword',
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        const updatedUser: User = {
            ...mockUser,
            password: hashedPassword,
            updatedAt: new Date()
        };

        userRepository.getUserById.mockResolvedValue(mockUser);
        mockCrypto.encrypt.mockReturnValue(hashedPassword);
        userRepository.updateUser.mockResolvedValue(updatedUser);

        const result = await updatePasswordByIdService.execute(userId, plainPassword);

        expect(userRepository.getUserById).toHaveBeenCalledWith(userId);
        expect(mockCrypto.encrypt).toHaveBeenCalledWith({ data: plainPassword });
        expect(userRepository.updateUser).toHaveBeenCalledWith(userId, { password: hashedPassword });
        expect(result).toEqual(updatedUser);
    });

    it('should throw error if user not found', async () => {
        userRepository.getUserById.mockResolvedValue(null);

        await expect(updatePasswordByIdService.execute('notfound-id', 'anyPassword')).rejects.toThrow(authUserNotFound);
    });
});