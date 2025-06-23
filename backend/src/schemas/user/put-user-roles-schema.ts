import { roleInvalidPassword, roleMissingPassword } from "@errors/role";
import { z } from "zod";

export const updateUserPasswordSchema = z.object({
    newPassword: z.string({
        required_error: `${roleMissingPassword.statusCode} |~| ${roleMissingPassword.message}`,
        invalid_type_error: `${roleInvalidPassword.statusCode} |~| ${roleInvalidPassword.message}`,
    }).min(6, {
        message: `${roleInvalidPassword.statusCode} |~| ${roleInvalidPassword.message}`,
    }),
});

export type UpdateUserPasswordBody = z.infer<typeof updateUserPasswordSchema>;
