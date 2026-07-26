"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

/**
 * Formulário de login administrativo.
 * @returns Card de autenticação
 */
function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /**
   * Envia a senha para a API de autenticação.
   * @param event - Evento de submit
   */
  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error || "Falha no login.");

      const from = searchParams.get("from") || "/admin";
      router.replace(from);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao entrar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="login-card" onSubmit={handleSubmit}>
      <Image
        src="/images/logo.png"
        alt="Marco Veyo"
        width={110}
        height={110}
        priority
      />
      <h1>Área administrativa</h1>
      <p>Entre para cadastrar e gerenciar o catálogo.</p>
      <label style={{ display: "grid", gap: "0.4rem", textAlign: "left" }}>
        <span
          style={{
            color: "var(--gold)",
            fontSize: "0.8rem",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          Senha
        </span>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoFocus
          placeholder="Digite a senha"
        />
      </label>
      {error && <p className="form-error">{error}</p>}
      <button
        type="submit"
        className="btn btn-gold"
        style={{ width: "100%", marginTop: "1rem" }}
        disabled={loading}
      >
        {loading ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}

/**
 * Página de login da área administrativa.
 * @returns Tela de autenticação
 */
export default function AdminLoginPage() {
  return (
    <div className="login-page admin-shell">
      <Suspense fallback={<div className="login-card">Carregando...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
