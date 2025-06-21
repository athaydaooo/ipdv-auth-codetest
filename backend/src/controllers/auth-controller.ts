/**
 * @route POST /api/auth/login
 * @description Autentica um usuário com email e senha.
 * @param {Object} req.body - Dados de autenticação do usuário.
 * @param {string} req.body.email - Email do usuário.
 * @param {string} req.body.password - Senha do usuário.
 * @returns {Object} 200 - Retorna o usuário autenticado, token de acesso e data de expiração.
 * @returns {Object} 401 - Credenciais inválidas.
 *
 * @route POST /api/auth/logout
 * @description Encerra a sessão do usuário autenticado.
 * @header {string} Authorization - Token JWT no formato Bearer.
 * @returns {void} 200 - Logout realizado com sucesso.
 * @returns {Object} 401 - Token inválido ou ausente.
 *
 * @route POST /api/auth/refresh
 * @description Gera um novo token de acesso usando um refresh token válido.
 * @param {Object} req.body - Dados para renovação do token.
 * @param {string} req.body.refreshToken - Refresh token válido.
 * @returns {Object} 200 - Retorna novo token de acesso e data de expiração.
 * @returns {Object} 401 - Refresh token inválido ou expirado.
 */