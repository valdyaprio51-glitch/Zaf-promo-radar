import { NextRequest, NextResponse } from "next/server";
import { PromoService } from "@/services/promo.service";
import { promotionFilterSchema, createPromotionSchema } from "@/lib/validation/promo.schema";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const queryParams = {
      q: searchParams.get("q") || undefined,
      category: searchParams.get("category") || undefined,
      merchant: searchParams.get("merchant") || undefined,
      status: (searchParams.get("status") as any) || "ACTIVE",
      verificationStatus: (searchParams.get("verificationStatus") as any) || undefined,
      page: searchParams.get("page") ? parseInt(searchParams.get("page")!, 10) : 1,
      limit: searchParams.get("limit") ? parseInt(searchParams.get("limit")!, 10) : 20,
      sortBy: (searchParams.get("sortBy") as any) || "newest",
    };

    const validatedFilter = promotionFilterSchema.parse(queryParams);
    const result = await PromoService.getPromotions(validatedFilter);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("API GET /promotions error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch promotions" },
      { status: 400 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createPromotionSchema.parse(body);
    const created = await PromoService.createPromotion(validatedData);

    return NextResponse.json({ data: created }, { status: 201 });
  } catch (error: any) {
    console.error("API POST /promotions error:", error);
    return NextResponse.json(
      { error: error.message || "Invalid promotion payload" },
      { status: 400 }
    );
  }
}

