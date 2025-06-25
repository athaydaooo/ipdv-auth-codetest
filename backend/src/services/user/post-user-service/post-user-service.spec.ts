import { userAlreadyExists } from "@errors/user";
import { Role, User } from "@prisma/client";
import { UserRepository } from "@repositories/user-repository";
import { crypto } from "@utils/crypto";
import { PostUserService } from "./post-user-service";


jest.mock('@repositories/user-repository');
jest.mock('@utils/crypto');

describe('PostUserService', () => {
    let postUserService: PostUserService;
    let userRepository: jest.Mocked<UserRepository>;
    let mockCrypto = crypto as jest.Mocked<typeof crypto>;

    beforeEach(() => {
        jest.clearAllMocks();
        userRepository = new UserRepository() as jest.Mocked<UserRepository>;
        postUserService = new PostUserService(userRepository);
    });

    it('should create a new user and link roles', async () => {
        const request = {
            name: 'John Doe',
            email: 'john@example.com',
            password: 'plainPassword',
            roleIds: ['role-1', 'role-2'],
        };
        const encryptedPassword = 'encryptedPassword';
        const createdUser: User = {
            id: 'user-1',
            name: request.name,
            email: request.email,
            password: encryptedPassword,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        const roles: Role[] = [
            { id: 'role-1', name: 'admin', description: '', createdAt: new Date(), updatedAt: new Date() },
            { id: 'role-2', name: 'user', description: '', createdAt: new Date(), updatedAt: new Date() },
        ];

        userRepository.getUserByEmail.mockResolvedValue(null);
        mockCrypto.encrypt.mockReturnValue(encryptedPassword);
        userRepository.createUser.mockResolvedValue(createdUser);
        userRepository.linkRole.mockResolvedValue(undefined);
        userRepository.getRolesByUser.mockResolvedValue(roles);

        const result = await postUserService.execute(request);

        expect(userRepository.getUserByEmail).toHaveBeenCalledWith(request.email);
        expect(mockCrypto.encrypt).toHaveBeenCalledWith({ data: request.password });
        expect(userRepository.createUser).toHaveBeenCalledWith(expect.objectContaining({
            name: request.name,
            email: request.email,
            password: encryptedPassword,
            isActive: true,
        }));
        expect(userRepository.linkRole).toHaveBeenCalledTimes(2);
        expect(userRepository.linkRole).toHaveBeenCalledWith(createdUser.id, 'role-1');
        expect(userRepository.linkRole).toHaveBeenCalledWith(createdUser.id, 'role-2');
        expect(userRepository.getRolesByUser).toHaveBeenCalledWith(createdUser.id);
        expect(result).toEqual({
            user: {
                ...createdUser,
                roles,
            },
        });
    });

    it('should throw userAlreadyExists if email is already registered', async () => {
        const request = {
            name: 'Jane Doe',
            email: 'jane@example.com',
            password: 'password',
            roleIds: [],
        };
        userRepository.getUserByEmail.mockResolvedValue({
            id: 'user-1',
            name: request.name,
            email: request.email,
            password: request.password,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            roles: []
        });

        await expect(postUserService.execute(request)).rejects.toBe(userAlreadyExists);
    });
});