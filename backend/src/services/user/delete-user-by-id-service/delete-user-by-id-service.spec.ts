import { authUserNotFound } from "@errors/auth";
import { User } from "@prisma/client";
import { UserRepository } from "@repositories/user-repository";
import { DeleteUserByIdService } from "./delete-user-by-id-service";


jest.mock('@repositories/user-repository');

describe('DeleteUserByIdService', () => {
    let deleteUserByIdService: DeleteUserByIdService;
    let userRepository: jest.Mocked<UserRepository>;

    beforeEach(() => {
        jest.clearAllMocks();
        userRepository = new UserRepository() as jest.Mocked<UserRepository>;
        deleteUserByIdService = new DeleteUserByIdService(userRepository);
    });

    it('should delete (inactivate) user successfully', async () => {
        const userId = 'user-1';
        const mockUser: User = {
            id: userId,
            name: 'Test User',
            email: 'test@example.com',
            password: 'hashedPassword',
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        const updatedUser: User = { ...mockUser, isActive: false };

        userRepository.getUserById.mockResolvedValue(mockUser);
        userRepository.updateUser.mockResolvedValue(updatedUser);

        const result = await deleteUserByIdService.execute(userId);

        expect(userRepository.getUserById).toHaveBeenCalledWith(userId);
        expect(userRepository.updateUser).toHaveBeenCalledWith(userId, { isActive: false });
        expect(result).toEqual({user: updatedUser });
    });

    it('should throw error if user not found', async () => {
        userRepository.getUserById.mockResolvedValue(null);

        await expect(deleteUserByIdService.execute('non-existent-id')).rejects.toThrow(authUserNotFound);
        expect(userRepository.getUserById).toHaveBeenCalledWith('non-existent-id');
        expect(userRepository.updateUser).not.toHaveBeenCalled();
    });
});