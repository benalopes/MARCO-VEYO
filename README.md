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

Altere `ADMIN_PASSWORD` e `ADMIN_SESSION_SECRET` antes de publicar.

## Deploy na Vercel

No ambiente serverless **não é possível gravar** em `public/` ou `data/`.  
O app usa **Vercel Blob** para persistir imagens e o catálogo JSON.

1. No projeto da Vercel: **Storage → Blob → Create / Connect**
2. Isso cria a variável `BLOB_READ_WRITE_TOKEN`
3. Configure também:
   - `ADMIN_PASSWORD`
   - `ADMIN_SESSION_SECRET`
4. Faça um novo deploy

Sem `BLOB_READ_WRITE_TOKEN`, o site abre, mas cadastros e uploads falham com mensagem orientativa.
