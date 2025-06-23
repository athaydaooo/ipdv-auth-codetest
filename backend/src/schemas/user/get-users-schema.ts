import {
    roleInvalidEmail,
    roleInvalidIsActive,
    roleInvalidName,
    roleInvalidRoleId,
    roleMissingEmail,
    roleMissingIsActive,
    roleMissingName,
    roleMissingRoleId
} from "@errors/role";
import { z } from "zod";

export const getUsersQuerySchema = z.object({
    isActive: z.string({
        required_error: `${roleMissingIsActive.statusCode} |~| ${roleMissingIsActive.message}`,
        invalid_type_error: `${roleInvalidIsActive.statusCode} |~| ${roleInvalidIsActive.message}`,
    }).optional().transform((val) => (val === undefined ? undefined : val === "true")),
    roleId: z.string({
        required_error: `${roleMissingRoleId.statusCode} |~| ${roleMissingRoleId.message}`,
        invalid_type_error: `${roleInvalidRoleId.statusCode} |~| ${roleInvalidRoleId.message}`,
    }).optional(),
    name: z.string({
        required_error: `${roleMissingName.statusCode} |~| ${roleMissingName.message}`,
        invalid_type_error: `${roleInvalidName.statusCode} |~| ${roleInvalidName.message}`,
    }).optional(),
    email: z.string({
        required_error: `${roleMissingEmail.statusCode} |~| ${roleMissingEmail.message}`,
        invalid_type_error: `${roleInvalidEmail.statusCode} |~| ${roleInvalidEmail.message}`,
    }).optional(),
});

export type GetUsersQuery = z.infer<typeof getUsersQuerySchema>;