import { roleInvalidDescription, roleInvalidName } from "@errors/role";
import { z } from "zod";

export const getRolesSchema = z.object({
    name: z.string({
            invalid_type_error: `${roleInvalidName.statusCode} |~| ${roleInvalidName.message}`,
        }).optional(),
    description: z.string({
        invalid_type_error: `${roleInvalidDescription.statusCode} |~| ${roleInvalidDescription.message}`,
    }).optional(),
});
export type GetRolesQuery = z.infer<typeof getRolesSchema>;