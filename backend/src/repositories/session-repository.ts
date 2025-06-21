import { PrismaClient, Session } from '@prisma/client';

const prisma = new PrismaClient();

export class SessionRepository {
    async getAllSessions(): Promise<Session[]> {
        return prisma.session.findMany();
    }

    async getSessionById(id: string): Promise<Session | null> {
        return prisma.session.findUnique({ where: { id } });
    }

    async createSession(data: Omit<Session, 'id'>): Promise<Session> {
        return prisma.session.create({ data });
    }

    async updateSession(id: string, data: Partial<Session>): Promise<Session> {
        return prisma.session.update({ where: { id }, data });
    }

    async deleteSession(id: string): Promise<Session> {
        return prisma.session.delete({ where: { id } });
    }
}
