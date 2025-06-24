import { roleNameAlreadyExists } from '@errors/role';
import { Role } from '@prisma/client';
import { RoleRepository } from '@repositories/role-repository';
import { PostRoleService } from './post-role-service';

describe('PostRoleService', () => {
    let roleRepository: jest.Mocked<RoleRepository>;
    let postRoleService: PostRoleService;

    beforeEach(() => {
        roleRepository = {
            GetRoleByName: jest.fn(),
            createRole: jest.fn(),
        } as any;
        postRoleService = new PostRoleService(roleRepository);
    });

    it('should create a new role', async () => {
        const name = 'Manager';
        const description = 'desc';
        const createdRole: Role = {
            id: '3',
            name,
            description,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        roleRepository.GetRoleByName.mockResolvedValue(null);
        roleRepository.createRole.mockResolvedValue(createdRole);

        const result = await postRoleService.execute(name, description);

        expect(roleRepository.GetRoleByName).toHaveBeenCalledWith(name);
        expect(roleRepository.createRole).toHaveBeenCalledWith({
            name,
            description,
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date)
        });
        expect(result).toEqual({ role: createdRole });
    });

    it('should throw error if role name already exists', async () => {
        const name = 'Manager';
        const description = 'desc';
        roleRepository.GetRoleByName.mockResolvedValue({ id: '1', name, description, createdAt: new Date(), updatedAt: new Date() });

        await expect(postRoleService.execute(name, description)).rejects.toBe(roleNameAlreadyExists);
    });
});
