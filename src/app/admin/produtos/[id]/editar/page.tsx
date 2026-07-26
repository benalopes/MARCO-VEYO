import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminLogoutButton } from "@/components/AdminLogoutButton";
import { ProductForm } from "@/components/ProductForm";
import { getProductById } from "@/lib/products";

type EditProductPageProps = {
  params: Promise<{ id: string }>;
};

/**
 * Página de edição de um produto existente.
 * @param props - Propriedades da página
 * @param props.params - Parâmetros com o ID do produto
 * @returns Formulário preenchido ou 404
 */
export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();

  return (
    <div className="admin-shell">
      <div className="admin-top">
        <h1>Editar produto</h1>
        <div className="admin-actions">
          <Link href="/admin" className="btn btn-ghost btn-sm">
            Voltar
          </Link>
          <AdminLogoutButton />
        </div>
      </div>
      <div className="admin-main">
        <ProductForm product={product} />
      </div>
    </div>
  );
}
