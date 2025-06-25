import { Role, User } from "@prisma/client";

export type UserEntity = User & { roles: Role[] };

export interface UserDto {
    id: string;
    name: string;
    email: string;
    isActive: boolean;
    roles: string[];
}

export class UserMapper {
    static toDto(user: UserEntity): UserDto {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            isActive: user.isActive,
            roles: user.roles.map(role => role.name),
        };
    }

    static toDtoList(users: UserEntity[]): UserDto[] {
        return users.map(user => this.toDto(user));
    }
}