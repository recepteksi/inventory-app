# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start both Express server (port 3001) + Vite dev server (port 5173) concurrently
npm run server    # Express API only, with nodemon auto-restart
npm run client    # Vite frontend only
npm run build     # Production build → dist/
npm run preview   # Preview production build locally
```

```bash
npm test          # End-to-end API tests (server must be running separately on port 3001)
```

No linter is configured. Syntax is checked automatically via the PostToolUse hook (see below).

## Production Deployment

```bash
npm install          # Install dependencies
npm run build        # Build React app → dist/
npm start            # Start Express — serves API + frontend on PORT (default 3001)
```

`PORT` environment variable overrides the default port (`PORT=8080 npm start`).

The `data/` directory is created automatically on first start. JSON files persist across restarts — back them up before updates. The `dist/` directory is gitignored; rebuild on each deploy.

## Agent Usage

**Always use specialized agents** for every non-trivial task — never work inline when an agent type fits:

- `researcher` — before touching any code: read files, trace data flow, understand dependencies
- `backend-dev` — Express routes, use cases, domain entities, repositories
- `frontend-dev` — React components, store, forms, pages, API client modules
- `tester` — run tests, write new tests, diagnose failures
- `reviewer` — audit changed files after development, before final testing
- `Explore` — broad codebase search spanning multiple files or locations
- `Plan` — design implementation strategy for any multi-step task

Run independent agents **in parallel** (single message, multiple Agent tool calls).

## Development Workflow

Follow this 5-stage process for every non-trivial change:

**1. Analysis & Research** — Read relevant files, understand the domain, identify dependencies. Never edit before reading.

**2. Development** — Make changes layer by layer (entity → usecase → route → frontend). After each server file edit, the PostToolUse hook auto-checks Node.js syntax and reports immediately.

**3. Tests** — After server changes, verify with `npm test` (start the server first: `node server/index.js &`). The test suite covers all API endpoints end-to-end.

**4. Code Review** — Re-read changed files. Confirm: domain vocabulary correct, no HTTP logic leaked into usecases, no repo logic leaked into routes, stock never goes below zero, writeLock used for all file writes.

**5. Run & Test** — Start with `npm run dev`, open `http://localhost:5173`, exercise the changed flow in the browser.

## Hooks

`.claude/settings.json` registers a `PostToolUse` hook on `Edit` and `Write`:
- **`.claude/hooks/post-edit-check.js`** — runs `node --check <file>` on any `server/*.js` file just written. Reports ✅ or ❌ inline so syntax errors surface before the next step.

## Architecture

**Full-stack DDD + Clean Architecture.** A Node.js/Express backend reads and writes JSON files on disk. A React + Vite frontend calls the API. All state lives on the server — no localStorage.

---

### Backend (`server/`)

Follows DDD layers with dependency injection via factory functions (no class instantiation, no IoC container).

```
server/
  domain/entities/          # Pure factory functions — Material.js, Worker.js, Movement.js
  domain/repositories/      # JSDoc interface contracts (no runtime code)
  infrastructure/repositories/
    writeLock.js             # Promise-chain mutex — serialises concurrent file writes
    JsonMaterialRepository.js
    JsonWorkerRepository.js
    JsonMovementRepository.js
  application/usecases/
    material/  createMaterial · updateMaterial · deleteMaterial
    worker/    createWorker · updateWorker · deleteWorker
    movement/  recordGelis · recordKullanim
  presentation/routes/
    materials.js · workers.js · movements.js   # Express routers
  index.js                  # Wires repos → use cases → routes, starts listener on port 3001
```

**Dependency flow:** `routes` → `usecases` → `entities` + `repositories`. Use cases receive repos as argument objects, not imports, so they are testable without the file system.

**Atomic stock updates:** Every movement write calls `materialRepo.updateStock()` in the same `writeLock` — stock on the material row is always the canonical value, never derived by replaying events. Both operations share the same lock so concurrent requests cannot read stale stock.

**Delete guard:** `deleteMaterial` and `deleteWorker` check movement counts before deleting. Returns HTTP 409 if movements exist.

---

### Data (`data/`)

Three plain JSON files — `materials.json`, `workers.json`, `movements.json`. Repositories create the files on first write if they don't exist. The data directory is not gitignored by default — uncomment the line in `.gitignore` if needed.

---

### Frontend (`src/`)

```
src/
  domain/entities/
    material.js   # getMalzemeAd(), stokDurum() — pure display helpers
    worker.js     # ustaInitials(), ustaAvatarHue()
  infrastructure/api/
    client.js         # apiFetch() — base fetch wrapper, JSON parse, error normalise
    materialsApi.js · workersApi.js · movementsApi.js
  application/services/   # (currently thin — api modules used directly by store)
  presentation/
    store/store.jsx   # useReducer context — async thunks call API, dispatch typed actions
    components/ui/tokens.jsx  # TOKENS object, all shared UI atoms
    pages/
      StokPage.jsx · DetayPage.jsx · UstalarPage.jsx
    forms/
      FormShell.jsx         # Shared layout + Field, TextInput, NumInput, etc.
      MalzemeSecici.jsx     # Bottom-sheet material picker
      UstaSecici.jsx        # Worker selection list
      GelisForm.jsx         # Record incoming delivery
      KullanimForm.jsx      # Record usage by worker
      YeniMalzemeForm.jsx   # Add new material to catalogue
      DuzenleMalzemeForm.jsx  # Edit material (minimum, ad/kategori/birim for diğer)
      YeniUstaForm.jsx      # Add new worker
      DuzenleUstaForm.jsx   # Edit worker
  App.jsx   # Layout shell — Sidebar, TopBar, page/route/modal state
  main.jsx  # React root, wraps in StoreProvider
```

**Navigation:** `App.jsx` holds three `useState` vars — `page` (`'stok'|'ustalar'`), `route` (`{kind:'detay',id}|null`), `modal` (`{kind,id?}|null`). Modal kinds: `gelis`, `kullanim`, `yeni-malzeme`, `duzenle-malzeme`, `yeni-usta`, `duzenle-usta`.

**Store pattern:** `useReducer` with typed action strings. Async mutations call the API first, then on success dispatch the action (pessimistic updates). The context value exposes both raw arrays (`boruFittings`, `digerMalzeme`, `ustalar`, `hareketler`) and async action functions (`addGelis`, `addKullanim`, `addMalzeme`, `editMalzeme`, `removeMalzeme`, `addUsta`, `editUsta`, `removeUsta`).

**Vite proxy:** `/api` in dev is proxied to `http://localhost:3001` — no CORS configuration needed during development.

---

### API endpoints

```
GET    /api/materials              → { boruFittings[], digerMalzeme[] }
POST   /api/materials              → 201 material  (body: grup + entity fields + baslangic)
GET    /api/materials/:id          → material
PUT    /api/materials/:id          → updated material
DELETE /api/materials/:id          → 204 | 409 if movements exist

GET    /api/workers                → ustalar[]
POST   /api/workers                → 201 worker
PUT    /api/workers/:id            → updated worker
DELETE /api/workers/:id            → 204 | 409 if movements exist

GET    /api/movements              → hareketler[]  (query: ?malzemeId= or ?ustaId=)
POST   /api/movements/gelis        → 201 { movement, updatedMaterial }
POST   /api/movements/kullanim     → 201 { movement, updatedMaterial } | 400 if insufficient stock
```

---

### Domain vocabulary (Turkish)

`stok` = stock quantity · `geliş` = incoming delivery · `kullanım` = usage · `hareket` = movement/transaction · `usta` = craftsman/worker · `malzeme` = material · `boru` = pipe · `fitting` = fitting · `çap` = diameter · `cins` = material type (Siyah/Galvaniz/Paslanmaz) · `tür` = item type (Boru/Dirsek/Tee/Manşon)

Stock status thresholds (`stokDurum` in `src/domain/entities/material.js`): `AZALDI` (red) when `stok < minimum`; `TAKİP` (amber) when `stok < minimum * 1.5`; `STOKTA` (green) otherwise.
