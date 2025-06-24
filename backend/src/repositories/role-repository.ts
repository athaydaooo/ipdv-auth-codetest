import { userNotEnoughtParameters } from '@errors/user';
import { Module, PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

export class RoleRepository {
    async getAllRoles(): Promise<Role[]> {
        return prisma.role.findMany();
    }

    async GetRoleByName(name: string): Promise<Role | null> {
        return prisma.role.findFirst({
            where: {
                name: {
                    contains: name,
                    mode: 'insensitive',
                },
            },
        });
    }

    async getRoles(name?: string, description?: string): Promise<Role[]> {
        if (!name && !description) {
            throw userNotEnoughtParameters;
        }
        
        return prisma.role.findMany(
            {
                where: {
                    name: {
                        contains: name,
                        mode: 'insensitive',
                    },
                    description: {
                        contains: description,
                        mode: 'insensitive',
                    },
                },
            }
        );
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

    async getRoleWithModulesById(roleId: string): Promise<(Role & { modules: Module[] })> {
        const role = await prisma.role.findUnique({
            where: { id: roleId },
            include: {
                modules: {
                    include: {
                        module: true,
                    },
                },
            },
        });

        if (!role) throw new Error(`Role with ID ${roleId} not found`);

        const modules = role.modules.map((rm) => rm.module);

        const { modules: _, ...roleData } = role;

        return {
            ...roleData,
            modules,
        };
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