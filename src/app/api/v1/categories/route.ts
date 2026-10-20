import { NextRequest, NextResponse } from "next/server";
import { CategoryService } from "@/services/category.service";
import { createCategorySchema } from "@/lib/validation/category.schema";

export async function GET() {
  try {
    const categories = await CategoryService.getCategories(true);
    return NextResponse.json({ data: categories });
  } catch (error: any) {
    console.error("API GET /categories error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createCategorySchema.parse(body);
    const created = await CategoryService.createCategory(validatedData);

    return NextResponse.json({ data: created }, { status: 201 });
  } catch (error: any) {
    console.error("API POST /categories error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create category" },
      { status: 400 }
    );
  }
}

