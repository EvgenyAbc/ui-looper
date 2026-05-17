# @ui-looper/core

**UI component library** for the looper ecosystem — built on **Module Federation 2.0** + **Rspack**.

Компоненты живут в своём `remoteEntry.js`, распространяются через runtime-федерацию и не требуют npm-публикации или монорепозитория.

---

## Зачем это нужно

В классической архитектуре UI-библиотеки (antd, shadcn/ui) компоненты либо статически бандлятся в каждое приложение, либо публикуются в npm. В обоих случаях любое обновление требует пересборки всех consumers.

**@ui-looper/core решает это иначе:**

| Проблема | Решение |
|----------|---------|
| Обновление библиотеки → пересборка 5+ приложений | Один remoteEntry — все подхватывают мгновенно |
| Разные версии React/ReactDOM в разных приложениях | Единый singleton через shared зависимости |
| CSS-конфликты между версиями библиотеки | CSS Modules + scoped имена `uil-[hash]` |
| Дублирование кода в каждом бандле | MF runtime — код загружается один раз |
| Синхронизация версий между микросервисами | Версия библиотеки управляется централизованно |

**Итог:** библиотека работает как "живой" пакет — вы обновляете её на порту 3030, и все приложения в looper сразу получают новые компоненты. Без CI/CD, без npm publish, без пересборки.

---

## Технологический стек

| Технология | Версия | Назначение |
|------------|--------|------------|
| **Module Federation 2.0** | `@module-federation/enhanced` 2.4 | Динамическая загрузка компонентов через runtime |
| **Rspack** | 2.0 | Сборка (в 10× быстрее webpack) |
| **SWC** | builtin | Транспиляция TSX → JSX-runtime |
| **React** | 19 | UI-движок |
| **CSS Modules** | — | Изолированные стили компонентов |
| **CSS Custom Properties** | OKLCH | Дизайн-токены с поддержкой light/dark |
| **TypeScript** | 5.9 | Типизация |
| **Serve** | 14 | Статический сервер для remoteEntry |

---

## Архитектура

```
                   ┌─────────────────────────┐
                   │   @ui-looper/core        │
                   │   localhost:3030          │
                   │   remoteEntry.js          │
                   └──────────┬──────────────┘
                              │ loadRemote('ui_looper/Button')
                              │ loadRemote('ui_looper/Input')
                              │ loadRemote('ui_looper/...')
                              ▼
┌─────────────────────────────────────────────────────┐
│                  MF Runtime (shell)                  │
│  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐   │
│  │ app1   │  │ app2   │  │ app3   │  │ app4   │   │
│  └────────┘  └────────┘  └────────┘  └────────┘   │
│      Shared: React, ReactDOM, jsx-runtime          │
└─────────────────────────────────────────────────────┘
```

**Принцип:** shell регистрирует `ui-looper` как remote. Любое приложение внутри shell загружает компоненты по требованию через `loadRemote`. React и jsx-runtime — singletons, предоставленные shell. Библиотека не имеет своей копии React.

---

## Начало работы

```bash
# Установка зависимостей
npm install

# Dev режим (build --watch + serve на 3030)
npm run dev

# Production сборка
npm run build

# Запуск production сервера
npm run start

# Проверка типов
npm run typecheck
```

После запуска `npm run dev`, библиотека доступна по адресу:
- `http://localhost:3030/remoteEntry.js` — точка входа MF
- `http://localhost:3030/mf-manifest.json` — манифест exposes

---

## Доступные компоненты

### Button

Кнопка с пятью визуальными вариантами, тремя размерами, поддержкой иконок и состояния загрузки.

```tsx
import { loadRemote } from '@module-federation/enhanced/runtime';

// Загрузка в runtime (React 19 use())
const Button = await loadRemote('ui_looper/Button');
// или с Suspense:
// <Suspense><AsyncButton /></Suspense>
```

#### Props

| Prop | Тип | По умолчанию |
|------|-----|-------------|
| `variant` | `'primary' \| 'secondary' \| 'outline' \| 'ghost' \| 'danger'` | `'primary'` |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `fullWidth` | `boolean` | `false` |
| `loading` | `boolean` | `false` |
| `disabled` | `boolean` | — |
| `icon` | `ReactNode` | — |
| `iconPosition` | `'left' \| 'right'` | `'left'` |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` |
| `className` | `string` | — |
| `onClick` | `(e) => void` | — |
| + все стандартные атрибуты `<button>` | | |

#### Примеры

```tsx
<Button variant="primary" size="md">Сохранить</Button>
<Button variant="secondary" icon={<PlusIcon />}>Добавить</Button>
<Button variant="outline" size="sm">Отмена</Button>
<Button variant="ghost" icon={<TrashIcon />} iconPosition="right">Удалить</Button>
<Button variant="danger" loading disabled>Удаление…</Button>
<Button variant="primary" fullWidth>На всю ширину</Button>
```

---

## Exposes (Module Federation)

| Ключ `loadRemote(...)` | Содержимое |
|------------------------|------------|
| `ui_looper/Button` | Компонент Button |
| `ui_looper/styles/tokens.css` | Дизайн-токены (CSS custom properties) |
| `ui_looper/styles/primitives.css` | Базовые стили (reset, helper-классы) |

---

## Подключение к looper

Полная инструкция — в [CONNECT.md](./CONNECT.md).

**Кратко:**

1. Запустите `npm run dev` на порту 3030
2. Добавьте remote в `mock-menu.json` shell-приложения:
   ```json
   {
     "id": "ui-looper",
     "entry": "http://localhost:3030/remoteEntry.js",
     "route": "/ui-looper/*",
     "module": "./Button"
   }
   ```
3. Используйте компоненты в любом MF remote через `loadRemote('ui_looper/Button')`

---

## Дизайн-система

Библиотека имеет **собственную дизайн-систему**, независимую от `@looper/shared`.

**Токены** (`src/styles/tokens.css`):
- OKLCH цветовое пространство (широкий gamut, perceptual uniformity)
- 80+ CSS custom properties с префиксом `--uil-*`
- Поддержка `light` и `dark` тем через атрибут `data-theme` на `<html>`
- Полная типографика, тени, радиусы, отступы, z-index, transitions

**Принципы:**
- Никаких хардкоженных цветов в компонентах — всё через `var(--uil-*)`
- Все компоненты корректно работают в обеих темах без дополнительной настройки
- Плавные transition при переключении темы

---

## Структура проекта

```
ui-looper/
├── package.json                 # Зависимости и скрипты
├── rspack.config.ts             # Rspack + Module Federation Plugin
├── tsconfig*.json               # Конфигурация TypeScript
├── scripts/
│   └── dev.sh                   # Dev-сервер (build --watch + serve)
├── src/
│   ├── index.ts                 # Public API
│   ├── Button/                  # Компонент Button
│   │   ├── index.ts             #   Barrel export
│   │   ├── Button.tsx           #   Реализация (forwardRef)
│   │   └── Button.module.css    #   Стили (CSS Modules)
│   ├── styles/
│   │   ├── tokens.css           #   Дизайн-токены
│   │   └── primitives.css       #   Базовые стили
│   └── types/
│       └── css-modules.d.ts     # Типы для CSS Modules
├── dist/                        # Результат сборки
│   ├── remoteEntry.js           #   MF remote entry
│   ├── __federation_expose_*.js #   Компоненты
│   └── mf-manifest.json         #   Манифест
├── CONNECT.md                   # Инструкция по подключению к looper
└── README.md                    # Этот файл
```

---

## Добавление новых компонентов

```bash
# 1. Создайте директорию компонента
mkdir -p src/Input

# 2. Создайте файлы (см. Button как шаблон)
touch src/Input/Input.tsx
touch src/Input/Input.module.css
touch src/Input/index.ts

# 3. Добавьте expose в rspack.config.ts
#    exposes: {
#      './Button': './src/Button/Button.tsx',
#      './Input':  './src/Input/Input.tsx',   ← добавьте
#    }

# 4. Экспортируйте в src/index.ts
#    export { Input } from './Input';

# 5. Соберите и проверьте
npm run build
```

---

## Разработка

```bash
# Запуск в режиме разработки
npm run dev          # build --watch на 3030

# Проверка типов
npm run typecheck

# Production сборка
npm run build        # NODE_ENV=production → минификация

# Проверка production
npm run start        # serve dist на 3030
```

**Важно:** dev-режим использует `rspack build --watch` + `serve`, а не `rspack serve`. Это стандартная практика для MF remotes в looper — `rspack serve` может собрать exposes с прямыми импортами `node_modules/react/jsx-dev-runtime`, что ломает singleton React.

---

## License

MIT — внутренний проект для looper ecosystem.
