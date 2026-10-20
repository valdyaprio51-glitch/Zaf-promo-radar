import { prisma } from "@/lib/db/prisma";
import { CreateCategoryInput, UpdateCategoryInput } from "@/lib/validation/category.schema";

export class CategoryRepository {
  static async findMany(isActive = true) {
    return prisma.category.findMany({
      where: isActive ? { isActive: true } : undefined,
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { promotions: true },
        },
      },
    });
  }

  static async findBySlug(slug: string) {
    return prisma.category.findUnique({
      where: { slug },
      include: {
        children: true,
        promotions: {
          where: { status: "ACTIVE" },
          orderBy: { createdAt: "desc" },
          include: { merchant: true },
        },
      },
    });
  }

  static async findById(id: string) {
    return prisma.category.findUnique({
      where: { id },
    });
  }

  static async create(data: CreateCategoryInput & { slug: string }) {
    return prisma.category.create({
      data,
    });
  }

  static async update(id: string, data: UpdateCategoryInput) {
    return prisma.category.update({
      where: { id },
      data,
    });
  }
}

