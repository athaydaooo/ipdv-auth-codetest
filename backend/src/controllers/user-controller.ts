import { User } from "@prisma/client";
import { getUserByIdParamsSchema } from "@schemas/user/get-user-by-id-schema";
import { getUsersQuerySchema } from "@schemas/user/get-users-schema";
import { postUserSchema } from "@schemas/user/post-user-schema";
import { updateUserRolesSchema } from "@schemas/user/put-user-password-schema";
import { updateUserPasswordSchema } from "@schemas/user/put-user-roles-schema";
import { updateUserSchema } from "@schemas/user/update-user-schema";
import { UpdateUserByIdService } from "@services/user/update-user-by-id-service/update-user-by-id-service";
import { Request, Response } from 'express';
import { DeleteUserByIdService } from '../services/user/delete-user-by-id-service/delete-user-by-id-service';
import { GetUserByIdService } from '../services/user/get-user-by-id-service/get-user-by-id-service';
import { GetUsersService } from '../services/user/get-users-service/get-users-service';
import { PostUserService } from '../services/user/post-user-service/post-user-service';
import { UpdatePasswordByIdService } from '../services/user/update-password-by-id-service/update-password-by-id-service';
import { UpdateUserRolesByIdService } from '../services/user/update-user-roles-by-id-service/update-user-roles-by-id-service';

export interface UserControllerProps {
    deleteUserByIdService: DeleteUserByIdService;
    getUserByIdService: GetUserByIdService;
    getUsersService: GetUsersService;
    postUserService: PostUserService;
    updatePasswordByIdService: UpdatePasswordByIdService;
    updateUserRolesByIdService: UpdateUserRolesByIdService;
    updateUserById: UpdateUserByIdService;
}

export class UserController {
    private props: UserControllerProps;

    constructor(props: UserControllerProps) {
        this.props = props;
    }

    /**
     * @route GET /users
     * @description Lista todos os usuários, com filtros opcionais por status ativo, função (role) e busca por nome/email.
     * @param {boolean} [req.query.isActive] - Filtrar por usuários ativos/inativos.
     * @param {string} [req.query.roleId] - Filtrar por função (role) do usuário.
     * @param {string} [req.query.search] - Buscar por nome ou email.
     * @returns {User[]} 200 - Lista de usuários.
     */
    async getUsers(request: Request, response: Response) {
        //todo: fix search query
        //todo: add pagination
        const { isActive, email, name, roleId } = getUsersQuerySchema.parse(request.query);

        const rolesId = roleId ? roleId.split(',') : undefined;

        const users = await this.props.getUsersService.execute({
            isActive,
            email,
            name,
            roleId: rolesId
        });
        
        return response.status(200).json(users);
    }

    /**
     * @route GET /users/:id
     * @description Busca um usuário pelo ID, incluindo suas funções (roles).
     * @param {string} req.params.id - ID do usuário.
     * @returns {User} 200 - Usuário encontrado com funções associadas.
     * @returns {Object} 404 - Usuário não encontrado.
     */
    async getUser(request: Request, response: Response) {
        const { id } = getUserByIdParamsSchema.parse(request.params);
        const user = await this.props.getUserByIdService.execute( id );
        
        return response.status(200).json(user);
    }

    /**
     * @route POST /users
     * @description Cria um novo usuário com nome, email, senha e funções (roles) associadas.
     * @param {Object} req.body - Dados do novo usuário.
     * @param {string} req.body.name - Nome do usuário.
     * @param {string} req.body.email - Email do usuário.
     * @param {string} req.body.password - Senha do usuário.
     * @param {string[]} req.body.roleIds - IDs das funções (roles) associadas.
     * @returns {User} 201 - Usuário criado.
     * @returns {Object} 400 - Dados inválidos.
     */
    async postUser(request: Request, response: Response) {
        const { name, email, password, roleIds } = postUserSchema.parse(request.body);

        const user = await this.props.postUserService.execute({
            name,
            email,
            password,
            roleIds
        });

        return response.status(201).json(user);
    }

    /** 
     * @route PUT /users/:id
     * @description Atualiza informações básicas de um usuário (nome, email ou status ativo).
     * @param {string} req.params.id - ID do usuário.
     * @param {Object} req.body - Dados para atualização.
     * @param {string} [req.body.name] - Novo nome do usuário.
     * @param {string} [req.body.email] - Novo email do usuário.
     * @param {boolean} [req.body.isActive] - Novo status ativo.
     * @returns {User} 200 - Usuário atualizado.
     * @returns {Object} 404 - Usuário não encontrado.
     */
    async putUser(request: Request, response: Response) {
        const { id } = getUserByIdParamsSchema.parse(request.params);
        const { name, email, isActive } = updateUserSchema.parse(request.body);

        const updatedUser = await this.props.updateUserById.execute({
            id,
            name,
            email,
            isActive
        });

        return response.status(200).json(updatedUser);
    }

    /**
     * @route PUT /users/:id/password
     * @description Atualiza a senha de um usuário.
     * @param {string} req.params.id - ID do usuário.
     * @param {Object} req.body - Dados para atualização de senha.
     * @param {string} req.body.newPassword - Nova senha.
     * @returns {void} 200 - Senha atualizada com sucesso.
     * @returns {Object} 404 - Usuário não encontrado.
     */
    async putPassword(request: Request, response: Response) {
        const { id } = getUserByIdParamsSchema.parse(request.params);
        const { newPassword } = updateUserPasswordSchema.parse(request.body);

        await this.props.updatePasswordByIdService.execute(
            id,
            newPassword
        );

        return response.status(200).send();
    }

    /**  
     * @route PUT /users/:id/roles
     * @description Atualiza as funções (roles) associadas a um usuário.
     * @param {string} req.params.id - ID do usuário.
     * @param {Object} req.body - Dados para atualização de funções.
     * @param {string[]} req.body.roleIds - Novos IDs das funções (roles).
     * @returns {User} 200 - Usuário com funções atualizadas.
     * @returns {Object} 404 - Usuário não encontrado.
     */
    async putUserRoles(request: Request, response: Response) {
        //todo: fix roleIds validation
        const { id } = getUserByIdParamsSchema.parse(request.params);
        const { roleIds } = updateUserRolesSchema.parse(request.body);

        const updatedUser = await this.props.updateUserRolesByIdService.execute(
            id,
            roleIds
        );

        return response.status(200).json(updatedUser);
    }

    /**
     * @route DELETE /users/:id
     * @description Desabilita um usuário pelo ID.
     * @param {string} req.params.id - ID do usuário.
     * @returns {void} 200 - Usuário desabilitado com sucesso.
     * @returns {Object} 404 - Usuário não encontrado.
     */
    async deleteUser(request: Request, response: Response) {
        const { id } = getUserByIdParamsSchema.parse(request.params);

        await this.props.deleteUserByIdService.execute(id);

        return response.status(200).send();    
    }
}
