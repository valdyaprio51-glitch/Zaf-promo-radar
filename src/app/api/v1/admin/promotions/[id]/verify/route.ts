import { NextRequest, NextResponse } from "next/server";
import { VerificationService } from "@/services/verification.service";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const verified = await VerificationService.verifyPromotion(id);

    return NextResponse.json({
      message: "Promo berhasil diverifikasi",
      data: verified,
    });
  } catch (error: any) {
    console.error("API POST /admin/promotions/[id]/verify error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to verify promotion" },
      { status: 400 }
    );
  }
}

