import type { Meta, StoryObj } from '@storybook/react';

import { Spinner } from './Spinner';

const meta: Meta<typeof Spinner> = {
  title: 'Components/Spinner',
  component: Spinner,
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    variant: { control: 'select', options: ['primary', 'accent', 'current'] },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Spinner>;

export const Default: Story = {};

export const Small: Story = {
  args: { size: 'sm' },
};

export const Large: Story = {
  args: { size: 'lg' },
};

export const Accent: Story = {
  args: { variant: 'accent' },
};

export const CurrentColor: Story = {
  args: { variant: 'current' },
  decorators: [
    (Story) => (
      <div style={{ color: 'var(--uil-accent)' }}>
        <Story />
      </div>
    ),
  ],
};
