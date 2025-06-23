import { authUserNotFound } from "@errors/auth";
import { User } from "@prisma/client";
import { UserRepository } from "@repositories/user-repository";

export class UpdateUserRolesByIdService {
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
    async execute(id: string, rolesId: string[]): Promise<User> {
        const user = await this.userRepository.getUserById(id);
        if (!user) { throw authUserNotFound;}

        const roles = await this.userRepository.getRolesByUser(id);

        // Filtra roles a serem adicionadas (presentes em rolesId mas não em roles)
        const rolesToLink = rolesId
            .filter(roleId => !roles.some(role => role.id === roleId))
            .map(roleId => ({ id: roleId }));

        // Filtra roles a serem removidas (presentes em roles mas não em rolesId)
        const rolesToUnlink = roles
            .filter(role => !rolesId.includes(role.id));

        for (const roleToLink of rolesToLink) {
            await this.userRepository.linkRole(id, roleToLink.id);
        }

        for (const roleToUnlink of rolesToUnlink) {
            await this.userRepository.unlinkRole(id, roleToUnlink.id);
        }

        const updatedUser = await this.userRepository.getUserById(id);
        if (!updatedUser) { throw authUserNotFound;}
        
        return updatedUser;
    }
}