import { roleInvalidDescription, roleMissingName } from "@errors/role";
import { z } from "zod";

export const updateRoleSchema = z.object({
    name: z.string({
            invalid_type_error: `${roleMissingName.statusCode} |~| ${roleMissingName.message}`,
        }).optional(),
    description: z.string({
        invalid_type_error: `${roleInvalidDescription.statusCode} |~| ${roleInvalidDescription.message}`,
    }).optional(),
});
export type PutRoleBody = z.infer<typeof updateRoleSchema>;