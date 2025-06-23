import { PrismaClient, Session } from '@prisma/client';

const prisma = new PrismaClient();

export class SessionRepository {
    async getAllSessions(): Promise<Session[]> {
        return await prisma.session.findMany();
    }

    async getSessionById(id: string): Promise<Session | null> {
        return await prisma.session.findUnique({ where: { id } });
    }

    async getSessionByAccessToken(accessToken: string): Promise<Session | null> {
        return await prisma.session.findUnique({ where: { accessToken } });
    }

    async getSessionByRefreshToken(refreshToken: string): Promise<Session | null> {
        return await prisma.session.findUnique({ where: { refreshToken } });
    }

    async createSession(data: Omit<Session, 'id'>): Promise<Session> {
        return await prisma.session.create({
            data: {
                ...data,
                id: undefined 
            }
        });
    }

    async updateSession(id: string, data: Partial<Session>): Promise<Session> {
        return await prisma.session.update({ where: { id }, data });
    }

    async deleteSession(id: string): Promise<Session> {
        return await prisma.session.delete({ where: { id } });
    }

    async revokeSession(accessToken: string) {
        return await prisma.session.updateMany({
            where: { accessToken },
            data: { isRevoked: true },
        });
    }
}
