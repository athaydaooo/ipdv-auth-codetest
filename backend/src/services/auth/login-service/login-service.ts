import { Session, User } from "@prisma/client";

interface LoginServiceResponse { user: User; session: Session }

export class LoginService {
    async execute(email: string, password: string): Promise<LoginServiceResponse> {
        // This method should contain the logic for user login
        // Placeholder implementation to satisfy return type
        throw new Error("Method not implemented.");
    }
}