import type { Meta, StoryObj } from '@storybook/react';

import { Select } from './Select';

const countries = [
  { label: 'United States', value: 'us' },
  { label: 'United Kingdom', value: 'uk' },
  { label: 'Germany', value: 'de' },
  { label: 'France', value: 'fr' },
  { label: 'Japan', value: 'jp' },
  { label: 'Australia', value: 'au' },
  { label: 'Brazil', value: 'br' },
  { label: 'Canada', value: 'ca' },
];

const meta: Meta<typeof Select> = {
  title: 'Components/Select',
  component: Select,
  argTypes: {
    mode: { control: 'select', options: ['single', 'multiple', 'tags'] },
    searchable: { control: 'boolean' },
    disabled: { control: 'boolean' },
    allowClear: { control: 'boolean' },
    placeholder: { control: 'text' },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Select>;

export const Single: Story = {
  args: {
    options: countries,
    placeholder: 'Select a country',
    style: { width: 280 },
  },
};

export const Multiple: Story = {
  args: {
    mode: 'multiple',
    options: countries,
    placeholder: 'Select countries',
    maxTagCount: 2,
    style: { width: 320 },
  },
};

export const Searchable: Story = {
  args: {
    searchable: true,
    options: countries,
    placeholder: 'Search countries…',
    style: { width: 280 },
  },
};

export const WithError: Story = {
  args: {
    options: countries,
    placeholder: 'Select a country',
    status: 'error',
    style: { width: 280 },
  },
};

export const Disabled: Story = {
  args: {
    options: countries,
    placeholder: 'Disabled',
    disabled: true,
    style: { width: 280 },
  },
};

export const Clearable: Story = {
  args: {
    options: countries,
    placeholder: 'Clearable',
    allowClear: true,
    defaultValue: 'us',
    style: { width: 280 },
  },
};
