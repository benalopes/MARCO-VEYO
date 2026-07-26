"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  dataUrlToBlob,
  fileToCompressedDataUrl,
} from "@/lib/image-client";
import { readJsonSafe } from "@/lib/http";
import type { Product, ProductCategory } from "@/lib/types";
import { CATEGORIES, CATEGORY_LABELS } from "@/lib/types";

type ProductFormProps = {
  product?: Product;
};

/**
 * Formulário de cadastro/edição de produtos na área admin.
 * @param props - Propriedades do formulário
 * @param props.product - Produto existente para edição (opcional)
 * @returns Formulário controlado com upload multipart da imagem
 */
export function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(product?.title ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [price, setPrice] = useState(product ? String(product.price) : "");
  const [category, setCategory] = useState<ProductCategory>(
    product?.category ?? "mesas",
  );
  const [imagePath, setImagePath] = useState(
    product?.image && !product.image.startsWith("data:") ? product.image : "",
  );
  const [preview, setPreview] = useState(product?.image ?? "");
  const [pendingDataUrl, setPendingDataUrl] = useState("");
  const [processing, setProcessing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  /**
   * Lê e compacta a imagem selecionada para pré-visualização.
   * @param file - Arquivo de imagem escolhido
   */
  async function handleImageSelect(file: File) {
    setProcessing(true);
    setError("");
    try {
      const dataUrl = await fileToCompressedDataUrl(file);
      setPendingDataUrl(dataUrl);
      setPreview(dataUrl);
      setImagePath("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao ler a imagem.");
      setPendingDataUrl("");
      setPreview(product?.image ?? "");
      setImagePath(
        product?.image && !product.image.startsWith("data:")
          ? product.image
          : "",
      );
    } finally {
      setProcessing(false);
    }
  }

  /**
   * Envia a imagem pendente via multipart e retorna o caminho público.
   * @returns Caminho da imagem em `/uploads/...`
   */
  async function uploadPendingImage(): Promise<string> {
    if (imagePath) return imagePath;
    if (!pendingDataUrl) {
      throw new Error("Selecione uma imagem do produto.");
    }

    const blob = dataUrlToBlob(pendingDataUrl);
    const formData = new FormData();
    formData.append("file", blob, `produto-${Date.now()}.jpg`);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    const data = await readJsonSafe<{ url?: string; error?: string }>(response);
    if (!response.ok || !data.url) {
      throw new Error(data.error || "Falha no upload da imagem.");
    }
    return data.url;
  }

  /**
   * Faz upload da imagem e salva o produto com o caminho no JSON.
   * @param event - Evento de submit do formulário
   */
  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const uploadedPath = await uploadPendingImage();
      setImagePath(uploadedPath);

      const response = await fetch(
        product ? `/api/products/${product.id}` : "/api/products",
        {
          method: product ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            description,
            price: Number(price),
            category,
            image: uploadedPath,
          }),
        },
      );

      const data = await readJsonSafe<{ error?: string }>(response);
      if (!response.ok) {
        throw new Error(data.error || "Não foi possível salvar o produto.");
      }

      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar.");
    } finally {
      setSaving(false);
    }
  }

  const hasImage = Boolean(imagePath || pendingDataUrl);

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
            {pendingDataUrl
              ? "Imagem pronta — será gravada ao cadastrar"
              : imagePath}
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
          disabled={saving || processing || !hasImage}
        >
          {saving ? "Salvando..." : product ? "Atualizar" : "Cadastrar"}
        </button>
      </div>
    </form>
  );
}
