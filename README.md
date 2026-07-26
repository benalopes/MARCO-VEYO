# Marco Veyo — Móveis Rústicos

Site de catálogo artesanal com área administrativa para cadastro de produtos.

## Funcionalidades

- Página inicial com identidade visual da marca
- Catálogo com filtros (mesas, tábuas, bancos, cadeiras)
- Detalhe do produto com pedido via WhatsApp
- Contato com Marcos Paulo — (62) 99904-6020
- Área admin para cadastrar, editar e excluir produtos (título, descrição, preço, imagem)

## Como rodar

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Administração

- URL: `/admin`
- Senha padrão: `marcoveyo2026` (definida em `.env.local`)

Altere `ADMIN_PASSWORD` e `ADMIN_SESSION_SECRET` no arquivo `.env.local` antes de publicar.
