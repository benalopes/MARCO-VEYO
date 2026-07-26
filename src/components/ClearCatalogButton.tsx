"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { readJsonSafe } from "@/lib/http";

/**
 * Botão para esvaziar todo o catálogo na área administrativa.
 * @returns Botão de limpeza da base
 */
export function ClearCatalogButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  /**
   * Confirma e limpa todos os produtos cadastrados.
   */
  async function handleClear() {
    const confirmed = window.confirm(
      "Limpar todo o catálogo? Todos os produtos serão removidos e a base ficará vazia para novos cadastros.",
    );
    if (!confirmed) return;

    setLoading(true);
    try {
      const response = await fetch("/api/products/clear", { method: "POST" });
      const data = await readJsonSafe<{ error?: string }>(response);
      if (!response.ok) {
        throw new Error(data.error || "Falha ao limpar o catálogo.");
      }
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao limpar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      className="btn btn-danger btn-sm"
      onClick={handleClear}
      disabled={loading}
    >
      {loading ? "Limpando..." : "Limpar catálogo"}
    </button>
  );
}
