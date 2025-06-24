import { authUserNotFound } from "@errors/auth";
import { userNotEnoughtParameters } from "@errors/user";
import { User } from "@prisma/client";
import { UserRepository } from "@repositories/user-repository";

interface UpdateUserByIdServiceRequest {
    id: string;
    name?: string;
    email?: string;
    isActive?: boolean;
}

interface UpdateUserByIdServiceResponse {user:User}
export class UpdateUserByIdService {
    private userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Updates a user by ID with the provided fields.
     * At least one of name, email, or isActive must be provided.
     * @param data - The update parameters.
     * @returns The updated user.
     * @throws userNotFound if the user does not exist.
     */
    async execute(data: UpdateUserByIdServiceRequest): Promise<UpdateUserByIdServiceResponse> {
        const { id, name, email, isActive } = data;

        if (name === undefined && email === undefined && isActive === undefined) {
            throw userNotEnoughtParameters;
        }

        const user = await this.userRepository.getUserById(id);
        if (!user) {
            throw authUserNotFound;
        }

        const updatedUser = await this.userRepository.updateUser(id, {
            ...(name !== undefined && { name }),
            ...(email !== undefined && { email }),
            ...(isActive !== undefined && { isActive }),
            updatedAt: new Date(),
        });

        return { user: updatedUser };
    }
}