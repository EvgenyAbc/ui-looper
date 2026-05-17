import type { Meta, StoryObj } from '@storybook/react';

import { Badge } from './Badge';

// A mock button for badge wrapping
const MockButton = ({ children }: { children?: React.ReactNode }) => (
  <button style={{
    padding: '0.3rem 0.6rem',
    border: '1px solid var(--uil-border)',
    borderRadius: 'var(--uil-radius-md)',
    background: 'var(--uil-bg)',
    fontFamily: 'var(--uil-font-sans)',
    cursor: 'pointer',
  }}>
    {children ?? 'Button'}
  </button>
);

const meta: Meta<typeof Badge> = {
  title: 'Components/Badge',
  component: Badge,
  args: {
    variant: 'primary',
    mode: 'count',
    count: 3,
    children: 'Inbox',
  },
  argTypes: {
    variant: { control: 'select', options: ['primary', 'accent', 'success', 'warning', 'danger'] },
    mode: { control: 'select', options: ['dot', 'count', 'text'] },
    count: { control: 'number' },
    maxCount: { control: 'number' },
    standalone: { control: 'boolean' },
  },
  tags: ['autodocs'],
  decorators: [(Story) => <MockButton><Story /></MockButton>],
};

export default meta;
type Story = StoryObj<typeof Badge>;

/** Badge with a numeric count attached to a button. */
export const Count: Story = {
  args: { count: 3, variant: 'danger', children: 'Inbox' },
};

export const CountLarge: Story = {
  args: { count: 42, variant: 'accent' },
};

export const Dot: Story = {
  args: { mode: 'dot', variant: 'success', standalone: true },
};

export const Text: Story = {
  args: { mode: 'text', text: 'NEW', variant: 'accent', standalone: true },
};

export const MaxCount: Story = {
  args: { count: 150, maxCount: 99, variant: 'primary' },
};
