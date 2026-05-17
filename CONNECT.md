# Connect @ui-looper/core to @looper/monorepo

> Инструкция по подключению UI-компонентов из `@ui-looper/core` к приложениям
> в монорепозитории `@looper/monorepo` через Module Federation 2.0.

---

## Быстрый старт (3 шага)

```bash
# 1. Установите зависимости ui-looper
cd ui-looper && npm install

# 2. Запустите библиотеку на 3030 порту
npm run dev

# 3. В looper добавьте remote и используйте компоненты
```

---

## Подключение к looper

### Способ A: Через mock-menu.json (shell, рекомендуется)

Добавьте `ui-looper` как remote в конфигурацию shell-приложения:

**1. `packages/shell/public/mock-menu.json`**

```json
{
  "shared": { "id": "shared", "entry": "" },
  "apps": [
    // ... существующие app1, app2, app3 ...
    {
      "id": "ui-looper",
      "name": "UI Looper",
      "entry": "http://localhost:3030/remoteEntry.js",
      "route": "/ui-looper/*",
      "module": "./Button",
      "icon": "puzzle",
      "features": [],
      "permissions": ["admin", "user"]
    }
  ]
}
```

**2. `packages/shell/src/loaders/mfRuntimeShared.ts`** (если существует)
или в `shellRuntime.ts` — init сам зарегистрирует remote по entry.

Shell автоматически загрузит remoteEntry.js при старте. Компоненты доступны
через `loadRemote('ui-looper/Button')` в любом remote-приложении.

### Способ B: Динамическая регистрация из любого remote-приложения

Если нужно подключить библиотеку только в конкретном приложении (например, app2):

```tsx
import { registerRemotes, loadRemote } from '@module-federation/enhanced/runtime';
import { Suspense, use, useMemo, type ComponentType } from 'react';

// 1. Зарегистрировать remote (однократно)
registerRemotes([
  {
    name: 'ui-looper',
    entry: 'http://localhost:3030/remoteEntry.js',
    alias: 'ui-looper',
  },
]);

// 2. Загрузить компонент
function MyButtonWrapper() {
  const loadPromise = useMemo(
    () => loadRemote<{ default: ComponentType }>('ui-looper/Button'),
    [],
  );
  const Module = use(loadPromise);
  if (!Module) return null;
  return <Module.default variant="primary">Click me</Module.default>;
}

// 3. Использовать с Suspense
function MyPage() {
  return (
    <Suspense fallback={<div>Loading button…</div>}>
      <MyButtonWrapper />
    </Suspense>
  );
}
```

### Способ C: Через FederatedApp / FederatedMount (если нужен роутинг)

Библиотека не требует роутинга, но если хотите смонтировать её как отдельную
страницу (для отладки компонентов), используйте стандартный механизм:

```tsx
import { FederatedMount } from '@looper/shared';

<FederatedMount
  remoteName="ui-looper"
  entry="http://localhost:3030/remoteEntry.js"
  modulePath="./Button"
/>
```

---

## Использование компонентов

После регистрации remote, компоненты загружаются через `loadRemote`:

```tsx
import { Suspense, use, useMemo, type ComponentType } from 'react';

function UIButton(props: {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}) {
  const loadPromise = useMemo(
    () => loadRemote<{ default: ComponentType<any> }>('ui-looper/Button'),
    [],
  );
  const Module = use(loadPromise);
  if (!Module) return null;
  return <Module.default {...props} />;
}

// Использование:
<UIButton variant="primary" size="md">Сохранить</UIButton>
<UIButton variant="outline" size="sm" icon={<Icon />}>Отмена</UIButton>
<UIButton variant="danger" loading>Удаление…</UIButton>
```

### Доступные exposes

| Expose                         | Описание                                        |
|--------------------------------|-------------------------------------------------|
| `ui-looper/Button`             | Кнопка (5 variants, 3 sizes, icon, loading)    |
| `ui-looper/Spinner`            | Индикатор загрузки (3 sizes, 3 variants)        |
| `ui-looper/Typography`         | Compound: `Typography.Text` + `Typography.Heading` |
| `ui-looper/Text`               | Примитив типографики (body/caption/label/help/error) |
| `ui-looper/Heading`            | Заголовки `h1`–`h6` с визуальным оверрайдом      |
| `ui-looper/Input`              | Текстовое поле с label/helper/prefix/suffix/status |
| `ui-looper/Tag`                | Тэг (6 variants, removable)                     |
| `ui-looper/Badge`              | Бейдж (dot/count/text, 5 variants)              |
| `ui-looper/Card`               | Compound: `Card.Header` + `Card.Body` + `Card.Footer` |
| `ui-looper/Tooltip`            | Всплывающая подсказка (4 placement, 3 trigger)  |
| `ui-looper/Select`             | Compound: `Select.Option` + `Select.Group`, single/multiple/tags, search |
| `ui-looper/Modal`              | Модальное окно с порталом (5 sizes, ESC, mask)  |
| `ui-looper/Toast`              | Системные уведомления (Provider + useToast)      |
| `ui-looper/styles/tokens.css`  | Дизайн-токены (CSS custom properties, OKLCH)     |
| `ui-looper/styles/primitives.css` | Базовые стили (reset, helpers)                 |

---

## Подключение стилей

Для корректной работы компонентов необходимо импортировать дизайн-токены
и базовые стили в вашем shell-приложении (однократно):

```tsx
// packages/shell/src/bootstrap.tsx
import '@ui-looper/core/styles/tokens.css';
import '@ui-looper/core/styles/primitives.css';
```

Либо подключить CSS через HTML:

```html
<link rel="stylesheet" href="http://localhost:3030/dist/styles/tokens.css">
<link rel="stylesheet" href="http://localhost:3030/dist/styles/primitives.css">
```

---

## API компонентов

### Button

```tsx
interface ButtonProps {
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;       // width: 100%
  loading?: boolean;          // показать спиннер
  disabled?: boolean;
  icon?: React.ReactNode;     // иконка слева или справа
  iconPosition?: 'left' | 'right';
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  // + все стандартные атрибуты кнопки
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}
```

#### Примеры

```tsx
// Простая кнопка
<Button variant="primary">Save</Button>

// С иконкой слева
<Button variant="outline" icon={<SearchIcon />}>Search</Button>

// С иконкой справа
<Button variant="ghost" icon={<ArrowRight />} iconPosition="right">
  Next
</Button>

// Loading состояние
<Button variant="primary" loading>Saving…</Button>

// Full-width
<Button variant="secondary" fullWidth>Full width button</Button>

// Danger
<Button variant="danger" size="lg">Delete account</Button>
```

### Spinner

```tsx
interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'accent' | 'current';
  label?: string;          // accessible label
}

<Spinner />
<Spinner size="lg" variant="accent" />
```

### Input

```tsx
interface InputProps {
  variant?: 'outline' | 'filled' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  status?: 'default' | 'error' | 'warning' | 'success';
  label?: ReactNode;       // рендерит <label> сверху
  helper?: ReactNode;      // текст под полем
  prefix?: ReactNode;      // иконка слева
  suffix?: ReactNode;      // иконка справа
  fullWidth?: boolean;
}

<Input label="Email" placeholder="you@example.com" />
<Input status="error" helper="Invalid email" prefix={<Icon />} />
```

### Tag / Badge

```tsx
// Tag
<Tag variant="accent" onClose={() => remove(id)}>Label</Tag>

// Badge (count, dot, text)
<Badge count={3} variant="danger"><Button>Inbox</Button></Badge>
<Badge mode="dot" variant="success" standalone />
<Badge mode="text" text="NEW" variant="accent" standalone />
```

### Card

```tsx
<Card variant="outlined">
  <Card.Header>Title</Card.Header>
  <Card.Body>Content</Card.Body>
  <Card.Footer>
    <Button>Save</Button>
  </Card.Footer>
</Card>
```

### Select

```tsx
// Data-driven
<Select options={[{ label: 'One', value: 1 }]} />

// Declarative (compound)
<Select mode="multiple" defaultValue={[1, 2]}>
  <Select.Option value={1}>One</Select.Option>
  <Select.Option value={2}>Two</Select.Option>
</Select>

// С поиском
<Select searchable placeholder="Search…" options={options} />
```

### Tooltip

```tsx
<Tooltip title="Save changes">
  <Button>Save</Button>
</Tooltip>

<Tooltip title="Help" placement="right" trigger="click">
  <span>ⓘ</span>
</Tooltip>
```

### Modal

```tsx
<Modal open={open} onClose={() => setOpen(false)} title="Confirm" size="sm">
  <p>Are you sure?</p>
</Modal>

// C кастомными sub-components
<Modal open={open} onClose={close}>
  <Modal.Header>Custom Header</Modal.Header>
  <Modal.Body>Body content</Modal.Body>
  <Modal.Footer><Button>OK</Button></Modal.Footer>
</Modal>
```

### Toast (система уведомлений)

```tsx
// 1. Оборачиваем приложение
<Toast.Provider position="top-right">
  <App />
</Toast.Provider>

// 2. Используем хук
const { toast } = useToast();
toast({ message: 'Saved!', type: 'success' });
toast({ message: 'Error', type: 'error', duration: 0 });
toast({ message: 'File uploaded', action: { label: 'Undo', onClick: undo } });
```

---

## Разработка

```bash
# Установка
cd ui-looper && npm install

# Dev режим (порт 3030)
npm run dev

# Production сборка
npm run build

# Старт production сервера
npm run start

# Проверка типов
npm run typecheck
```

---

## Архитектура

```
ui-looper/
├── src/
│   ├── index.ts                  # Public API (все компоненты)
│   ├── _shared/
│   │   ├── utils/
│   │   │   ├── cn.ts             # classnames helper
│   │   │   └── composeRefs.ts    # merge refs
│   │   └── hooks/
│   │       ├── useControlledState.ts  # controlled/uncontrolled
│   │       └── useOverlayPosition.ts  # popup positioning
│   ├── Button/                   # Кнопка
│   ├── Spinner/                  # Индикатор загрузки
│   ├── Typography/               # Typography.Text, .Heading
│   ├── Input/                    # Поле ввода
│   ├── Tag/                      # Тэги
│   ├── Badge/                    # Бейджи (dot/count)
│   ├── Card/                     # Compound: Card.Header/Body/Footer
│   ├── Tooltip/                  # Всплывающая подсказка (portal)
│   ├── Select/                   # Compound: Select.Option/Group
│   ├── Modal/                    # Модальное окно (portal + compound)
│   ├── Toast/                    # Система уведомлений (Provider + useToast)
│   ├── styles/
│   │   ├── tokens.css            # Дизайн-токены (--uil-*, OKLCH)
│   │   └── primitives.css        # Базовые стили (reset)
│   └── types/
│       └── css-modules.d.ts
├── demo/                         # Демо-страница (npm run dev → /demo.html)
│   ├── index.html
│   └── demo.tsx
├── rspack.config.ts              # MF 2.0 + Rspack (15 exposes)
├── tsconfig.json
└── package.json
```

**Принципы:**
- Все компоненты — pure UI, без зависимости от `@looper/shared`
- Дизайн-система на CSS custom properties (OKLCH)
- Каждый компонент — отдельный expose в Module Federation
- Темизация через `data-theme="light|dark"` на `<html>`
- Совместимость с любым MF 2.0 host (не только looper)

---

## Roadmap ✅

- [x] **Button** — базовый компонент
- [x] **Spinner** — индикатор загрузки
- [x] **Typography** — типографика (Text, Heading)
- [x] **Input** — текстовое поле с валидацией
- [x] **Tag / Badge** — тэги и бейджи
- [x] **Card** — карточка
- [x] **Tooltip** — всплывающая подсказка
- [x] **Select** — выпадающий список
- [x] **Modal** — модальное окно
- [x] **Toast / Notification** — уведомления
