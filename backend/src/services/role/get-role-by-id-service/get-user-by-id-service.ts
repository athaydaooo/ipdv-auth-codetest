import { roleNotFound } from "@errors/role";
import { Module, Role } from "@prisma/client";
import { RoleRepository } from "@repositories/role-repository";

interface GetRoleByIdServiceResponse { role: Role & { modules: Module[] } }
export class GetRoleByIdService {
    private roleRepository: RoleRepository;

    constructor(roleRepository: RoleRepository) {
        this.roleRepository = roleRepository;
    }

    /**
     * Retorna uma função específica, incluindo os módulos associados.
     * @param id - Identificador da função.
     */
    async execute(id: string): Promise<GetRoleByIdServiceResponse> {
        const role = await this.roleRepository.getRoleWithModulesById(id);
        if (!role) throw roleNotFound;
        
        return { role };
    }
}





