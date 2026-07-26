"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type { Product, ProductCategory } from "@/lib/types";
import { CATEGORIES, CATEGORY_LABELS } from "@/lib/types";

type ProductFormProps = {
  product?: Product;
};

/**
 * Formulário de cadastro/edição de produtos na área admin.
 * @param props - Propriedades do formulário
 * @param props.product - Produto existente para edição (opcional)
 * @returns Formulário controlado com upload de imagem
 */
export function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(product?.title ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [price, setPrice] = useState(
    product ? String(product.price) : "",
  );
  const [category, setCategory] = useState<ProductCategory>(
    product?.category ?? "mesas",
  );
  const [image, setImage] = useState(product?.image ?? "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  /**
   * Envia a imagem selecionada para a API de upload.
   * @param file - Arquivo de imagem escolhido
   */
  async function handleUpload(file: File) {
    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = (await response.json()) as { url?: string; error?: string };
      if (!response.ok) throw new Error(data.error || "Falha no upload.");
      setImage(data.url || "");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro no upload.");
    } finally {
      setUploading(false);
    }
  }

  /**
   * Salva o produto (criação ou atualização).
   * @param event - Evento de submit do formulário
   */
  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      title,
      description,
      price: Number(price),
      category,
      image,
    };

    try {
      const response = await fetch(
        product ? `/api/products/${product.id}` : "/api/products",
        {
          method: product ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error || "Não foi possível salvar.");
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <label>
        Título
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          maxLength={120}
          placeholder="Ex.: Mesa de jantar rústica"
        />
      </label>

      <label>
        Descrição
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={5}
          maxLength={800}
          placeholder="Detalhes do móvel, materiais e medidas..."
        />
      </label>

      <div className="form-row">
        <label>
          Preço (R$)
          <input
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            placeholder="0,00"
          />
        </label>

        <label>
          Categoria
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as ProductCategory)}
          >
            {CATEGORIES.map((item) => (
              <option key={item} value={item}>
                {CATEGORY_LABELS[item]}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label>
        Imagem do produto
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleUpload(file);
          }}
        />
      </label>

      {uploading && <p className="form-hint">Enviando imagem...</p>}
      {image && (
        <div className="image-preview">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt="Pré-visualização" />
          <span>{image}</span>
        </div>
      )}

      {error && <p className="form-error">{error}</p>}

      <div className="form-actions">
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => router.push("/admin")}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="btn btn-gold"
          disabled={saving || uploading || !image}
        >
          {saving ? "Salvando..." : product ? "Atualizar" : "Cadastrar"}
        </button>
      </div>
    </form>
  );
}
