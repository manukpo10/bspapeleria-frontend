import type { Product } from '../types';

// The site sells courses and digital resources only. Physical products stay in the database (the admin panel still
// lists them through api.getProducts), so the storefront hides them at page level with this one rule
export function isDigitalResource(product: Pick<Product, 'category'>): boolean {
  return product.category === 'archivos-digitales';
}
