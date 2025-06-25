import { authUserNotFound } from "@errors/auth";
import { Role, User } from "@prisma/client";
import { UserRepository } from "@repositories/user-repository";
import { UpdateUserRolesByIdService } from "./update-user-roles-by-id-service";


jest.mock('@repositories/user-repository');

describe('UpdateUserRolesByIdService', () => {
    let userRepository: jest.Mocked<UserRepository>;
    let updateUserRolesByIdService: UpdateUserRolesByIdService;

    beforeEach(() => {
        jest.clearAllMocks();
        userRepository = new UserRepository() as jest.Mocked<UserRepository>;
        updateUserRolesByIdService = new UpdateUserRolesByIdService(userRepository);
    });

    it('should update user roles by linking and unlinking roles', async () => {
        const userId = 'user-1';
        const existingRoles: Role[] = [
            { id: 'role-1', name: 'admin', createdAt: new Date(), updatedAt: new Date(), description: null },
            { id: 'role-2', name: 'user', createdAt: new Date(), updatedAt: new Date(), description: null }
        ];
        const newRolesId = ['role-2', 'role-3'];

        const user: User & { roles: Role[] } = {
            id: userId,
            name: 'Test User',
            email: 'test@example.com',
            password: 'hashed',
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            roles: existingRoles
        };

        const updatedUser: User & { roles: Role[] } = { ...user, roles: newRolesId.map(id => ({ id, name: '', createdAt: new Date(), updatedAt: new Date(), description: null })) };

        userRepository.getUserById.mockResolvedValueOnce(user); // initial get
        userRepository.getRolesByUser.mockResolvedValue(existingRoles);
        userRepository.linkRole.mockResolvedValue(undefined);
        userRepository.unlinkRole.mockResolvedValue(undefined);
        userRepository.getUserById.mockResolvedValueOnce(updatedUser); // after update

        await expect(updateUserRolesByIdService.execute(userId, newRolesId)).resolves.toEqual({user: updatedUser});

        expect(userRepository.getUserById).toHaveBeenCalledWith(userId);
        expect(userRepository.getRolesByUser).toHaveBeenCalledWith(userId);
        expect(userRepository.linkRole).toHaveBeenCalledWith(userId, 'role-3');
        expect(userRepository.unlinkRole).toHaveBeenCalledWith(userId, 'role-1');
        expect(userRepository.getUserById).toHaveBeenCalledTimes(2);
    });

    it('should not link or unlink if roles are the same', async () => {
        const userId = 'user-2';
        const roles: Role[] = [
            { id: 'role-1', name: 'admin', createdAt: new Date(), updatedAt: new Date(), description: null }
        ];
        const rolesId = ['role-1'];
        const user: User & { roles: Role[] } = {
            id: userId,
            name: 'Test User',
            email: 'test@example.com',
            password: 'hashed',
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            roles
        };

        userRepository.getUserById.mockResolvedValueOnce(user);
        userRepository.getRolesByUser.mockResolvedValue(roles);
        userRepository.getUserById.mockResolvedValueOnce(user);

        await expect(updateUserRolesByIdService.execute(userId, rolesId)).resolves.toEqual({user});

        expect(userRepository.linkRole).not.toHaveBeenCalled();
        expect(userRepository.unlinkRole).not.toHaveBeenCalled();
        expect(userRepository.unlinkRole).not.toHaveBeenCalled();
    });

    it('should throw error if user not found at start', async () => {
        userRepository.getUserById.mockResolvedValue(null);

        await expect(updateUserRolesByIdService.execute('not-exist', ['role-1']))
            .rejects.toBe(authUserNotFound);
    });

    it('should throw error if user not found after update', async () => {
        const userId = 'user-3';
        const roles: Role[] = [];
        const user: User & { roles: Role[] } = {
            id: userId,
            name: 'Test User',
            email: 'test@example.com',
            password: 'hashed',
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            roles
        };

        userRepository.getUserById.mockResolvedValueOnce(user);
        userRepository.getRolesByUser.mockResolvedValue(roles);
        userRepository.getUserById.mockResolvedValueOnce(null);

        await expect(updateUserRolesByIdService.execute(userId, roles.map(r => r.id)))
            .rejects.toBe(authUserNotFound);
        await expect(updateUserRolesByIdService.execute(userId, roles.map(r => r.id)))
            .rejects.toBe(authUserNotFound);
    });
});