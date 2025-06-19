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

## 📊 Diagrama do Banco de Dados

```mermaid
erDiagram
    USER ||--o{ SESSION : "possui"
    USER ||--|{ USER_ROLE : "associado"
    ROLE ||--|{ USER_ROLE : "atribuído"
    ROLE ||--|{ ROLE_MODULE : "acessa"
    MODULE ||--|{ ROLE_MODULE : "disponibilizado"
    
    USER {
        string id PK "UUID"
        string name
        string email
        string password
        boolean isActive
        datetime createdAt
        datetime updatedAt
    }
    
    ROLE {
        string id PK "UUID"
        string name
        string description
        datetime createdAt
        datetime updatedAt
    }
    
    MODULE {
        string id PK "UUID"
        string name
        string description
        datetime createdAt
        datetime updatedAt
    }
    
    USER_ROLE {
        string userId FK
        string roleId FK
        datetime assignedAt
        @@id([userId, roleId])
    }
    
    ROLE_MODULE {
        string roleId FK
        string moduleId FK
        datetime assignedAt
        @@id([roleId, moduleId])
    }
    
    SESSION {
        string id PK "UUID"
        string token
        datetime expiresAt
        boolean isRevoked
        string userId FK
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
