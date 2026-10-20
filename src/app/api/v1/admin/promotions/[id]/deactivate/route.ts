import { NextRequest, NextResponse } from "next/server";
import { VerificationService } from "@/services/verification.service";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deactivated = await VerificationService.deactivatePromotion(id);

    return NextResponse.json({
      message: "Promo berhasil dinonaktifkan",
      data: deactivated,
    });
  } catch (error: any) {
    console.error("API POST /admin/promotions/[id]/deactivate error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to deactivate promotion" },
      { status: 400 }
    );
  }
}

