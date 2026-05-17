# Storybook в @ui-looper/core

## Кратко

Storybook v10.4.0 на Vite. Сторисы рядом с компонентами (`Button/Button.stories.tsx`). Autodocs из TypeScript-пропсов.

```bash
npm run storybook        # dev: порт 6006
npm run build:storybook  # production build → storybook-static/
```

## Зачем

- Визуальная отладка компонентов изолированно (без MF-хостинга)
- Autodocs — автоматическая генерация документации из TS-типов
- Sandbox для reproduction багов и тестирования edge cases
- Быстрый dev-цикл (Vite, HMR)

## Структура

```
ui-looper/
├── .storybook/
│   ├── main.ts           # конфиг: stories, addons, framework
│   └── preview.tsx       # глобальные декораторы, импорт tokens.css
├── src/
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.module.css
│   │   └── Button.stories.tsx   # ← стори рядом с компонентом
│   ├── Modal/
│   │   └── Modal.stories.tsx
│   └── …
```

## Как это работает

### Конфиг (`.storybook/main.ts`)

```ts
// Storybook 10: addon-essentials и addon-interactions удалены.
// Их функциональность (actions, controls, viewport, backgrounds)
// встроена в ядро — ничего ставить не нужно.
// Для autodocs (tags: ['autodocs']) нужен addon-docs.
```

Пакеты:

| Пакет | Назначение |
|-------|------------|
| `storybook` | Ядро |
| `@storybook/react-vite` | React + Vite интеграция |
| `@storybook/addon-docs` | Autodocs из TS-пропсов |
| `vite` | Бандлер (peer dep react-vite) |

### Превью (`.storybook/preview.tsx`)

- Импортирует `tokens.css` и `primitives.css` — компоненты видят CSS-переменные
- Декоратор: `<div style={{ fontFamily: 'var(--uil-font-sans)' }}>` — единый шрифт
- Кнопка тоггла темы (светлая/тёмная) в правом нижнем углу

## Написание сторисов

Формат CSF (Component Story Format):

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary'] },
    loading: { control: 'boolean' },
  },
  tags: ['autodocs'],  // ← включает автодокументацию
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: { variant: 'primary', children: 'Click me' },
};

export const Loading: Story = {
  args: { loading: true, children: 'Saving…' },
};
```

### Правила

1. Файл называется `ComponentName.stories.tsx`
2. Лежит в той же директории, что и компонент
3. `tags: ['autodocs']` в `meta` включает генерацию документации
4. Для controlled-компонентов (Modal, Select) используй `useState` внутри `render`

## Апгрейд Storybook

```bash
# Автоматический апгрейд
npx storybook@latest upgrade

# Если автомиграция не сработала — вручную:
npm install --save-dev storybook@latest @storybook/react-vite@latest

# Storybook 10: удали из package.json и main.ts:
#   @storybook/addon-essentials    → удалён, всё встроено в ядро
#   @storybook/addon-interactions  → удалён, всё встроено в ядро
#   @storybook/addon-links         → удалён, не используется
#   @storybook/blocks              → удалён, не используется
#
# Добавь если нужен autodocs:
#   @storybook/addon-docs
```

## Известные особенности

- **React 19**: Storybook v10 поддерживает React 19. Проблем с peer deps нет.
- **CSS Modules + Vite**: Работает из коробки, никаких дополнительных плагинов не нужно.
- **Два билда**: Storybook использует Vite (не Rspack), MF и library build — Rspack. Это нормально, конфликтов нет.
