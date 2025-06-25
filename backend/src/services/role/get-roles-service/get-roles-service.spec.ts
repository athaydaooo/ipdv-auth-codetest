import { Role } from "@prisma/client";
import { RoleRepository } from "@repositories/role-repository";
import { GetRolesService } from "./get-roles-service";

describe('GetRolesService', () => {
    let roleRepository: jest.Mocked<RoleRepository>;
    let getRolesService: GetRolesService;

    beforeEach(() => {
        roleRepository = {
            getRoles: jest.fn(),
            getAllRoles: jest.fn()
        } as any;
        getRolesService = new GetRolesService(roleRepository);
    });

    it('should return roles filtered by name', async () => {
        const roles: Role[] = [
            { id: '1', name: 'Admin', description: 'desc', createdAt: new Date(), updatedAt: new Date() }
        ];
        roleRepository.getRoles.mockResolvedValue(roles);

        const result = await getRolesService.execute({ name: 'Admin' });
        expect(roleRepository.getRoles).toHaveBeenCalledWith('Admin', undefined);
        expect(result).toEqual({ roles });
    });

    it('should return roles filtered by description', async () => {
        const roles: Role[] = [
            { id: '2', name: 'User', description: 'desc', createdAt: new Date(), updatedAt: new Date() }
        ];
        roleRepository.getRoles.mockResolvedValue(roles);

        const result = await getRolesService.execute({ description: 'desc' });
        expect(roleRepository.getRoles).toHaveBeenCalledWith(undefined, 'desc');
        expect(result).toEqual({ roles });
    });

});