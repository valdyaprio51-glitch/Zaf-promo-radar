import { CategoryRepository } from "@/repositories/category.repository";
import { CreateCategoryInput, UpdateCategoryInput } from "@/lib/validation/category.schema";

export class CategoryService {
  private static generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  }

  static async getCategories(isActive = true) {
    return CategoryRepository.findMany(isActive);
  }

  static async getCategoryBySlug(slug: string) {
    return CategoryRepository.findBySlug(slug);
  }

  static async createCategory(input: CreateCategoryInput) {
    const slug = input.slug || this.generateSlug(input.name);
    return CategoryRepository.create({
      ...input,
      slug,
    });
  }

  static async updateCategory(id: string, input: UpdateCategoryInput) {
    return CategoryRepository.update(id, input);
  }
}

