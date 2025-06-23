import { Module, PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

export class RoleRepository {
    async getAllRoles(): Promise<Role[]> {
        return prisma.role.findMany();
    }

    async getRoleById(id: string): Promise<Role | null> {
        return prisma.role.findUnique({ where: { id } });
    }

    async createRole(data: Omit<Role, 'id'>): Promise<Role> {
        return prisma.role.create({
            data: {
                ...data,
                id: undefined 
            }
        });
    }

    async updateRole(id: string, data: Partial<Role>): Promise<Role> {
        return prisma.role.update({ where: { id }, data: {...data, updatedAt: new Date()} });
    }

    async deleteRole(id: string): Promise<Role> {
        return prisma.role.delete({ where: { id } });
    }

    // N:N Table operations for linking roles and modules

    async linkModule(roleId: string, moduleId: string): Promise<void> {
        await prisma.roleModule.create({
            data: {
                roleId,
                moduleId
            }
        });
    }

    async unlinkModule(roleId: string, moduleId: string): Promise<void> {
        await prisma.roleModule.deleteMany({
            where: {
                roleId,
                moduleId
            }
        });
    }

    async getModulesByRole(roleId: string): Promise<Module[]> {
        const modules = await prisma.module.findMany({
            where: {
                roles: {
                    some: {
                        roleId: roleId
                    }
                }
            }
        });
        return modules;
    }
}