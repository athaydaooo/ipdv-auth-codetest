import {
    roleInvalidEmail,
    roleInvalidName,
} from "@errors/role";
import { z } from "zod";

export const updateUserSchema = z.object({
    name: z.string({
        invalid_type_error: `${roleInvalidName.statusCode} |~| ${roleInvalidName.message}`,
    }).optional(),
    email: z.string({
        invalid_type_error: `${roleInvalidEmail.statusCode} |~| ${roleInvalidEmail.message}`,
    }).email({
        message: `${roleInvalidEmail.statusCode} |~| ${roleInvalidEmail.message}`,
    }).optional(),
    isActive: z.boolean().optional(),
});

export type UpdateUserBody = z.infer<typeof updateUserSchema>;
