import { NextRequest, NextResponse } from "next/server";
import { PromoService } from "@/services/promo.service";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") || "";

    const suggestions = await PromoService.getSearchSuggestions(q);
    return NextResponse.json({ data: suggestions });
  } catch (error: any) {
    console.error("API GET /search/suggestions error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch suggestions" },
      { status: 500 }
    );
  }
}

