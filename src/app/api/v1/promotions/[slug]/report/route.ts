import { NextRequest, NextResponse } from "next/server";
import { PromoService } from "@/services/promo.service";
import { reportPromotionSchema } from "@/lib/validation/promo.schema";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const existing = await PromoService.getPromotionBySlug(slug);
    if (!existing) {
      return NextResponse.json(
        { error: "Promotion not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const validatedData = reportPromotionSchema.parse(body);
    const report = await PromoService.reportPromotion(existing.id, validatedData);

    return NextResponse.json(
      { message: "Laporan berhasil dikirim dan akan diperiksa oleh tim admin.", data: report },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("API POST /promotions/[slug]/report error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to submit promotion report" },
      { status: 400 }
    );
  }
}

