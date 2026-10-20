import { NextRequest, NextResponse } from "next/server";
import { MerchantService } from "@/services/merchant.service";
import { createMerchantSchema } from "@/lib/validation/merchant.schema";

export async function GET() {
  try {
    const merchants = await MerchantService.getMerchants("ACTIVE");
    return NextResponse.json({ data: merchants });
  } catch (error: any) {
    console.error("API GET /merchants error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch merchants" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createMerchantSchema.parse(body);
    const created = await MerchantService.createMerchant(validatedData);

    return NextResponse.json({ data: created }, { status: 201 });
  } catch (error: any) {
    console.error("API POST /merchants error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create merchant" },
      { status: 400 }
    );
  }
}

