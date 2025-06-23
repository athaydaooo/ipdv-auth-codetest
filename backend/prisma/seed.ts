import { PrismaClient } from '@prisma/client';
import logger from '@utils/logger';
import { crypto } from '../src/utils/crypto';

const prisma = new PrismaClient();

async function main() {
  const defaultPassword = crypto.encrypt({ data: '@Senha123' });

  // Cria os módulos
  const [logistica, autenticacao, financeiro] = await Promise.all([
    prisma.module.create({ data: { name: 'logistica', description: 'Módulo de logística' } }),
    prisma.module.create({ data: { name: 'autenticacao', description: 'Módulo de autenticação' } }),
    prisma.module.create({ data: { name: 'financeiro', description: 'Módulo financeiro' } }),
  ]);

  // Cria as roles
  const [superadmin, admin, operadorLogistica, operadorFinanceiro] = await Promise.all([
    prisma.role.create({ data: { name: 'superadmin', description: 'Acesso total aos módulos' } }),
    prisma.role.create({ data: { name: 'admin', description: 'Acesso administrativo aos módulos' } }),
    prisma.role.create({ data: { name: 'operador de logistica', description: 'Acesso ao módulo de logística' } }),
    prisma.role.create({ data: { name: 'operador financeiro', description: 'Acesso ao módulo financeiro' } }),
  ]);

  // Relaciona roles aos módulos (RoleModule)
  await Promise.all([
    // superadmin: todos os módulos
    prisma.roleModule.createMany({
      data: [
        { roleId: superadmin.id, moduleId: logistica.id },
        { roleId: superadmin.id, moduleId: autenticacao.id },
        { roleId: superadmin.id, moduleId: financeiro.id },
      ],
    }),
    // admin: todos os módulos
    prisma.roleModule.createMany({
      data: [
        { roleId: admin.id, moduleId: logistica.id },
        { roleId: admin.id, moduleId: autenticacao.id },
        { roleId: admin.id, moduleId: financeiro.id },
      ],
    }),
    // operador de logistica: só logistica
    prisma.roleModule.create({
      data: { roleId: operadorLogistica.id, moduleId: logistica.id },
    }),
    // operador financeiro: só financeiro
    prisma.roleModule.create({
      data: { roleId: operadorFinanceiro.id, moduleId: financeiro.id },
    }),
  ]);

  // Cria usuários e associa cada um a uma role (UserRole)
  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: 'Lucas Pereira',
        email: 'lucas.pereira@email.com',
        password: defaultPassword,
        roles: {
          create: { roleId: superadmin.id },
        },
      },
    }),
    prisma.user.create({
      data: {
        name: 'Ana Souza',
        email: 'ana.souza@email.com',
        password: defaultPassword,
        roles: {
          create: { roleId: admin.id },
        },
      },
    }),
    prisma.user.create({
      data: {
        name: 'Carlos Lima',
        email: 'carlos.lima@email.com',
        password: defaultPassword,
        roles: {
          create: { roleId: operadorLogistica.id },
        },
      },
    }),
    prisma.user.create({
      data: {
        name: 'Mariana Alves',
        email: 'mariana.alves@email.com',
        password: defaultPassword,
        roles: {
          create: { roleId: operadorFinanceiro.id },
        },
      },
    }),
  ]);

  // Sessions permanece vazia (nenhuma ação necessária)

  logger.info('Database seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
