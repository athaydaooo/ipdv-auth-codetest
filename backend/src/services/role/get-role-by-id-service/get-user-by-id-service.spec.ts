import { roleNotFound } from '@errors/role';
import { Module, Role } from "@prisma/client";
import { RoleRepository } from "@repositories/role-repository";
import { GetRoleByIdService } from "./get-user-by-id-service";


jest.mock('@repositories/role-repository');

describe('GetRoleByIdService', () => {
    let roleRepository: jest.Mocked<RoleRepository>;
    let getRoleByIdService: GetRoleByIdService;

    beforeEach(() => {
        jest.clearAllMocks();
        roleRepository = new RoleRepository() as jest.Mocked<RoleRepository>;
        getRoleByIdService = new GetRoleByIdService(roleRepository);
    });

    it('should return a role with modules by id', async () => {
        const role: Role & { modules: Module[] } = {
            id: 'role-id',
            name: 'Admin',
            description: 'Admin role',
            createdAt: new Date(),
            updatedAt: new Date(),
            modules: [{ id: 'module-1', name: 'Module 1', createdAt: new Date(), description: "module desc", updatedAt: new Date() } as Module]
        };
        roleRepository.getRoleWithModulesById.mockResolvedValue(role);

        const result = await getRoleByIdService.execute('role-id');
        expect(roleRepository.getRoleWithModulesById).toHaveBeenCalledWith('role-id');
            expect(result).toEqual({role});
    });

    it('should throw error if role not found', async () => {

        await expect(getRoleByIdService.execute('role-id')).rejects.toThrow(roleNotFound);
    });
});

