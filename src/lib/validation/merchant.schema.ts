import { z } from "zod";

export const merchantStatusSchema = z.enum(["ACTIVE", "INACTIVE", "PENDING"]);

export const createMerchantSchema = z.object({
  name: z.string().min(2, "Nama merchant minimal 2 karakter").max(100),
  slug: z.string().min(2).max(100).optional(),
  logoUrl: z.string().url("URL logo tidak valid").optional().nullable(),
  websiteUrl: z.string().url("URL website tidak valid").optional().nullable(),
  status: merchantStatusSchema.default("ACTIVE"),
});

export const updateMerchantSchema = createMerchantSchema.partial();

export type CreateMerchantInput = z.infer<typeof createMerchantSchema>;
export type UpdateMerchantInput = z.infer<typeof updateMerchantSchema>;

