import { NextRequest, NextResponse } from "next/server";
import { PromoService } from "@/services/promo.service";
import { updatePromotionSchema } from "@/lib/validation/promo.schema";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const promo = await PromoService.getPromotionBySlug(slug);

    if (!promo) {
      return NextResponse.json(
        { error: "Promotion not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: promo });
  } catch (error: any) {
    console.error("API GET /promotions/[slug] error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch promotion detail" },
      { status: 500 }
    );
  }
}

export async function PATCH(
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
    const validatedData = updatePromotionSchema.parse(body);
    const updated = await PromoService.updatePromotion(existing.id, validatedData);

    return NextResponse.json({ data: updated });
  } catch (error: any) {
    console.error("API PATCH /promotions/[slug] error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update promotion" },
      { status: 400 }
    );
  }
}

