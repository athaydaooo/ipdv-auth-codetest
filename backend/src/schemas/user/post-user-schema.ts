import {
    roleInvalidEmail,
    roleInvalidName,
    roleInvalidPassword,
    roleInvalidRoleIds,
    roleMissingEmail,
    roleMissingName,
    roleMissingPassword,
    roleMissingRoleIds
} from "@errors/role";
import { z } from "zod";

export const postUserSchema = z.object({
    name: z.string({
        required_error: `${roleMissingName.statusCode} |~| ${roleMissingName.message}`,
        invalid_type_error: `${roleInvalidName.statusCode} |~| ${roleInvalidName.message}`,
    }),
    email: z.string({
        required_error: `${roleMissingEmail.statusCode} |~| ${roleMissingEmail.message}`,
        invalid_type_error: `${roleInvalidEmail.statusCode} |~| ${roleInvalidEmail.message}`,
    }).email({
        message: `${roleInvalidEmail.statusCode} |~| ${roleInvalidEmail.message}`,
    }),
    password: z.string({
        required_error: `${roleMissingPassword.statusCode} |~| ${roleMissingPassword.message}`,
        invalid_type_error: `${roleInvalidPassword.statusCode} |~| ${roleInvalidPassword.message}`,
    }),
    roleIds: z.array(z.string({
        required_error: `${roleMissingRoleIds.statusCode} |~| ${roleMissingRoleIds.message}`,
        invalid_type_error: `${roleInvalidRoleIds.statusCode} |~| ${roleInvalidRoleIds.message}`,
    }), {
        required_error: `${roleMissingRoleIds.statusCode} |~| ${roleMissingRoleIds.message}`,
        invalid_type_error: `${roleInvalidRoleIds.statusCode} |~| ${roleInvalidRoleIds.message}`,
    }),
});

export type PostUserBody = z.infer<typeof postUserSchema>;