import type { Meta, StoryObj } from '@storybook/react';

import { Card, CardBody, CardFooter,CardHeader } from './Card';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  argTypes: {
    variant: { control: 'select', options: ['default', 'outlined', 'ghost'] },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: { variant: 'default', style: { maxWidth: 400 } },
  render: (args) => (
    <Card {...args}>
      <CardHeader>Card Title</CardHeader>
      <CardBody>
        This is the card body content. Cards can have a header, body, and footer section.
      </CardBody>
      <CardFooter>
        <button style={{
          padding: '0.3rem 0.8rem',
          background: 'var(--uil-primary)',
          color: 'var(--uil-primary-fg)',
          border: 'none',
          borderRadius: 'var(--uil-radius-sm)',
          cursor: 'pointer',
          fontFamily: 'var(--uil-font-sans)',
        }}>Save</button>
        <button style={{
          padding: '0.3rem 0.8rem',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          fontFamily: 'var(--uil-font-sans)',
          color: 'var(--uil-fg-secondary)',
        }}>Cancel</button>
      </CardFooter>
    </Card>
  ),
};

export const Outlined: Story = {
  args: { variant: 'outlined', style: { maxWidth: 400 } },
  render: (args) => (
    <Card {...args}>
      <CardBody>Outlined card with just a body.</CardBody>
    </Card>
  ),
};

export const Ghost: Story = {
  args: { variant: 'ghost', style: { maxWidth: 400 } },
  render: (args) => (
    <Card {...args}>
      <CardBody>Ghost card with no border or shadow.</CardBody>
    </Card>
  ),
};

export const NoPadding: Story = {
  args: { style: { maxWidth: 400 } },
  render: (args) => (
    <Card {...args}>
      <CardBody noPadding>
        <div style={{ padding: '2rem', textAlign: 'center', background: 'var(--uil-bg-secondary)' }}>
          Custom padded content
        </div>
      </CardBody>
    </Card>
  ),
};
