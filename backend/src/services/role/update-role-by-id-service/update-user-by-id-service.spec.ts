import { roleNotFound } from "@errors/role";
import { userNotEnoughtParameters } from "@errors/user";
import { Role } from "@prisma/client";
import { RoleRepository } from "@repositories/role-repository";
import { UpdateRoleByIdService } from "./update-user-by-id-service";

describe('UpdateRoleByIdService', () => {
    let roleRepository: jest.Mocked<RoleRepository>;
    let updateRoleByIdService: UpdateRoleByIdService;

    beforeEach(() => {
        roleRepository = {
            getRoleById: jest.fn(),
            updateRole: jest.fn(),
        } as any;
        updateRoleByIdService = new UpdateRoleByIdService(roleRepository);
    });

    it('should update a role by id', async () => {
        const updatedRole: Role = {
            id: '4',
            name: 'Updated',
            description: 'Updated desc',
            createdAt: new Date(),
            updatedAt: new Date()
        };
        roleRepository.getRoleById.mockResolvedValue(updatedRole);
        roleRepository.updateRole.mockResolvedValue(updatedRole);

        const result = await updateRoleByIdService.execute('4', 'Updated', 'Updated desc');
        expect(roleRepository.getRoleById).toHaveBeenCalledWith('4');
        expect(roleRepository.updateRole).toHaveBeenCalledWith('4', { name: 'Updated', description: 'Updated desc' });
        expect(result).toEqual({ role: updatedRole });
    });

    it('should throw error if not enough parameters', async () => {
        await expect(updateRoleByIdService.execute('4')).rejects.toBe(userNotEnoughtParameters);
    });

    it('should throw error if role not found', async () => {
        roleRepository.getRoleById.mockResolvedValue(null);

        await expect(updateRoleByIdService.execute('not-found', 'Name')).rejects.toBe(roleNotFound);
    });
});