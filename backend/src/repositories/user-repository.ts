import { userNotEnoughtParameters } from '@errors/user';
import { PrismaClient, Role, User } from '@prisma/client';
import { UserEntity } from 'src/mappers/users.mapper';

const prisma = new PrismaClient();

export class UserRepository {
    async getAllUsers(): Promise<(User & { roles: Role[] })[]> {
        const users = await prisma.user.findMany({
            include: {
                roles: {
                    include: {
                        role: true
                    }
                }
            }
        });

        return users.map(user => ({
            ...user,
            roles: user.roles.map(r => r.role)
        }));
    }

    async getUserById(id: string): Promise<UserEntity | null> {
        const user = await prisma.user.findUnique({ where: { id },include: { roles: { include: { role: true } } } });
        
        if (!user) {
            return null;
        }

        return {
            ...user,
            roles: user.roles.map(r => r.role)
        }

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
        return prisma.user.update({ where: { id }, data: {...data, updatedAt: new Date()} });
    }

    async deleteUser(id: string): Promise<User> {
        return prisma.user.delete({ where: { id } });
    }

    async getUserByEmail(email: string): Promise<UserEntity | null> {
        const user = await prisma.user.findUnique({ where: { email },include: { roles: { include: { role: true } } } });

        if (!user) {
            return null;
        }

        return {
            ...user,
            roles: user.roles.map(r => r.role)
        }

    }

    async getUsers(filters: {
        isActive?: boolean;
        roleId?: string[];
        name?: string;
        email?: string;
    }): Promise<(User & { roles: Role[] })[]> {
        const { isActive, roleId, name, email } = filters;

        if (
            isActive === undefined &&
            !roleId &&
            !name &&
            !email
        ) {
          throw userNotEnoughtParameters;
        }

        const users = await prisma.user.findMany({
            where: {
                ...(isActive !== undefined && { isActive }),
                ...(name && {
                    name: {
                        contains: name,
                        mode: 'insensitive'
                    }
                }),
                ...(email && {
                    email: {
                        contains: email,
                        mode: 'insensitive'
                    }
                }),
                ...(roleId && {
                    roles: {
                        some: {
                            roleId: { in: roleId }
                        }
                    }
                })
            },
            include: {
                roles: {
                    include: {
                        role: true
                    }
                }
            }
        });

        return users.map(user => ({
            ...user,
            roles: user.roles.map(r => r.role)
        }));
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
        const roles = await prisma.userRole.findMany({
            where: { userId: roleId },
            include: { role: true }
        });

        return roles.map(r => r.role);

    }
}
