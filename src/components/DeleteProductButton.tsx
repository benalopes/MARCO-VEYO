"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type DeleteProductButtonProps = {
  id: string;
  title: string;
};

/**
 * Botão para excluir um produto do catálogo.
 * @param props - Propriedades do botão
 * @param props.id - ID do produto
 * @param props.title - Título usado na confirmação
 * @returns Botão de exclusão
 */
export function DeleteProductButton({ id, title }: DeleteProductButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  /**
   * Confirma e remove o produto via API.
   */
  async function handleDelete() {
    const confirmed = window.confirm(
      `Excluir o produto "${title}"? Esta ação não pode ser desfeita.`,
    );
    if (!confirmed) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        throw new Error(data.error || "Falha ao excluir.");
      }
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao excluir.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      className="btn btn-danger btn-sm"
      onClick={handleDelete}
      disabled={loading}
    >
      {loading ? "..." : "Excluir"}
    </button>
  );
}
