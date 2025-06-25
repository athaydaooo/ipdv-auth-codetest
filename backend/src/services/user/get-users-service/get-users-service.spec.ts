import { UserRepository } from "@repositories/user-repository";
import { GetUsersService } from "./get-users-service";

jest.mock('@repositories/user-repository');

describe('GetUsersService', () => {
    let getUsersService: GetUsersService;
    let userRepository: jest.Mocked<UserRepository>;

    beforeEach(() => {
        jest.clearAllMocks();
        userRepository = new UserRepository() as jest.Mocked<UserRepository>;
        getUsersService = new GetUsersService(userRepository);
    });

    it('should return users with given filters', async () => {
        const mockUsers = [
            {
                id: '1',
                name: 'Alice',
                email: 'alice@example.com',
                password: 'hashed',
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
                roles: [
                    {
                        id: 'role1',
                        name: 'admin',
                        description: null,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    }
                ]
            },
            {
                id: '2',
                name: 'Bob',
                email: 'bob@example.com',
                password: 'hashed',
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
                roles: [
                    {
                        id: 'role2',
                        name: 'user',
                        description: null,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    }
                ]
            }
        ];

        userRepository.getUsers.mockResolvedValue(mockUsers);

        const result = await getUsersService.execute({
            name: 'Alice',
            email: 'alice@example.com',
            isActive: true,
            roleId: ['role1']
        });

        expect(userRepository.getUsers).toHaveBeenCalledWith({
            isActive: true,
            roleId: ['role1'],
            name: 'Alice',
            email: 'alice@example.com'
        });
        expect(result).toEqual({users: mockUsers});
    });

    it('should return empty array if no users found', async () => {
        userRepository.getUsers.mockResolvedValue([]);

        const result = await getUsersService.execute({
            name: '',
            email: '',
            isActive: true,
            roleId: []
        });

        expect(userRepository.getUsers).toHaveBeenCalledWith({
            isActive: true,
            roleId: [],
            name: '',
            email: ''
        });
        expect(result).toEqual({users: []});
    });

    it('should propagate errors from repository', async () => {
        userRepository.getUsers.mockRejectedValue(new Error('DB error'));

        await expect(
            getUsersService.execute({
                name: 'Test',
                email: 'test@example.com',
                isActive: false,
                roleId: ['role2']
            })
        ).rejects.toThrow('DB error');
    });
});