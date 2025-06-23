import { PrismaClient, Role, User } from '@prisma/client';

const prisma = new PrismaClient();

export class UserRepository {
    async getAllUsers(): Promise<User[]> {
        return prisma.user.findMany();
    }

    async getUserById(id: string): Promise<User | null> {
        return prisma.user.findUnique({ where: { id } });
    }

    async createUser(data: Omit<User, 'id'>): Promise<User> {
        return prisma.user.create({
            data: {
                ...data,
                id: undefined 
            }
        });
    }

    async updateUser(id: string, data: Partial<User>): Promise<User> {
        return prisma.user.update({ where: { id }, data });
    }

    async deleteUser(id: string): Promise<User> {
        return prisma.user.delete({ where: { id } });
    }

    async getUserByEmail(email: string): Promise<User | null> {
        return prisma.user.findUnique({ where: { email } });
    }

    // N:N Table operations for linking roles and modules
    
    async linkRole(userId: string, roleId: string): Promise<void> {
        await prisma.userRole.create({
            data: {
                roleId,
                userId
            }
        });
    }

    async unlinkRole(userId: string, roleId: string): Promise<void> {
        await prisma.userRole.deleteMany({
            where: {
                roleId,
                userId
            }
        });
    }

    async getRolesByUser(roleId: string): Promise<Role[]> {
        const roles = await prisma.module.findMany({
            where: {
                roles: {
                    some: {
                        roleId: roleId
                    }
                }
            }
        });
        return roles;
    }
}
