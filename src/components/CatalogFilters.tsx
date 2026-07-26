"use client";

import Link from "next/link";
import type { ProductCategory } from "@/lib/types";
import { CATEGORIES, CATEGORY_LABELS } from "@/lib/types";

type CatalogFiltersProps = {
  active?: ProductCategory | "todos";
};

/**
 * Filtros de categoria do catálogo.
 * @param props - Propriedades do filtro
 * @param props.active - Categoria atualmente selecionada
 * @returns Navegação de filtros
 */
export function CatalogFilters({ active = "todos" }: CatalogFiltersProps) {
  return (
    <div className="catalog-filters" role="navigation" aria-label="Categorias">
      <Link
        href="/catalogo"
        className={active === "todos" ? "filter-chip is-active" : "filter-chip"}
      >
        Todos
      </Link>
      {CATEGORIES.map((category) => (
        <Link
          key={category}
          href={`/catalogo?categoria=${category}`}
          className={
            active === category ? "filter-chip is-active" : "filter-chip"
          }
        >
          {CATEGORY_LABELS[category]}
        </Link>
      ))}
    </div>
  );
}
