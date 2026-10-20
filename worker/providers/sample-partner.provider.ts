import { prisma } from "../../src/lib/db/prisma";
import { PromoService } from "../../src/services/promo.service";

export interface ExternalPromoPayload {
  externalId: string;
  merchantSlug: string;
  categorySlug: string;
  title: string;
  description: string;
  imageUrl?: string;
  originalPrice?: number;
  promoPrice?: number;
  termsText?: string;
  startAt?: Date;
  endAt?: Date;
  sourceUrl: string;
}

export class PartnerIngestionProvider {
  /**
   * Process and ingest an array of promotions from an official partner
   */
  static async ingestBatch(sourceId: string, items: ExternalPromoPayload[]) {
    const run = await prisma.ingestionRun.create({
      data: {
        sourceId,
        status: "RUNNING",
      },
    });

    let processed = 0;
    let failed = 0;

    for (const item of items) {
      try {
        // Validate date
        if (item.endAt && item.endAt.getTime() < Date.now()) {
          console.warn(`[Ingestion] Skipping expired promo: ${item.title}`);
          continue;
        }

        const merchant = await prisma.merchant.findUnique({
          where: { slug: item.merchantSlug },
        });
        const category = await prisma.category.findUnique({
          where: { slug: item.categorySlug },
        });

        if (!merchant || !category) {
          console.error(`[Ingestion] Missing merchant (${item.merchantSlug}) or category (${item.categorySlug})`);
          failed++;
          continue;
        }

        // Check deduplication by title + merchant
        const existing = await prisma.promotion.findFirst({
          where: {
            merchantId: merchant.id,
            title: item.title,
          },
        });

        if (existing) {
          // Update price or details if needed
          await PromoService.updatePromotion(existing.id, {
            originalPrice: item.originalPrice,
            promoPrice: item.promoPrice,
            endAt: item.endAt,
          });
        } else {
          await PromoService.createPromotion({
            merchantId: merchant.id,
            categoryId: category.id,
            title: item.title,
            description: item.description,
            imageUrl: item.imageUrl,
            originalPrice: item.originalPrice,
            promoPrice: item.promoPrice,
            termsText: item.termsText,
            startAt: item.startAt || new Date(),
            endAt: item.endAt,
            sourceId,
            sourceUrl: item.sourceUrl,
            status: "ACTIVE",
            verificationStatus: "VERIFIED",
          });
        }

        processed++;
      } catch (err) {
        console.error(`[Ingestion Error] Failed to process item: ${item.title}`, err);
        failed++;
      }
    }

    await prisma.ingestionRun.update({
      where: { id: run.id },
      data: {
        status: failed === 0 ? "SUCCESS" : failed === items.length ? "FAILED" : "PARTIAL",
        finishedAt: new Date(),
        recordsProcessed: processed,
        recordsFailed: failed,
      },
    });

    return { processed, failed };
  }
}

