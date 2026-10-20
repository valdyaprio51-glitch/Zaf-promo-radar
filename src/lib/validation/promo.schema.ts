import { z } from "zod";

export const promotionStatusSchema = z.enum([
  "ACTIVE",
  "EXPIRING_SOON",
  "EXPIRED",
  "NEEDS_VERIFICATION",
]);

export const verificationStatusSchema = z.enum([
  "UNVERIFIED",
  "VERIFIED",
  "REJECTED",
]);

export const promotionFilterSchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(), // category slug or id
  merchant: z.string().optional(), // merchant slug or id
  status: promotionStatusSchema.optional(),
  verificationStatus: verificationStatusSchema.optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z
    .enum(["newest", "ending_soon", "discount_desc", "price_asc", "price_desc"])
    .default("newest"),
});

export const createPromotionSchema = z.object({
  merchantId: z.string().uuid("Merchant ID harus berupa UUID valid"),
  categoryId: z.string().uuid("Category ID harus berupa UUID valid"),
  title: z.string().min(5, "Judul promo minimal 5 karakter").max(200),
  slug: z.string().min(3).max(200).optional(),
  description: z.string().min(10, "Deskripsi promo minimal 10 karakter"),
  imageUrl: z.string().url("URL gambar tidak valid").optional().nullable(),
  originalPrice: z.number().int().nonnegative("Harga normal harus positif").optional().nullable(),
  promoPrice: z.number().int().nonnegative("Harga promo harus positif").optional().nullable(),
  discountPercentage: z.number().int().min(1).max(100).optional().nullable(),
  termsText: z.string().optional().nullable(),
  startAt: z.coerce.date().optional().nullable(),
  endAt: z.coerce.date().optional().nullable(),
  status: promotionStatusSchema.default("ACTIVE"),
  verificationStatus: verificationStatusSchema.default("UNVERIFIED"),
  sourceId: z.string().uuid().optional().nullable(),
  sourceUrl: z.string().url("URL sumber tidak valid").optional().nullable(),
});

export const updatePromotionSchema = createPromotionSchema.partial();

export const reportPromotionSchema = z.object({
  reportType: z.enum([
    "EXPIRED",
    "WRONG_PRICE",
    "FAKE_PROMO",
    "OUT_OF_STOCK",
    "OTHER",
  ]),
  description: z.string().min(5, "Keterangan laporan minimal 5 karakter"),
});

export type PromotionFilterInput = z.infer<typeof promotionFilterSchema>;
export type CreatePromotionInput = z.infer<typeof createPromotionSchema>;
export type UpdatePromotionInput = z.infer<typeof updatePromotionSchema>;
export type ReportPromotionInput = z.infer<typeof reportPromotionSchema>;
