import Link from "next/link";
import { AdminLogoutButton } from "@/components/AdminLogoutButton";
import { DeleteProductButton } from "@/components/DeleteProductButton";
import { ProductImage } from "@/components/ProductImage";
import { formatPrice, getProducts } from "@/lib/products";
import { CATEGORY_LABELS } from "@/lib/types";

export const dynamic = "force-dynamic";

/**
 * Painel administrativo com listagem e ações de CRUD.
 * @returns Dashboard de produtos
 */
export default async function AdminPage() {
  const products = await getProducts();

  return (
    <div className="admin-shell">
      <div className="admin-top">
        <h1>Catálogo — Administração</h1>
        <div className="admin-actions">
          <Link href="/" className="btn btn-ghost btn-sm">
            Ver site
          </Link>
          <Link href="/admin/produtos/novo" className="btn btn-gold btn-sm">
            Novo produto
          </Link>
          <AdminLogoutButton />
        </div>
      </div>

      <div className="admin-main">
        {products.length === 0 ? (
          <div className="empty-state">
            <p>Nenhum produto cadastrado.</p>
            <Link
              href="/admin/produtos/novo"
              className="btn btn-gold"
              style={{ marginTop: "1rem" }}
            >
              Cadastrar primeiro produto
            </Link>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Imagem</th>
                  <th>Título</th>
                  <th>Categoria</th>
                  <th>Preço</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <ProductImage
                        src={product.image}
                        alt={product.title}
                        width={56}
                        height={42}
                        className="admin-thumb"
                      />
                    </td>
                    <td style={{ color: "var(--cream)" }}>{product.title}</td>
                    <td>{CATEGORY_LABELS[product.category]}</td>
                    <td>{formatPrice(product.price)}</td>
                    <td>
                      <div className="row-actions">
                        <Link
                          href={`/admin/produtos/${product.id}/editar`}
                          className="btn btn-outline btn-sm"
                        >
                          Editar
                        </Link>
                        <DeleteProductButton
                          id={product.id}
                          title={product.title}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
