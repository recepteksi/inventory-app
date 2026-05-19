<div align="center">

# Atolyen Inventory

**A production-grade inventory management system for pipe, fitting & material warehouses.**  
Track stock, record deliveries, log worker usage — all in real time.

[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?logo=vercel&logoColor=white)](https://vercel.com/)
[![ESLint](https://img.shields.io/badge/ESLint-9-4B32C3?logo=eslint&logoColor=white)](https://eslint.org/)

</div>

---

## What it does

| Module | Description |
|--------|-------------|
| **Stock** | Catalogue of pipe fittings and general materials with live stock levels |
| **Deliveries** | Record incoming shipments — stock updates atomically |
| **Usage** | Log material consumption by craftsman — prevents negative stock |
| **Workers** | Manage the craftsman roster linked to usage history |
| **Detail View** | Full movement history per material or per worker |

Stock status is colour-coded automatically:

| Status | Condition |
|--------|-----------|
| 🔴 **LOW** | `stock < minimum` |
| 🟡 **WATCH** | `stock < minimum × 1.5` |
| 🟢 **IN STOCK** | otherwise |

---

## Tech stack

```
Frontend          React 18 · TypeScript (strict) · Vite 5
Backend           Vercel Serverless Functions (Node.js)
Database          MongoDB Atlas
Architecture      DDD + Clean Architecture (domain / application / infra / presentation)
Quality           ESLint 9 · Husky pre-commit · lint-staged · TypeScript strict
i18n              Turkish UI strings (src/i18n/tr.ts)
```

---

## Project structure

```
atolyen-inventory-app/
├── api/                         # Vercel serverless function entry points
│   ├── materials.ts / movements.ts / workers.ts
│   ├── _db.ts                   # MongoDB connection singleton
│   └── _repos.ts                # Repository factory
│
├── server/                      # Shared backend logic (DDD layers)
│   ├── domain/entities/         # Pure factory functions — Material, Worker, Movement
│   ├── domain/repositories/     # JSDoc interface contracts
│   ├── infrastructure/repositories/
│   ├── application/usecases/    # Business logic, one use-case per file
│   ├── migrations/              # One-off data migration scripts
│   └── types/index.ts           # Server-side TypeScript types
│
└── src/                         # React frontend
    ├── domain/entities/         # Pure display helpers (status, initials, avatar)
    ├── infrastructure/api/      # Typed API client modules
    ├── presentation/
    │   ├── store/store.tsx       # useReducer context + async thunks
    │   ├── pages/               # StockPage · DetailPage · WorkersPage
    │   └── forms/               # Delivery · Usage · New/Edit Material · New/Edit Worker
    ├── i18n/tr.ts               # All UI strings in one place
    ├── types/index.ts            # Frontend TypeScript types
    └── App.tsx                  # Layout shell — page / route / modal state
```

---

## API

```
GET    /api/materials              → { pipeFittings[], otherMaterials[] }
POST   /api/materials              → 201 material
GET    /api/materials/:id          → material
PUT    /api/materials/:id          → updated material
DELETE /api/materials/:id          → 204 | 409 if movements exist

GET    /api/workers                → workers[]
POST   /api/workers                → 201 worker
PUT    /api/workers/:id            → updated worker
DELETE /api/workers/:id            → 204 | 409 if movements exist

GET    /api/movements              → movements[]  (?materialId= | ?workerId=)
POST   /api/movements/delivery     → 201 { movement, updatedMaterial }
POST   /api/movements/usage        → 201 { movement, updatedMaterial } | 400 if insufficient stock
```

---

## Local development

### Prerequisites

- Node.js 18+
- A [MongoDB Atlas](https://www.mongodb.com/atlas) free cluster

### Setup

```bash
git clone https://github.com/atolyen/atolyen-inventory-app.git
cd atolyen-inventory-app
npm install
```

Create `.env.local`:

```env
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<dbname>
```

```bash
npm run dev        # Vite dev server on http://localhost:5173
```

### Available scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Type-check + production build → `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run typecheck` | TypeScript strict check only |
| `npm run lint` | ESLint across `src/`, `api/`, `server/` |
| `npm run lint:fix` | Auto-fix lint issues |

---

## Deployment

The app is deployed as a Vite SPA + Vercel Serverless Functions — no dedicated server required.

```bash
# Install Vercel CLI
npm i -g vercel

# Link project and set env var
vercel env add MONGODB_URI

# Deploy to production
vercel --prod
```

The `vercel.json` at the root configures `outputDirectory: dist` and `framework: vite` — Vercel picks up the `api/` directory automatically.

---

## Architecture notes

**Atomic stock updates** — every movement write calls `materialRepo.updateStock()` in the same database operation, so concurrent requests can never read stale stock.

**Delete guard** — `deleteMaterial` and `deleteWorker` check movement counts before deleting. Returns HTTP 409 if movements exist.

**Pessimistic UI updates** — the store calls the API first; on success it dispatches the action. The UI never shows state that hasn't been confirmed by the server.

**Pre-commit gate** — Husky runs `lint-staged` on every commit. TypeScript files in `src/`, `api/`, and `server/` must pass ESLint with zero warnings before a commit is accepted.

---

## Domain vocabulary

> The domain and database fields use English identifiers. The UI is in Turkish.

| Turkish | English equivalent |
|---------|--------------------|
| stok | stock quantity |
| geliş | delivery (incoming) |
| kullanım | usage |
| hareket | movement / transaction |
| usta | craftsman / worker |
| malzeme | material |
| boru | pipe |
| çap | diameter |
| cins | material type (Black / Galvanized / Stainless) |
| tür | item type (Pipe / Elbow / Tee / Coupling) |

---

<div align="center">

Built with TypeScript · React · MongoDB · Vercel

</div>
