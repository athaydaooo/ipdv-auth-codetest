import { roleNameAlreadyExists } from "@errors/role";
import { Role } from "@prisma/client";
import { RoleRepository } from "@repositories/role-repository";

interface PostRoleServiceResponse { role: Role }
export class PostRoleService {
    private roleRepository: RoleRepository;

    constructor(roleRepository: RoleRepository) {
        this.roleRepository = roleRepository;
    }

    /**
     * Cria uma nova função.
     * @param name - Nome da função.
     * @param description - Descrição da função.
     */
    async execute(name: string, description: string): Promise<PostRoleServiceResponse> {
        const roles = await this.roleRepository.GetRoleByName(name);

        if( roles ) { throw roleNameAlreadyExists;}

        const now = new Date();
        const role = await this.roleRepository.createRole({
            name,
            description,
            createdAt: now,
            updatedAt: now
        });
        return { role };
    }
}