import { authUserNotFound } from "@errors/auth";
import { UserRepository } from "@repositories/user-repository";
import { GetUserByIdService } from "./get-user-by-id-service";

jest.mock('@repositories/user-repository');

describe('GetUserByIdService', () => {
    let userRepository: jest.Mocked<UserRepository>;
    let getUserByIdService: GetUserByIdService;

    beforeEach(() => {
        jest.clearAllMocks();
        userRepository = new UserRepository() as jest.Mocked<UserRepository>;
        getUserByIdService = new GetUserByIdService(userRepository);
    });

    it('should return user when found by id', async () => {
        const mockUser = {
            id: '1',
            name: 'Test User',
            email: 'test@example.com',
            password: 'hashedPassword',
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        userRepository.getUserById.mockResolvedValue(mockUser);

        const result = await getUserByIdService.execute('1');

        expect(userRepository.getUserById).toHaveBeenCalledWith('1');
        expect(result).toEqual({user:mockUser});
    });

    it('should return null if user not found', async () => {
        userRepository.getUserById.mockResolvedValue(null);
        
        await expect(getUserByIdService.execute('notfound-id')).rejects.toThrow(authUserNotFound);
        expect(userRepository.getUserById).toHaveBeenCalledWith('notfound-id');
    });

});