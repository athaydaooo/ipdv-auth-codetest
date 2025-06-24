import { authUserNotFound } from "@errors/auth";
import { User } from "@prisma/client";
import { UserRepository } from "@repositories/user-repository";
import { crypto } from "@utils/crypto";

interface UpdatePasswordByIdServiceResponse{ user:User }

export class UpdatePasswordByIdService {
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
    async execute(id: string, password:string): Promise<UpdatePasswordByIdServiceResponse> {
        const user = await this.userRepository.getUserById(id);
        if (!user) { throw authUserNotFound;}

        const hashedPassword = crypto.encrypt({data: password});

        const updatedUser = await this.userRepository.updateUser(id, {
            password: hashedPassword,
        })

        return {user: updatedUser};
    }
}