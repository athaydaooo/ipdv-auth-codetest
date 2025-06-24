import { userNotEnoughtParameters } from "@errors/user";
import { Role } from "@prisma/client";
import { RoleRepository } from "@repositories/role-repository";

interface GetRolesServiceResponse { roles: Role[] }
interface GetRolesServiceRequest { name?: string, description?: string }

export class GetRolesService {
    private roleRepository: RoleRepository;

    constructor(roleRepository: RoleRepository) {
        this.roleRepository = roleRepository;
    }

    /**
     * Retorna uma lista de todas as funções cadastradas, com busca opcional.
     * @param search - Termo para filtrar funções pelo nome ou descrição.
     */
    async execute(data: GetRolesServiceRequest): Promise<GetRolesServiceResponse> {
        if (!data || (data.name === undefined && data.description === undefined)) {
            throw userNotEnoughtParameters;
        }
        
        const roles = await this.roleRepository.getRoles(data.name, data.description);
        return { roles };
    }
}