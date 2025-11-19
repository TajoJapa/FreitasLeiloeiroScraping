# Freitas Leiloeiro Scraping Suite

Aplicação full-stack (NestJS + React) para executar um spider que coleta a "Descrição completa" dos lotes de veículos publicados no site [freitasleiloeiro.com.br](https://www.freitasleiloeiro.com.br/) e disponibiliza um histórico pesquisável.

## Estrutura de pastas

```
.
├── backend/   # API NestJS + scraper + persistência PostgreSQL (TypeORM)
├── frontend/  # SPA React + Vite para consulta dos logs
└── README.md
```

## Backend (NestJS)

### Principais módulos

- `logs`: entidade `LotLog`, filtros, regras anti-duplicação por hash (sha256) e endpoints REST para consulta.
- `scraper`: serviço que faz scraping usando `axios + cheerio` (mais leve que controlar um browser completo). Seletores estão concentrados em um objeto único para facilitar ajustes futuros.

O banco escolhido foi **PostgreSQL** por ser robusto para consultas com filtros e paginação. TypeORM está configurado com `synchronize: true` para facilitar o setup local (use migrações em produção).

### Variáveis de ambiente (`backend/.env`)

```
PORT=3000
DATABASE_URL=postgres://postgres:postgres@localhost:5432/freitas
BASE_URL=https://www.freitasleiloeiro.com.br
```

### Comandos

```bash
cd backend
npm install
npm run start:dev # sobe http://localhost:3000/api
```

### Endpoints principais

| Método | Rota | Descrição |
| ------ | ---- | --------- |
| `POST` | `/api/scraper/run` | Dispara manualmente o spider. Útil para execuções ad-hoc ou gatilhos futuros de agendamento. |
| `GET` | `/api/logs` | Lista paginada com filtros (`leilaoId`, `loteNumero`, `descricao`, `dataInicial`, `dataFinal`, `page`, `limit`). |
| `GET` | `/api/logs/:id` | Retorna um log específico. |
| `GET` | `/api/logs/last-by-lote?leilaoId=7517&loteNumero=84` | Último log registrado para o lote informado. |

### Exemplos de requisição

```bash
# Executar spider
curl -X POST http://localhost:3000/api/scraper/run

# Listar logs com filtros
curl "http://localhost:3000/api/logs?leilaoId=7517&descricao=GOL&page=1&limit=10"

# Buscar log por ID
curl http://localhost:3000/api/logs/UUID_AQUI
```

## Frontend (React + Vite)

### Variáveis (`frontend/.env`)

```
VITE_API_URL=http://localhost:3000/api
```

### Comandos

```bash
cd frontend
npm install
npm run dev # http://localhost:5173
```

A SPA oferece:

- Página de listagem com filtros rápidos (Leilão, Lote e texto na descrição) e paginação.
- Página de detalhes com visualização completa do log e link direto para o lote.

## Sobre o spider

- Utiliza `axios` + `cheerio` para reduzir dependências e facilitar customização de seletores.
- Comentários no serviço destacam os seletores principais. Toda a lógica está em `backend/src/scraper/scraper.service.ts`.
- Respeita boas práticas básicas: *user-agent* identificável, delays aleatórios entre requisições (1-3s) e tratamento de erros sem interromper a execução inteira.
- Para futuras execuções agendadas basta importar `@nestjs/schedule` no módulo do scraper e chamar `runSpider()` em um job cron.

## Observações

- Execute o backend antes do frontend para que a SPA consiga consumir a API.
- Ajuste `BASE_URL` caso deseje apontar para ambientes de teste ou mocks.
- Lembre-se de conferir o `robots.txt` do site antes de rodar o spider em produção.
