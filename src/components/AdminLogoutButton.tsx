"use client";

import { useRouter } from "next/navigation";

/**
 * Botão que encerra a sessão administrativa.
 * @returns Botão de sair
 */
export function AdminLogoutButton() {
  const router = useRouter();

  /**
   * Chama a API de logout e redireciona para o login.
   */
  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button type="button" className="btn btn-ghost btn-sm" onClick={handleLogout}>
      Sair
    </button>
  );
}
