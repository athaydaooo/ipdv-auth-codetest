import { authUserNotFound } from "@errors/auth";
import { User } from "@prisma/client";
import { UserRepository } from "@repositories/user-repository";

export class DeleteUserByIdService {
    private userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Deletes (inactivates) a user by their ID.
     * @param userId - The ID of the user to be deleted.
     * @returns A promise that resolves to the updated user.
     * @throws Error if the user does not exist.
     */
    async execute(userId: string): Promise<User> {
        const user = await this.userRepository.getUserById(userId);
        if (!user) { throw authUserNotFound; }

        const updatedUser = await this.userRepository.updateUser(userId, { isActive: false });

        return updatedUser;
    }
}