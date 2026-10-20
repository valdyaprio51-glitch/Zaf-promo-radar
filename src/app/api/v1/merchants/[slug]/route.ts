import { NextRequest, NextResponse } from "next/server";
import { MerchantService } from "@/services/merchant.service";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const merchant = await MerchantService.getMerchantBySlug(slug);

    if (!merchant) {
      return NextResponse.json(
        { error: "Merchant not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: merchant });
  } catch (error: any) {
    console.error("API GET /merchants/[slug] error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch merchant detail" },
      { status: 500 }
    );
  }
}

