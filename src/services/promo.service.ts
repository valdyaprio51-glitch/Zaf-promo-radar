import { PromoRepository } from "@/repositories/promo.repository";
import {
  PromotionFilterInput,
  CreatePromotionInput,
  UpdatePromotionInput,
  ReportPromotionInput,
} from "@/lib/validation/promo.schema";
import { calculateDiscountPercentage, resolvePromoStatus } from "@/lib/utils";
import { prisma } from "@/lib/db/prisma";

export class PromoService {
  /**
   * Helper to generate URL slug from text
   */
  private static generateSlug(title: string): string {
    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    const randomSuffix = Math.random().toString(36).substring(2, 6);
    return `${baseSlug}-${randomSuffix}`;
  }

  /**
   * Get promotions with filter and dynamic status calculation
   */
  static async getPromotions(filter: PromotionFilterInput) {
    const result = await PromoRepository.findMany(filter);

    // Dynamic enhancement: adjust status if ending soon
    const enhancedData = result.data.map((promo) => ({
      ...promo,
      displayStatus: resolvePromoStatus(promo.status, promo.endAt),
    }));

    return {
      ...result,
      data: enhancedData,
    };
  }

  /**
   * Get single promo by slug
   */
  static async getPromotionBySlug(slug: string) {
    const promo = await PromoRepository.findBySlug(slug);
    if (!promo) return null;

    return {
      ...promo,
      displayStatus: resolvePromoStatus(promo.status, promo.endAt),
    };
  }

  /**
   * Create a new promotion with verified pricing logic
   */
  static async createPromotion(input: CreatePromotionInput) {
    const slug = input.slug || this.generateSlug(input.title);

    // Calculate discount percentage if not provided
    let discount = input.discountPercentage;
    if (!discount && input.originalPrice && input.promoPrice) {
      discount = calculateDiscountPercentage(input.originalPrice, input.promoPrice) || undefined;
    }

    const created = await PromoRepository.create({
      ...input,
      slug,
      discountPercentage: discount,
    });

    // Record initial price history if price is provided
    if (input.promoPrice || input.originalPrice) {
      await prisma.promotionPriceHistory.create({
        data: {
          promotionId: created.id,
          originalPrice: input.originalPrice,
          promoPrice: input.promoPrice,
          sourceReference: input.sourceUrl || "Manual Input",
        },
      });
    }

    return created;
  }

  /**
   * Update promotion and record price change if price changed
   */
  static async updatePromotion(id: string, input: UpdatePromotionInput) {
    const existing = await PromoRepository.findById(id);
    if (!existing) {
      throw new Error("Promotion not found");
    }

    // Check price changes to append history
    const priceChanged =
      (input.promoPrice !== undefined && input.promoPrice !== existing.promoPrice) ||
      (input.originalPrice !== undefined && input.originalPrice !== existing.originalPrice);

    const updated = await PromoRepository.update(id, input);

    if (priceChanged) {
      await prisma.promotionPriceHistory.create({
        data: {
          promotionId: id,
          originalPrice: input.originalPrice ?? existing.originalPrice,
          promoPrice: input.promoPrice ?? existing.promoPrice,
          sourceReference: input.sourceUrl || existing.sourceUrl,
        },
      });
    }

    return updated;
  }

  /**
   * Submit community report for promotion
   */
  static async reportPromotion(
    promotionId: string,
    input: ReportPromotionInput,
    userId?: string
  ) {
    return prisma.promotionReport.create({
      data: {
        promotionId,
        userId: userId || null,
        reportType: input.reportType,
        description: input.description,
        status: "PENDING",
      },
    });
  }

  /**
   * Search suggestions
   */
  static async getSearchSuggestions(query: string) {
    if (!query || query.trim().length === 0) return [];
    return PromoRepository.getSearchSuggestions(query.trim());
  }
}

