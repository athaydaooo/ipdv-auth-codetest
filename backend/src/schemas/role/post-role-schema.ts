import { roleInvalidDescription, roleInvalidName, roleMissingDescription, roleMissingName } from "@errors/role";
import { z } from "zod";

export const postRoleBodySchema = z.object({
    name: z.string({
        required_error: `${roleMissingName.statusCode} |~| ${roleMissingName.message}`,
        invalid_type_error: `${roleInvalidName.statusCode} |~| ${roleInvalidName.message}`,
    }),
    description: z.string({
        required_error: `${roleMissingDescription.statusCode} |~| ${roleMissingDescription.message}`,
        invalid_type_error: `${roleInvalidDescription.statusCode} |~| ${roleInvalidDescription.message}`,
    }),
});
export type PostRoleBody = z.infer<typeof postRoleBodySchema>;