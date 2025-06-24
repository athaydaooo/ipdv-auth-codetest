import { roleNotFound } from "@errors/role";
import { Role } from "@prisma/client";
import { RoleRepository } from "@repositories/role-repository";
import { UpdateRoleModuleByIdService } from "./update-role-module-by-id-service";

describe('UpdateRoleModuleByIdService', () => {
    let roleRepository: jest.Mocked<RoleRepository>;
    let updateRoleModuleByIdService: UpdateRoleModuleByIdService;

    beforeEach(() => {
        roleRepository = {
            getRoleById: jest.fn(),
            getModulesByRole: jest.fn(),
            linkModule: jest.fn(),
            unlinkModule: jest.fn(),
        } as any;
        updateRoleModuleByIdService = new UpdateRoleModuleByIdService(roleRepository);
    });

    it('should update modules of a role', async () => {
        const role: Role = {
            id: '5',
            name: 'Role',
            description: 'desc',
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        const modules = [{
            id: 'module-1',
            name: 'Module 1',
            description: null,
            createdAt: new Date(),
            updatedAt: new Date()
        }];
        const updatedRole: Role = { ...role };

        roleRepository.getRoleById.mockResolvedValueOnce(role); // initial getRoleById
        roleRepository.getModulesByRole.mockResolvedValueOnce(modules);
        roleRepository.linkModule.mockResolvedValue(undefined);
        roleRepository.unlinkModule.mockResolvedValue(undefined);
        roleRepository.getRoleById.mockResolvedValueOnce(updatedRole); // after update

        const result = await updateRoleModuleByIdService.execute('5', ['module-2']);

        expect(roleRepository.getRoleById).toHaveBeenCalledWith('5');
        expect(roleRepository.getModulesByRole).toHaveBeenCalledWith('5');
        expect(roleRepository.linkModule).toHaveBeenCalledWith('5', 'module-2');
        expect(roleRepository.unlinkModule).toHaveBeenCalledWith('5', 'module-1');
        expect(result).toEqual(updatedRole);
    });

    it('should throw error if role not found', async () => {
        roleRepository.getRoleById.mockResolvedValue(null);

        await expect(updateRoleModuleByIdService.execute('not-found', ['module-2'])).rejects.toBe(roleNotFound);
    });

    it('should throw error if role is deleted after update', async () => {
        const role: Role = {
            id: '5',
            name: 'Role',
            description: 'desc',
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        const modules = [{
            id: 'module-1',
            name: 'Module 1',
            description: null,
            createdAt: new Date(),
            updatedAt: new Date()
        }];

        roleRepository.getRoleById.mockResolvedValueOnce(role); // initial getRoleById
        roleRepository.getModulesByRole.mockResolvedValueOnce(modules);
        roleRepository.linkModule.mockResolvedValue(undefined);
        roleRepository.unlinkModule.mockResolvedValue(undefined);
        roleRepository.getRoleById.mockResolvedValueOnce(null); // after update

        await expect(updateRoleModuleByIdService.execute('5', ['module-2'])).rejects.toBe(roleNotFound);
    });
});