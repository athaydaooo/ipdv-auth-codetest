# IPDV Auth Codetest - Backend

API para o sistema de autenticação e controle de acesso modularizado.

## 📦 Dependências

### Principais
- **Express** (v4.18.2): Framework web para Node.js
- **Prisma** (v6.10.1): ORM para PostgreSQL
- **jsonwebtoken** (v9.0.0): Autenticação via tokens
- **Zod** (v3.20.2): Validação de dados
- **bcryptjs** (v2.4.3): Criptografia de senhas
- **winston** (v3.17.0): Sistema de logging

### Desenvolvimento
- **TypeScript** (v4.9.4): Superset JavaScript tipado
- **Jest** (v29.3.1): Testes unitários
- **ESLint**: Linter para qualidade de código
- **Prettier**: Formatação de código

## Requisitos

- **Node.js**: A versão recomendada do Node.js é a 16 ou superior.
- **pnpm**: Usamos o `pnpm` como gerenciador de pacotes para garantir uma instalação mais rápida e eficiente. **Recomendamos fortemente o uso do `pnpm`**.

## Instalação

1. Clone o repositório:

   ```bash
   git clone https://github.com/athaydaooo/ipdv-auth-codetest.git
   cd ipdv-auth-codetest
   ```

2. Instale as dependências com o `pnpm`:

   ```bash
   pnpm install
   ```
## 🔄 Ciclo de Vida

### Scripts Principais

- **`pnpm dev`**  
    Inicia o servidor em modo de desenvolvimento com recarregamento automático. Ideal para desenvolvimento local, pois reflete alterações no código em tempo real.

- **`pnpm build`**  
    Compila o código TypeScript para JavaScript na pasta `dist/`. Deve ser executado antes de rodar em produção.

- **`pnpm start`**  
    Executa a aplicação já compilada (pasta `dist/`). Usado para ambientes de produção.

- **`pnpm prisma db seed`**  
    Popula o banco de dados com dados iniciais (seed), como usuários, cargos e módulos padrão. Execute após a criação/migração do banco.

### Exemplo de Uso

```bash
# Desenvolvimento
pnpm dev

# Build para produção
pnpm build

# Rodar em produção
pnpm start

# Popular banco de dados
pnpm prisma db seed
```

> Consulte o arquivo `package.json` para ver todos os scripts disponíveis.
## 📊 Diagrama do Banco de Dados

```mermaid
erDiagram
    USER ||--o{ SESSION : possui
    USER ||--|{ USER_ROLE : associado
    ROLE ||--|{ USER_ROLE : atribuído
    ROLE ||--|{ ROLE_MODULE : acessa
    MODULE ||--|{ ROLE_MODULE : disponibilizado

    USER {
        string id
        string name
        string email
        string password
        boolean isActive
        datetime createdAt
        datetime updatedAt
    }

    ROLE {
        string id
        string name
        string description
        datetime createdAt
        datetime updatedAt
    }

    MODULE {
        string id
        string name
        string description
        datetime createdAt
        datetime updatedAt
    }

    USER_ROLE {
        string userId
        string roleId
        datetime assignedAt
    }

    ROLE_MODULE {
        string roleId
        string moduleId
        datetime assignedAt
    }

    SESSION {
        string id
        string accessToken
        string refreshToken
        datetime accessTokenExpiresAt
        datetime refreshTokenExpiresAt
        boolean isRevoked
        string userId
        datetime createdAt
        datetime updatedAt
    }
````

## 🗃️ Modelagem do Banco de Dados - Decisões Estruturais

### 1. Relacionamentos N\:N (Muitos-para-Muitos)

**Tabelas Associativas:**

* **UserRole**: Gerencia a relação usuário-cargo
* **RoleModule**: Controla acesso cargo-módulo

**Vantagens:**

* Máxima flexibilidade na atribuição de permissões
* Histórico de associação (timestamp `assignedAt`)
* Consultas otimizadas com índices compostos (`@@id`)

### 2. Estrutura de Módulos

**Model `Module`:**

* Representa funcionalidades do sistema
* Relacionamento indireto com usuários via cargos
* Permite controle granular de acesso

**Benefícios:**

* Hierarquia clara de permissões
* Fácil expansão para novos módulos
* Desacoplamento entre usuários e funcionalidades

### 3. Controle de Sessões Avançado

**Model `Session`:**

* Token JWT rastreável
* Controle de revogação (`isRevoked`)
* Validade temporária (`expiresAt`)

**Segurança:**

* Invalidação centralizada de tokens
* Prevenção contra replay attacks
* Auditoria de acesso

### 4. Boas Práticas Gerais

* **UUID como chave primária**

  * Mais seguro que sequenciais
  * Não expõe volume de dados

* **Timestamps automáticos**

  * `createdAt` para registro temporal
  * `updatedAt` para rastreamento de mudanças

* **Soft Delete via `isActive`**

  * Preserva integridade referencial
  * Permite reativação de contas

## ⚡ Pontos Fortes da Estrutura

### Gestão Granular de Acessos

* Usuários → Cargos → Módulos (RBAC)
* Permissões dinâmicas sem alterar código

### Extensibilidade

* Adição de novos módulos sem migrações complexas
* Escalável para sistemas com +100 funcionalidades

### Performance

* Índices otimizados para consultas frequentes
* Relacionamentos pré-carregáveis com Prisma

### Manutenibilidade

* Modelagem auto-documentada
* Separação clara de responsabilidades

### Segurança

* Controle de sessão ativo
* Auditoria completa de acessos


## Endpoints
### AuthController

#### postLogin
- `POST /auth/login`
- Autentica um usuário com email e senha.
- **Request Body:**  
    - `email` (string): Email do usuário.
    - `password` (string): Senha do usuário.
- **Responses:**  
    - `200`: Retorna o usuário autenticado, token de acesso e data de expiração.
    - `401`: Credenciais inválidas.

#### postLogout
- `POST /auth/logout`
- Encerra a sessão do usuário autenticado.
- **Headers:**  
    - `Authorization` (string): Token JWT no formato Bearer.
- **Responses:**  
    - `200`: Logout realizado com sucesso.
    - `401`: Token inválido ou ausente.

#### postRefresh
- `POST /auth/refresh`
- Gera um novo token de acesso usando um refresh token válido.
- **Request Body:**  
    - `refreshToken` (string): Refresh token válido.
- **Responses:**  
    - `200`: Retorna novo token de acesso e data de expiração.
    - `401`: Refresh token inválido ou expirado.

---

### RoleController

#### getRoles
- `GET /roles`
- Retorna uma lista de todas as funções cadastradas. Permite busca opcional por nome ou descrição via query params.
- **Query Params:**  
    - `name` (string, opcional): Termo para filtrar funções pelo nome.
    - `description` (string, opcional): Termo para filtrar funções pela descrição.
- **Responses:**  
    - `200`: Lista de funções.

#### getRoleById
- `GET /roles/:id`
- Retorna uma função específica, incluindo os módulos associados a ela.
- **Params:**  
    - `id` (string): Identificador da função.
- **Responses:**  
    - `200`: Função encontrada com seus módulos.
    - `404`: Função não encontrada.

#### postRole
- `POST /roles`
- Cria uma nova função com nome e descrição informados.
- **Request Body:**  
    - `name` (string): Nome da função.
    - `description` (string): Descrição da função.
- **Responses:**  
    - `201`: Função criada.
    - `400`: Dados inválidos.

#### putRole
- `PUT /roles/:id`
- Atualiza os dados (nome e/ou descrição) de uma função existente.
- **Params:**  
    - `id` (string): Identificador da função.
- **Request Body:**  
    - `name` (string, opcional): Novo nome da função.
    - `description` (string, opcional): Nova descrição da função.
- **Responses:**  
    - `200`: Função atualizada.
    - `404`: Função não encontrada.

#### putRoleModules
- `PUT /roles/:id/modules`
- Atualiza os módulos associados a uma função.
- **Params:**  
    - `id` (string): Identificador da função.
- **Request Body:**  
    - `moduleIds` (string[]): Lista de IDs dos módulos a serem associados.
- **Responses:**  
    - `200`: Função com módulos atualizados.
    - `404`: Função não encontrada.

---

### UserController

#### getUsers
- `GET /users`
- Lista todos os usuários, com filtros opcionais por status ativo, função (role) e busca por nome/email.
- **Query Params:**  
    - `isActive` (boolean, opcional): Filtrar por usuários ativos/inativos.
    - `roleId` (string, opcional): Filtrar por função (role) do usuário.
    - `search` (string, opcional): Buscar por nome ou email.
- **Responses:**  
    - `200`: Lista de usuários.

#### getUser
- `GET /users/:id`
- Busca um usuário pelo ID, incluindo suas funções (roles).
- **Params:**  
    - `id` (string): ID do usuário.
- **Responses:**  
    - `200`: Usuário encontrado com funções associadas.
    - `404`: Usuário não encontrado.

#### postUser
- `POST /users`
- Cria um novo usuário com nome, email, senha e funções (roles) associadas.
- **Request Body:**  
    - `name` (string): Nome do usuário.
    - `email` (string): Email do usuário.
    - `password` (string): Senha do usuário.
    - `roleIds` (string[]): IDs das funções (roles) associadas.
- **Responses:**  
    - `201`: Usuário criado.
    - `400`: Dados inválidos.

#### putUser
- `PUT /users/:id`
- Atualiza informações básicas de um usuário (nome, email ou status ativo).
- **Params:**  
    - `id` (string): ID do usuário.
- **Request Body:**  
    - `name` (string, opcional): Novo nome do usuário.
    - `email` (string, opcional): Novo email do usuário.
    - `isActive` (boolean, opcional): Novo status ativo.
- **Responses:**  
    - `200`: Usuário atualizado.
    - `404`: Usuário não encontrado.

#### putPassword
- `PUT /users/:id/password`
- Atualiza a senha de um usuário.
- **Params:**  
    - `id` (string): ID do usuário.
- **Request Body:**  
    - `newPassword` (string): Nova senha.
- **Responses:**  
    - `200`: Senha atualizada com sucesso.
    - `404`: Usuário não encontrado.

#### putUserRoles
- `PUT /users/:id/roles`
- Atualiza as funções (roles) associadas a um usuário.
- **Params:**  
    - `id` (string): ID do usuário.
- **Request Body:**  
    - `roleIds` (string[]): Novos IDs das funções (roles).
- **Responses:**  
    - `200`: Usuário com funções atualizadas.
    - `404`: Usuário não encontrado.

#### deleteUser
- `DELETE /users/:id`
- Desabilita um usuário pelo ID.
- **Params:**  
    - `id` (string): ID do usuário.
- **Responses:**  
    - `200`: Usuário desabilitado com sucesso.
    - `404`: Usuário não encontrado.