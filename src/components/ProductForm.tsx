"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { fileToCompressedDataUrl } from "@/lib/image-client";
import type { Product, ProductCategory } from "@/lib/types";
import { CATEGORIES, CATEGORY_LABELS } from "@/lib/types";

type ProductFormProps = {
  product?: Product;
};

/**
 * Formulário de cadastro/edição de produtos na área admin.
 * @param props - Propriedades do formulário
 * @param props.product - Produto existente para edição (opcional)
 * @returns Formulário controlado com imagem gravada no JSON do produto
 */
export function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(product?.title ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [price, setPrice] = useState(product ? String(product.price) : "");
  const [category, setCategory] = useState<ProductCategory>(
    product?.category ?? "mesas",
  );
  const [image, setImage] = useState(product?.image ?? "");
  const [preview, setPreview] = useState(product?.image ?? "");
  const [processing, setProcessing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  /**
   * Lê e compacta a imagem selecionada para envio junto do produto.
   * @param file - Arquivo de imagem escolhido
   */
  async function handleImageSelect(file: File) {
    setProcessing(true);
    setError("");
    try {
      const dataUrl = await fileToCompressedDataUrl(file);
      setImage(dataUrl);
      setPreview(dataUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao ler a imagem.");
      setImage(product?.image ?? "");
      setPreview(product?.image ?? "");
    } finally {
      setProcessing(false);
    }
  }

  /**
   * Salva o produto e a imagem no servidor (arquivo + caminho no JSON).
   * @param event - Evento de submit do formulário
   */
  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");

    if (!image) {
      setError("Selecione uma imagem do produto.");
      setSaving(false);
      return;
    }

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
      const data = (await response.json()) as { error?: string; image?: string };
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
          accept="image/png,image/jpeg,image/webp,image/gif,.jpg,.jpeg,.png,.webp,.gif"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleImageSelect(file);
          }}
        />
      </label>

      {processing && <p className="form-hint">Processando imagem...</p>}
      {preview && (
        <div className="image-preview">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="Pré-visualização" />
          <span>
            {preview.startsWith("data:")
              ? "Imagem pronta para gravar no cadastro"
              : preview}
          </span>
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
          disabled={saving || processing || !image}
        >
          {saving ? "Salvando..." : product ? "Atualizar" : "Cadastrar"}
        </button>
      </div>
    </form>
  );
}
