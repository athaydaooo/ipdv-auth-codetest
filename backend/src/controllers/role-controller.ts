import { getRoleByIdParamsSchema } from '@schemas/role/get-role-by-id-schema';
import { getRolesSchema } from '@schemas/role/get-roles-schema';
import { postRoleBodySchema } from '@schemas/role/post-role-schema';
import { updateRoleModuleSchema } from '@schemas/role/update-role-module-schema';
import { updateRoleSchema } from '@schemas/role/update-role-schema';
import { Request, Response } from 'express';
import { GetRoleByIdService } from '../services/role/get-role-by-id-service/get-user-by-id-service';
import { GetRolesService } from '../services/role/get-roles-service/get-roles-service';
import { PostRoleService } from '../services/role/post-role-service/post-role-service';
import { UpdateRoleByIdService } from '../services/role/update-role-by-id-service/update-user-by-id-service';
import { UpdateRoleModuleByIdService } from '../services/role/update-role-module-by-id-service/update-role-module-by-id-service';


export interface RoleControllerProps {
    getRoleByIdService:  GetRoleByIdService;
    getRolesService: GetRolesService;
    postRoleService: PostRoleService;
    updateRoleByIdService: UpdateRoleByIdService;
    updateRoleModuleByIdService: UpdateRoleModuleByIdService;
}

export class RoleController {
    private getRoleByIdService: GetRoleByIdService;
    private getRolesService: GetRolesService;
    private postRoleService: PostRoleService;
    private updateRoleByIdService: UpdateRoleByIdService;
    private updateRoleModuleByIdService: UpdateRoleModuleByIdService;


    constructor(props: RoleControllerProps) {
        this.getRoleByIdService = props.getRoleByIdService;
        this.getRolesService = props.getRolesService;
        this.postRoleService = props.postRoleService;
        this.updateRoleByIdService = props.updateRoleByIdService;
        this.updateRoleModuleByIdService = props.updateRoleModuleByIdService;
    }

    /**
     * @route GET /roles
     * @description Retorna uma lista de todas as funções cadastradas. Permite busca opcional por nome ou descrição via query params `name` ou `description`.
     * @param {string} [req.query.name] - (opcional) Termo para filtrar funções pelo nome.
     * @param {string} [req.query.description] - (opcional) Termo para filtrar funções pela descrição.
     * @returns {Role[]} 200 - Lista de funções.
     */
    async getRoles(request: Request, response: Response) {
        const { name, description } = getRolesSchema.parse(request.query);
 
        const roles = await this.getRolesService.execute({
            name,
            description,
        });

        return response.status(200).json(roles);
    }

    /**
     * @route GET /roles/:id
     * @description Retorna uma função específica, incluindo os módulos associados a ela.
     * @param {string} req.params.id - Identificador da função.
     * @returns {Role} 200 - Função encontrada com seus módulos.
     * @returns {Object} 404 - Função não encontrada.
     */
    async getRoleById(request: Request, response: Response) {
        const { id } = getRoleByIdParamsSchema.parse(request.params);

        const role = await this.getRoleByIdService.execute(id);

        return response.status(200).json(role);
    }

    /**
     * @route POST /roles
     * @description Cria uma nova função com nome e descrição informados.
     * @param {Object} req.body - Dados da nova função.
     * @param {string} req.body.name - Nome da função.
     * @param {string} req.body.description - Descrição da função.
     * @returns {Role} 201 - Função criada.
     * @returns {Object} 400 - Dados inválidos.
     */
    async postRole(request: Request, response: Response) {
        const { name, description } = postRoleBodySchema.parse(request.body);

        const role = await this.postRoleService.execute(name, description);

        return response.status(201).json(role);
    }

    /**
     * @route PUT /roles/:id
     * @description Atualiza os dados (nome e/ou descrição) de uma função existente.
     * @param {string} req.params.id - Identificador da função.
     * @param {Object} req.body - Dados para atualização.
     * @param {string} [req.body.name] - (opcional) Novo nome da função.
     * @param {string} [req.body.description] - (opcional) Nova descrição da função.
     * @returns {Role} 200 - Função atualizada.
     * @returns {Object} 404 - Função não encontrada.
     */
    async putRole(request: Request, response: Response) {
        const { id } = request.params;
        const {  description, name } = updateRoleSchema.parse(request.body);
        const updatedRole = await this.updateRoleByIdService.execute(id, name, description);

        if (!updatedRole) {
            return response.status(404).json({ message: 'Função não encontrada.' });
        }
        return response.status(200).json(updatedRole);
    }

    /**
     * @route PUT /roles/:id/modules
     * @description Atualiza os módulos associados a uma função.
     * @param {string} req.params.id - Identificador da função.
     * @param {Object} req.body - Dados para atualização de módulos.
     * @param {string[]} req.body.moduleIds - Lista de IDs dos módulos a serem associados.
     * @returns {Role} 200 - Função com módulos atualizados.
     * @returns {Object} 404 - Função não encontrada.
     */
    async putRoleModules(request: Request, response: Response) {
        const { id } = getRoleByIdParamsSchema.parse(request.params);
        const { moduleIds } = updateRoleModuleSchema.parse(request.body);

        const updatedRole = await this.updateRoleModuleByIdService.execute(id, moduleIds);

        if (!updatedRole) {
            return response.status(404).json({ message: 'Função não encontrada.' });
        }
        return response.status(200).json(updatedRole);
    }
}