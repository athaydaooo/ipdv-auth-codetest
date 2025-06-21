import { Module, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ModuleRepository {
    async getAllModules(): Promise<Module[]> {
        return prisma.module.findMany();
    }

    async getModuleById(id: string): Promise<Module | null> {
        return prisma.module.findUnique({ where: { id } });
    }

    async createModule(data: Omit<Module, 'id'>): Promise<Module> {
        return prisma.module.create({ data });
    }

    async updateModule(id: string, data: Partial<Module>): Promise<Module> {
        return prisma.module.update({ where: { id }, data });
    }

    async deleteModule(id: string): Promise<Module> {
        return prisma.module.delete({ where: { id } });
    }

}