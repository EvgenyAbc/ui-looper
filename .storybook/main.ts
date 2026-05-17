import type { StorybookConfig } from '@storybook/react-vite';

// Storybook 10: addon-essentials и addon-interactions удалены.
// Их функциональность встроена в ядро (actions, controls, viewport, backgrounds и т.д.).
// addon-links удалён — не используется.
// Для autodocs (tags: ['autodocs']) оставляем addon-docs.
const config: StorybookConfig = {
  stories: ['../src/**/*.stories.tsx', '../src/**/*.stories.mdx'],
  addons: [
    '@storybook/addon-docs',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  core: {
    disableTelemetry: true,
  },
  docs: {
    autodocs: 'tag',
    defaultName: 'Docs',
  },
};

export default config;
