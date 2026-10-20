import { MerchantRepository } from "@/repositories/merchant.repository";
import { CreateMerchantInput, UpdateMerchantInput } from "@/lib/validation/merchant.schema";

export class MerchantService {
  private static generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  }

  static async getMerchants(status = "ACTIVE") {
    return MerchantRepository.findMany(status);
  }

  static async getMerchantBySlug(slug: string) {
    return MerchantRepository.findBySlug(slug);
  }

  static async createMerchant(input: CreateMerchantInput) {
    const slug = input.slug || this.generateSlug(input.name);
    return MerchantRepository.create({
      ...input,
      slug,
    });
  }

  static async updateMerchant(id: string, input: UpdateMerchantInput) {
    return MerchantRepository.update(id, input);
  }
}

