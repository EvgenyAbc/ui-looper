# Запуск @ui-looper/core

## Быстрый старт

```bash
cd ui-looper
npm install
npm run dev
```

После запуска:
- **MF library** → `http://localhost:3030/remoteEntry.js`
- **Demo-страница** → `http://localhost:3030` (все компоненты + переключатель темы)
- **Storybook** (отдельно) → `npm run storybook` — порт `6006`

---

## Все команды

| Команда | Что делает | Куда смотреть |
|---------|-----------|---------------|
| `npm run dev` | MF library (watch) + demo (watch) + serve | `localhost:3030` |
| `npm run storybook` | Storybook dev server | `localhost:6006` |
| `npm run build` | Production MF library | `dist/` |
| `npm run build:lib` | ESM library bundle (`@ui-looper/core`) | `dist/lib/index.js` |
| `npm run build:storybook` | Static Storybook | `storybook-static/` |
| `npm run build:all` | MF + ESM вместе | `dist/` + `dist/lib/` |
| `npm run typecheck` | TypeScript проверка | — |
| `npm run start` | Serve production (`dist/`) | `localhost:3030` |

---

## Что где лежит

```
ui-looper/
├── src/                    # Исходники компонентов
│   ├── Button/
│   ├── Modal/
│   ├── Select/
│   └── … (12 компонентов)
├── demo/
│   └── demo.tsx            # Демо-страница со всеми компонентами
├── .storybook/             # Storybook конфиг
│   ├── main.ts
│   └── preview.tsx
├── rspack.config.ts        # MF 2.0 library build
├── rspack.demo.config.ts   # Demo build (без MF)
├── rspack.lib.config.ts    # ESM library build
├── dist/                   # MF library output
└── storybook-static/       # Storybook static build
```

---

## Для разработки

1. **`npm run dev`** — основной режим. В консоли бегут три процесса:
   - `lib` — сборка MF library (watch)
   - `demo` — сборка demo-страницы (watch)
   - `serve` — статический сервер на `:3030`

2. **`npm run storybook`** — отдельный процесс для разработки компонентов в изоляции. Горячая перезагрузка через Vite.

3. После изменений в компоненте:
   - Demo: просто перезагрузить `localhost:3030`
   - Storybook: HMR сам подхватывает изменения

---

## Production сборка

```bash
npm run build:all      # MF + ESM
npm run build:storybook
```

Три артефакта:
- `dist/` — MF remote entry (для `@looper/monorepo`)
- `dist/lib/` — ESM библиотека (для npm/import)
- `storybook-static/` — статика Storybook
