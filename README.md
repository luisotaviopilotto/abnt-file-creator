# ABNT_GEN

Gerador de documentos acadêmicos no padrão ABNT com preview em tempo real, exportação para PDF e colaboração via link compartilhável.

## Funcionalidades

- Editor visual com preview A4 em tempo real
- Estrutura completa: Capa, Folha de Rosto, Resumo, Sumário, Conteúdo e Referências
- Paginação automática com numeração ABNT
- Exportação para PDF (fiel ao preview via `html-to-image` + `jsPDF`)
- Compartilhamento por link — qualquer pessoa com o link pode editar
- Auto-save no banco de dados com debounce de 3 segundos
- Histórico de alterações (`change_logs`) por documento
- Importação de configuração via `ABNT_CONFIG.json`
- Suporte a fontes Arial e Times New Roman
- Blocos de conteúdo: títulos (H1/H2/H3), parágrafos, citações longas, imagens e tabelas

## Stack

- **Next.js 16** (App Router, Turbopack)
- **React 19**
- **Tailwind CSS v4**
- **Prisma 7** com **PostgreSQL** (Neon)
- **`@prisma/adapter-pg`** para conexão via driver nativo
- **`html-to-image`** + **`jsPDF`** para exportação PDF
- **`better-sqlite3`** removido — persistência 100% via Postgres

## Estrutura de Rotas

| Rota | Descrição |
|------|-----------|
| `/` | Tela inicial — criar novo documento ou importar JSON |
| `/doc/[id]` | Editor completo do documento (UUID) |
| `POST /api/documents` | Cria um novo documento no banco |
| `GET /api/documents/[id]` | Carrega o estado de um documento |
| `PATCH /api/documents/[id]` | Atualiza o documento e registra log |
| `DELETE /api/documents/[id]` | Remove o documento e seus logs |
| `GET /api/documents/[id]/logs` | Lista o histórico de alterações |

## Schema do Banco

```prisma
model Document {
  id         String      @id @default(uuid())
  state      Json        @db.JsonB
  createdAt  DateTime    @default(now())
  updatedAt  DateTime    @updatedAt
  changeLogs ChangeLog[]
}

model ChangeLog {
  id         Int      @id @default(autoincrement())
  documentId String
  document   Document @relation(fields: [documentId], references: [id], onDelete: Cascade)
  snapshot   Json     @db.JsonB
  changedAt  DateTime @default(now())
}
```

## Configuração

1. Clone o repositório e instale as dependências:

```bash
bun install
```

2. Configure o `.env` com a URL do banco Postgres (Neon ou outro):

```env
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"
```

3. Execute as migrations:

```bash
bun prisma migrate dev
```

4. Inicie o servidor de desenvolvimento:

```bash
bun dev
```

Acesse [http://localhost:3000](http://localhost:3000).
