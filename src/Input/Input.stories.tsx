import type { Meta, StoryObj } from '@storybook/react';

import { Input } from './Input';

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  argTypes: {
    variant: { control: 'select', options: ['outline', 'filled', 'ghost'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    status: { control: 'select', options: ['default', 'error', 'warning', 'success'] },
    disabled: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    placeholder: { control: 'text' },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: { placeholder: 'Enter text…', label: 'Default' },
};

export const WithError: Story = {
  args: { status: 'error', helper: 'This field is required', placeholder: 'Error state', label: 'Email' },
};

export const WithWarning: Story = {
  args: { status: 'warning', helper: 'Check this value', placeholder: 'Warning', label: 'Amount' },
};

export const WithSuccess: Story = {
  args: { status: 'success', helper: 'Looks good!', placeholder: 'Success', label: 'Username' },
};

export const WithPrefix: Story = {
  args: { prefix: '🔍', placeholder: 'Search…', label: 'Search' },
};

export const WithSuffix: Story = {
  args: { suffix: '📅', placeholder: 'Pick a date', label: 'Date' },
};

export const Filled: Story = {
  args: { variant: 'filled', placeholder: 'Filled variant', label: 'Filled' },
};

export const Ghost: Story = {
  args: { variant: 'ghost', placeholder: 'Ghost variant', label: 'Ghost' },
};

export const Disabled: Story = {
  args: { disabled: true, value: 'Cannot edit', label: 'Disabled' },
};

export const Small: Story = {
  args: { size: 'sm', placeholder: 'Small input', label: 'Small' },
};

export const Large: Story = {
  args: { size: 'lg', placeholder: 'Large input', label: 'Large' },
};
