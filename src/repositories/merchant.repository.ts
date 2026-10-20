import { prisma } from "@/lib/db/prisma";
import { CreateMerchantInput, UpdateMerchantInput } from "@/lib/validation/merchant.schema";

export class MerchantRepository {
  static async findMany(status = "ACTIVE") {
    return prisma.merchant.findMany({
      where: status ? { status: status as any } : undefined,
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { promotions: true },
        },
      },
    });
  }

  static async findBySlug(slug: string) {
    return prisma.merchant.findUnique({
      where: { slug },
      include: {
        promotions: {
          where: { status: "ACTIVE" },
          orderBy: { createdAt: "desc" },
          include: { category: true },
        },
      },
    });
  }

  static async findById(id: string) {
    return prisma.merchant.findUnique({
      where: { id },
    });
  }

  static async create(data: CreateMerchantInput & { slug: string }) {
    return prisma.merchant.create({
      data,
    });
  }

  static async update(id: string, data: UpdateMerchantInput) {
    return prisma.merchant.update({
      where: { id },
      data,
    });
  }
}

