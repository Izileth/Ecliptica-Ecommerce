// src/utils/filterAdapters.ts
import type {
  ProductFilterFormValues,
  ProductFilterApiParams,
} from "../types/type";

export class FilterAdapter {
  static toApi(filters: ProductFilterFormValues): ProductFilterApiParams {
    const result: ProductFilterApiParams = {};

    // Copia campos diretos
    if (filters.category) result.category = filters.category;
    if (filters.inStock) result.inStock = filters.inStock;
    if (filters.sortBy) result.sortBy = filters.sortBy;
    if (filters.sortOrder) result.sortOrder = filters.sortOrder;

    // Converte campos numéricos
    if (filters.minPrice) {
      const value = this.parseNumber(filters.minPrice);
      if (value !== null) result.minPrice = value;
    }

    if (filters.maxPrice) {
      const value = this.parseNumber(filters.maxPrice);
      if (value !== null) result.maxPrice = value;
    }

    return result;
  }

  private static parseNumber(value: string): number | null {
    const num = parseFloat(value);
    return isNaN(num) ? null : num;
  }
}

// Uso:
// const apiFilters = FilterAdapter.toApi(formValues);
