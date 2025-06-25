import { Role, User } from "@prisma/client";
import { UserRepository } from "@repositories/user-repository";

interface GetUsersServiceRequest { name?: string; email?: string; isActive?: boolean; roleId?: string[] }
interface GetUsersServiceResponse { users: (User & { roles: Role[] })[] }

export class GetUsersService {
    private userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }
    /**
     * Retrieves users from the database with optional filters.
     * @param params - Filtering options: isActive, roleId, search (name or email).
     * @returns A promise that resolves to a list of users.
     */
    async execute(data: GetUsersServiceRequest): Promise<GetUsersServiceResponse> {
        const { name, email, isActive, roleId } = data;
        let users : (User & { roles: Role[] })[] = [];

        if (
            isActive === undefined &&
            !roleId &&
            !name &&
            !email
        ) {
            users = await this.userRepository.getAllUsers();
        }
        else{
            users = await this.userRepository.getUsers({
                isActive,
                roleId,
                name,
                email
            });
        }

        return { users };
    }
}