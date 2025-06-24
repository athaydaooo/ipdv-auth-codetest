import { authUserNotFound } from "@errors/auth";
import { User } from "@prisma/client";
import { UserRepository } from "@repositories/user-repository";

interface GetUserByIdServiceResponse { user: User }
export class GetUserByIdService {
    private userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Retrieves a user by their ID or email.
     * @param identifier - The user's ID (string) or email (string).
     * @returns A promise that resolves to the user, or null if not found.
     */
    async execute(identifier: string): Promise<GetUserByIdServiceResponse> {
        let user: User | null = null;

        if (identifier.includes("@")) {
            user = await this.userRepository.getUserByEmail(identifier);
        } else {
            user = await this.userRepository.getUserById(identifier);
        }

        if(!user) { throw authUserNotFound; }

        return {user};
    }
}
