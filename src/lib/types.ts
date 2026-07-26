/** Categorias disponíveis no catálogo. */
export type ProductCategory =
  | "mesas"
  | "tabuas"
  | "bancos"
  | "cadeiras"
  | "outros";

/** Produto do catálogo Marco Veyo. */
export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category: ProductCategory;
  createdAt: string;
  updatedAt: string;
}

/** Payload para criar ou atualizar um produto. */
export interface ProductInput {
  title: string;
  description: string;
  price: number;
  image: string;
  category: ProductCategory;
}

/** Rótulos amigáveis das categorias. */
export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  mesas: "Mesas",
  tabuas: "Tábuas de Churrasco",
  bancos: "Bancos",
  cadeiras: "Cadeiras",
  outros: "Outros",
};

/** Lista ordenada de categorias para filtros e formulários. */
export const CATEGORIES: ProductCategory[] = [
  "mesas",
  "tabuas",
  "bancos",
  "cadeiras",
  "outros",
];
