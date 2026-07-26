"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BRAND_NAME } from "@/lib/constants";

const LINKS = [
  { href: "/", label: "Início" },
  { href: "/catalogo", label: "Catálogo" },
  { href: "/contato", label: "Contato" },
];

/**
 * Cabeçalho com navegação principal e logo da marca.
 * @returns Elemento de navegação fixa
 */
export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  if (pathname.startsWith("/admin")) return null;

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link href="/" className="brand-link" onClick={() => setOpen(false)}>
          <Image
            src="/images/logo.png"
            alt={BRAND_NAME}
            width={56}
            height={56}
            className="brand-mark"
            priority
          />
          <span className="brand-text">
            <span className="brand-name">{BRAND_NAME}</span>
            <span className="brand-sub">Móveis Rústicos</span>
          </span>
        </Link>

        <button
          type="button"
          className="nav-toggle"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`main-nav ${open ? "is-open" : ""}`}>
          {LINKS.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={active ? "nav-link is-active" : "nav-link"}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
