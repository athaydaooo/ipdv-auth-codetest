import { Session } from "@prisma/client";

export class RefreshTokenService {
    async execute(refreshToken: string): Promise<Session> {
        // This method should contain the logic for user login
        // Placeholder implementation to satisfy return type
        throw new Error("Method not implemented.");
    }
}