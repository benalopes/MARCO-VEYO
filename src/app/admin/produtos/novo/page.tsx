import Link from "next/link";
import { ProductForm } from "@/components/ProductForm";
import { AdminLogoutButton } from "@/components/AdminLogoutButton";

/**
 * Página de cadastro de novo produto.
 * @returns Formulário de criação
 */
export default function NewProductPage() {
  return (
    <div className="admin-shell">
      <div className="admin-top">
        <h1>Novo produto</h1>
        <div className="admin-actions">
          <Link href="/admin" className="btn btn-ghost btn-sm">
            Voltar
          </Link>
          <AdminLogoutButton />
        </div>
      </div>
      <div className="admin-main">
        <ProductForm />
      </div>
    </div>
  );
}
