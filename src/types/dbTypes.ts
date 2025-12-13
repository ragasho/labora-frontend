import { z } from "zod";

export const CategorySchema = z.object({
    id: z.string(),
    name: z.string(),
    image: z.string(),
    icon: z.string(),
});

export type Category = z.infer<typeof CategorySchema>;
