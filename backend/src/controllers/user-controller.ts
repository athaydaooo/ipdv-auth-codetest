/**
 * @route GET /api/users
 * @description Lista todos os usuários, com filtros opcionais por status ativo, função (role) e busca por nome/email.
 * @param {boolean} [req.query.isActive] - Filtrar por usuários ativos/inativos.
 * @param {string} [req.query.roleId] - Filtrar por função (role) do usuário.
 * @param {string} [req.query.search] - Buscar por nome ou email.
 * @returns {User[]} 200 - Lista de usuários.
 *
 * @route GET /api/users/:id
 * @description Busca um usuário pelo ID, incluindo suas funções (roles).
 * @param {string} req.params.id - ID do usuário.
 * @returns {User} 200 - Usuário encontrado com funções associadas.
 * @returns {Object} 404 - Usuário não encontrado.
 *
 * @route POST /api/users
 * @description Cria um novo usuário com nome, email, senha e funções (roles) associadas.
 * @param {Object} req.body - Dados do novo usuário.
 * @param {string} req.body.name - Nome do usuário.
 * @param {string} req.body.email - Email do usuário.
 * @param {string} req.body.password - Senha do usuário.
 * @param {string[]} req.body.roleIds - IDs das funções (roles) associadas.
 * @returns {User} 201 - Usuário criado.
 * @returns {Object} 400 - Dados inválidos.
 *
 * @route PUT /api/users/:id
 * @description Atualiza informações básicas de um usuário (nome, email ou status ativo).
 * @param {string} req.params.id - ID do usuário.
 * @param {Object} req.body - Dados para atualização.
 * @param {string} [req.body.name] - Novo nome do usuário.
 * @param {string} [req.body.email] - Novo email do usuário.
 * @param {boolean} [req.body.isActive] - Novo status ativo.
 * @returns {User} 200 - Usuário atualizado.
 * @returns {Object} 404 - Usuário não encontrado.
 *
 * @route PUT /api/users/:id/password
 * @description Atualiza a senha de um usuário.
 * @param {string} req.params.id - ID do usuário.
 * @param {Object} req.body - Dados para atualização de senha.
 * @param {string} req.body.newPassword - Nova senha.
 * @returns {void} 200 - Senha atualizada com sucesso.
 * @returns {Object} 404 - Usuário não encontrado.
 *
 * @route PUT /api/users/:id/roles
 * @description Atualiza as funções (roles) associadas a um usuário.
 * @param {string} req.params.id - ID do usuário.
 * @param {Object} req.body - Dados para atualização de funções.
 * @param {string[]} req.body.roleIds - Novos IDs das funções (roles).
 * @returns {User} 200 - Usuário com funções atualizadas.
 * @returns {Object} 404 - Usuário não encontrado.
 *
 * @route DELETE /api/users/:id
 * @description Desabilita um usuário pelo ID.
 * @param {string} req.params.id - ID do usuário.
 * @returns {void} 200 - Usuário desabilitado com sucesso.
 * @returns {Object} 404 - Usuário não encontrado.
 */
import { User } from "@prisma/client";

