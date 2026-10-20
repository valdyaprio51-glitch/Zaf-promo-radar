import { prisma } from "@/lib/db/prisma";
import {
  PromotionFilterInput,
  CreatePromotionInput,
  UpdatePromotionInput,
} from "@/lib/validation/promo.schema";
import { Prisma } from "@prisma/client";

export class PromoRepository {
  /**
   * Find promotions with multi-filter, search, and pagination
   */
  static async findMany(params: PromotionFilterInput) {
    const {
      q,
      category,
      merchant,
      status,
      verificationStatus,
      page,
      limit,
      sortBy,
    } = params;

    const skip = (page - 1) * limit;

    const where: Prisma.PromotionWhereInput = {};

    // Filter status
    if (status) {
      where.status = status;
    }

    // Filter verification status
    if (verificationStatus) {
      where.verificationStatus = verificationStatus;
    }

    // Filter category (by slug or UUID)
    if (category) {
      where.category = {
        OR: [{ slug: category }, { id: category }],
      };
    }

    // Filter merchant (by slug or UUID)
    if (merchant) {
      where.merchant = {
        OR: [{ slug: merchant }, { id: merchant }],
      };
    }

    // Search query on title, description, or terms
    if (q && q.trim().length > 0) {
      const searchTerms = q.trim();
      where.OR = [
        { title: { contains: searchTerms, mode: "insensitive" } },
        { description: { contains: searchTerms, mode: "insensitive" } },
        { termsText: { contains: searchTerms, mode: "insensitive" } },
        { merchant: { name: { contains: searchTerms, mode: "insensitive" } } },
        { category: { name: { contains: searchTerms, mode: "insensitive" } } },
      ];
    }

    // Sort order
    let orderBy: Prisma.PromotionOrderByWithRelationInput = { createdAt: "desc" };
    switch (sortBy) {
      case "ending_soon":
        orderBy = { endAt: "asc" };
        break;
      case "discount_desc":
        orderBy = { discountPercentage: "desc" };
        break;
      case "price_asc":
        orderBy = { promoPrice: "asc" };
        break;
      case "price_desc":
        orderBy = { promoPrice: "desc" };
        break;
      case "newest":
      default:
        orderBy = { createdAt: "desc" };
        break;
    }

    const [total, data] = await Promise.all([
      prisma.promotion.count({ where }),
      prisma.promotion.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          merchant: {
            select: { id: true, name: true, slug: true, logoUrl: true },
          },
          category: {
            select: { id: true, name: true, slug: true },
          },
        },
      }),
    ]);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Find a single promotion by its unique slug
   */
  static async findBySlug(slug: string) {
    return prisma.promotion.findUnique({
      where: { slug },
      include: {
        merchant: true,
        category: true,
        source: true,
        priceHistory: {
          orderBy: { capturedAt: "asc" },
        },
      },
    });
  }

  /**
   * Find a single promotion by ID
   */
  static async findById(id: string) {
    return prisma.promotion.findUnique({
      where: { id },
      include: {
        merchant: true,
        category: true,
        source: true,
        priceHistory: {
          orderBy: { capturedAt: "asc" },
        },
      },
    });
  }

  /**
   * Create a new promotion
   */
  static async create(data: CreatePromotionInput & { slug: string }) {
    return prisma.promotion.create({
      data: {
        ...data,
      },
      include: {
        merchant: true,
        category: true,
      },
    });
  }

  /**
   * Update promotion
   */
  static async update(id: string, data: UpdatePromotionInput) {
    return prisma.promotion.update({
      where: { id },
      data,
      include: {
        merchant: true,
        category: true,
      },
    });
  }

  /**
   * Update promotion verification status
   */
  static async updateVerificationStatus(
    id: string,
    verificationStatus: "VERIFIED" | "REJECTED" | "UNVERIFIED"
  ) {
    return prisma.promotion.update({
      where: { id },
      data: {
        verificationStatus,
        lastVerifiedAt: new Date(),
      },
    });
  }

  /**
   * Deactivate expired promotions
   */
  static async deactivateExpired() {
    const now = new Date();
    return prisma.promotion.updateMany({
      where: {
        endAt: { lt: now },
        status: { in: ["ACTIVE", "EXPIRING_SOON"] },
      },
      data: {
        status: "EXPIRED",
      },
    });
  }

  /**
   * Get search suggestions / autocomplete
   */
  static async getSearchSuggestions(query: string, limit = 5) {
    const suggestions = await prisma.promotion.findMany({
      where: {
        title: { contains: query, mode: "insensitive" },
        status: "ACTIVE",
      },
      select: {
        id: true,
        title: true,
        slug: true,
        merchant: { select: { name: true } },
      },
      take: limit,
    });

    return suggestions;
  }
}

