import type { Meta, StoryObj } from '@storybook/react';

import { Tag } from './Tag';

const meta: Meta<typeof Tag> = {
  title: 'Components/Tag',
  component: Tag,
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'primary', 'accent', 'success', 'warning', 'danger'],
    },
    size: { control: 'select', options: ['sm', 'md'] },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Tag>;

export const Default: Story = {
  args: { variant: 'default', children: 'Default' },
};

export const Primary: Story = {
  args: { variant: 'primary', children: 'Primary' },
};

export const Accent: Story = {
  args: { variant: 'accent', children: 'Accent' },
};

export const Success: Story = {
  args: { variant: 'success', children: 'Success' },
};

export const Warning: Story = {
  args: { variant: 'warning', children: 'Warning' },
};

export const Danger: Story = {
  args: { variant: 'danger', children: 'Danger' },
};

export const Removable: Story = {
  args: { children: 'Closable', onClose: () => alert('Closed!') },
};

export const Small: Story = {
  args: { size: 'sm', children: 'Small' },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <Tag variant="default">Default</Tag>
      <Tag variant="primary">Primary</Tag>
      <Tag variant="accent">Accent</Tag>
      <Tag variant="success">Success</Tag>
      <Tag variant="warning">Warning</Tag>
      <Tag variant="danger">Danger</Tag>
    </div>
  ),
};
