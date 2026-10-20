import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(2, "Nama kategori minimal 2 karakter").max(100),
  slug: z.string().min(2).max(100).optional(),
  parentId: z.string().uuid("Parent ID harus UUID valid").optional().nullable(),
  isActive: z.boolean().default(true),
});

export const updateCategorySchema = createCategorySchema.partial();

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;

