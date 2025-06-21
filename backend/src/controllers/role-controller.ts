/**
 * @route GET /api/roles
 * @description Retorna uma lista de todas as funções cadastradas. Permite busca opcional por nome ou descrição via query param `search`.
 * @param {string} [req.query.search] - (opcional) Termo para filtrar funções pelo nome ou descrição.
 * @returns {Role[]} 200 - Lista de funções.
 *
 * @route GET /api/roles/:id
 * @description Retorna uma função específica, incluindo os módulos associados a ela.
 * @param {string} req.params.id - Identificador da função.
 * @returns {Role} 200 - Função encontrada com seus módulos.
 * @returns {Object} 404 - Função não encontrada.
 *
 * @route POST /api/roles
 * @description Cria uma nova função com nome e descrição informados.
 * @param {Object} req.body - Dados da nova função.
 * @param {string} req.body.name - Nome da função.
 * @param {string} req.body.description - Descrição da função.
 * @returns {Role} 201 - Função criada.
 * @returns {Object} 400 - Dados inválidos.
 *
 * @route PUT /api/roles/:id
 * @description Atualiza os dados (nome e/ou descrição) de uma função existente.
 * @param {string} req.params.id - Identificador da função.
 * @param {Object} req.body - Dados para atualização.
 * @param {string} [req.body.name] - (opcional) Novo nome da função.
 * @param {string} [req.body.description] - (opcional) Nova descrição da função.
 * @returns {Role} 200 - Função atualizada.
 * @returns {Object} 404 - Função não encontrada.
 *
 * @route PUT /api/roles/:id/modules
 * @description Atualiza os módulos associados a uma função.
 * @param {string} req.params.id - Identificador da função.
 * @param {Object} req.body - Dados para atualização de módulos.
 * @param {string[]} req.body.moduleIds - Lista de IDs dos módulos a serem associados.
 * @returns {Role} 200 - Função com módulos atualizados.
 * @returns {Object} 404 - Função não encontrada.
 */