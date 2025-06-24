import { roleNotFound } from "@errors/role";
import { Role } from "@prisma/client";
import { RoleRepository } from "@repositories/role-repository";

export class UpdateRoleModuleByIdService {
    private roleRepository: RoleRepository;

    constructor(roleRepository: RoleRepository) {
        this.roleRepository = roleRepository;
    }

    /**
     * Atualiza os módulos associados a uma função.
     * @param id - Identificador da função.
     * @param moduleIds - Lista de IDs dos módulos a serem associados.
     * @returns A função atualizada.
     * @throws roleNotFound se a função não existir.
     */
    async execute(id: string, moduleIds: string[]): Promise<Role> {
        const role = await this.roleRepository.getRoleById(id);
        if (!role) { throw roleNotFound; }

        const modules = await this.roleRepository.getModulesByRole(id);

        // Filtra módulos a serem adicionados (presentes em moduleIds mas não em modules)
        const modulesToLink = moduleIds
            .filter(moduleId => !modules.some(module => module.id === moduleId))
            .map(moduleId => ({ id: moduleId }));

        // Filtra módulos a serem removidos (presentes em modules mas não em moduleIds)
        const modulesToUnlink = modules
            .filter(module => !moduleIds.includes(module.id));

        for (const moduleToLink of modulesToLink) {
            await this.roleRepository.linkModule(id, moduleToLink.id);
        }

        for (const moduleToUnlink of modulesToUnlink) {
            await this.roleRepository.unlinkModule(id, moduleToUnlink.id);
        }

        const updatedRole = await this.roleRepository.getRoleById(id);
        if (!updatedRole) { throw roleNotFound; }

        return updatedRole;
    }
}