import { roleNotFound } from "@errors/role";
import { userNotEnoughtParameters } from "@errors/user";
import { Role } from "@prisma/client";
import { RoleRepository } from "@repositories/role-repository";

interface UpdateRoleByIdServiceResponse { role: Role }

export class UpdateRoleByIdService {
    private roleRepository: RoleRepository;

    constructor(roleRepository: RoleRepository) {
        this.roleRepository = roleRepository;
    }

    /**
     * Atualiza os dados de uma função existente.
     * @param id - Identificador da função.
     * @param name - Novo nome da função (opcional).
     * @param description - Nova descrição da função (opcional).
     */
    async execute(id: string, name?: string, description?: string): Promise<UpdateRoleByIdServiceResponse | null> {
        if(!name && !description) throw userNotEnoughtParameters;

        const roleExists = await this.roleRepository.getRoleById(id);
        if (!roleExists) throw roleNotFound;

        const role = await this.roleRepository.updateRole(id, { name, description });
        return { role };
    }
}