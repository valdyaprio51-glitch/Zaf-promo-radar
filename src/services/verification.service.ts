import { PromoRepository } from "@/repositories/promo.repository";
import { prisma } from "@/lib/db/prisma";

export class VerificationService {
  /**
   * Admin verify a promotion
   */
  static async verifyPromotion(id: string) {
    return PromoRepository.updateVerificationStatus(id, "VERIFIED");
  }

  /**
   * Admin reject a promotion
   */
  static async rejectPromotion(id: string) {
    return PromoRepository.updateVerificationStatus(id, "REJECTED");
  }

  /**
   * Admin deactivate a promotion
   */
  static async deactivatePromotion(id: string) {
    return PromoRepository.update(id, {
      status: "EXPIRED",
    });
  }

  /**
   * Auto-expire promotions whose endAt has passed
   */
  static async checkAndDeactivateExpired() {
    const result = await PromoRepository.deactivateExpired();
    return {
      success: true,
      countDeactivated: result.count,
      timestamp: new Date(),
    };
  }

  /**
   * Get list of reports for admin review
   */
  static async getPendingReports() {
    return prisma.promotionReport.findMany({
      where: { status: "PENDING" },
      include: {
        promotion: {
          select: { id: true, title: true, slug: true, status: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }
}

