import { userAlreadyExists } from "@errors/user";
import { Role, User } from "@prisma/client";
import { RoleRepository } from "@repositories/role-repository";
import { UserRepository } from "@repositories/user-repository";
import { crypto } from "@utils/crypto";


interface PostUserServiceRequest {
    name: string;
    email: string;
    password: string;
    roleIds: string[];
}

interface PostUserServiceResponse {
    user: User & { roles: Role[] };
}

export class PostUserService {
    private userRepository: UserRepository;
    private roleRepository: RoleRepository;

    constructor(userRepository: UserRepository, roleRepository: RoleRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }

    /**
     * Creates a new user with the given data and associates roles.
     * @param data - The user creation data.
     * @returns The created user with roles.
     * @throws userAlreadyExists if the email is already registered.
     */
    async execute(data: PostUserServiceRequest): Promise<PostUserServiceResponse> {
        const existingUser = await this.userRepository.getUserByEmail(data.email);
        if (existingUser) { throw userAlreadyExists;}

        const encryptedPassword = crypto.encrypt({ data: data.password });

        const user = await this.userRepository.createUser({
            name: data.name,
            email: data.email,
            password: encryptedPassword,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        for (const roleId of data.roleIds) {
            await this.userRepository.linkRole(user.id, roleId);
        }
        
        const roles = await this.userRepository.getRolesByUser(user.id);

        return {
            user: {
                ...user,
                roles,
            },
        };
    }
}