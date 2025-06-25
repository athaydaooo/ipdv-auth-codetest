import { authUserNotFound } from "@errors/auth";
import { userNotEnoughtParameters } from "@errors/user";
import { Role, User } from "@prisma/client";
import { UserRepository } from "@repositories/user-repository";
import { UpdateUserByIdService } from "./update-user-by-id-service";


jest.mock('@repositories/user-repository');

describe('UpdateUserByIdService', () => {
    let updateUserByIdService: UpdateUserByIdService;
    let userRepository: jest.Mocked<UserRepository>;

    beforeEach(() => {
        jest.clearAllMocks();
        userRepository = new UserRepository() as jest.Mocked<UserRepository>;
        updateUserByIdService = new UpdateUserByIdService(userRepository);
    });

    it('should update user name successfully', async () => {
        const userId = 'user-1';
        const mockUser: User & { roles: Role[] } = {
            id: userId,
            name: 'Old Name',
            email: 'old@example.com',
            isActive: true,
            password: 'hashed',
            createdAt: new Date(),
            updatedAt: new Date(),
            roles: []
        };
        const updatedUser: User & { roles: Role[] } = {
            ...mockUser,
            name: 'New Name',
            updatedAt: new Date()
        };

        userRepository.getUserById.mockResolvedValue(mockUser);
        userRepository.updateUser.mockResolvedValue(updatedUser);

        const result = await updateUserByIdService.execute({ id: userId, name: 'New Name' });

        expect(userRepository.getUserById).toHaveBeenCalledWith(userId);
        expect(userRepository.updateUser).toHaveBeenCalledWith(userId, expect.objectContaining({ name: 'New Name' }));
        expect(result).toEqual({user: updatedUser});
    });

    it('should update user email and isActive successfully', async () => {
        const userId = 'user-2';
        const mockUser: User & { roles: Role[] } = {
            id: userId,
            name: 'User',
            email: 'old@example.com',
            isActive: false,
            password: 'hashed',
            createdAt: new Date(),
            updatedAt: new Date(),
            roles: []
        };
        const updatedUser: User & { roles: Role[] } = {
            ...mockUser,
            email: 'new@example.com',
            isActive: true,
            updatedAt: new Date()
        };

        userRepository.getUserById.mockResolvedValue(mockUser);
        userRepository.updateUser.mockResolvedValue(updatedUser);

        const result = await updateUserByIdService.execute({ id: userId, email: 'new@example.com', isActive: true });

        expect(userRepository.getUserById).toHaveBeenCalledWith(userId);
        expect(userRepository.updateUser).toHaveBeenCalledWith(userId, expect.objectContaining({ email: 'new@example.com', isActive: true }));
        expect(result).toEqual({user: updatedUser});
    });

    it('should throw error if no update parameters are provided', async () => {
        await expect(updateUserByIdService.execute({ id: 'user-3' }))
            .rejects.toBe(userNotEnoughtParameters);
    });

    it('should throw error if user not found', async () => {
        userRepository.getUserById.mockResolvedValue(null);

        await expect(updateUserByIdService.execute({ id: 'user-4', name: 'Any' }))
            .rejects.toBe(authUserNotFound);
    });
});