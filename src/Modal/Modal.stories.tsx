import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../Button';
import { Modal } from './Modal';

const meta: Meta<typeof Modal> = {
  title: 'Components/Modal',
  component: Modal,
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg', 'xl', 'fullscreen'] },
    closable: { control: 'boolean' },
    maskClosable: { control: 'boolean' },
    keyboard: { control: 'boolean' },
    centered: { control: 'boolean' },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Modal>;

export const Small: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Small Modal</Button>
        <Modal open={open} onClose={() => setOpen(false)} title="Small Modal" size="sm">
          <p>This is a small modal dialog.</p>
        </Modal>
      </>
    );
  },
};

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Modal</Button>
        <Modal open={open} onClose={() => setOpen(false)} title="Modal Title" size="md">
          <p>This is a modal dialog. Click outside or press ESC to close.</p>
        </Modal>
      </>
    );
  },
};

export const Large: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Large Modal</Button>
        <Modal open={open} onClose={() => setOpen(false)} title="Large Modal" size="lg">
          <p>Large modal with more content.</p>
        </Modal>
      </>
    );
  },
};

export const Centered: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Centered Modal</Button>
        <Modal open={open} onClose={() => setOpen(false)} title="Centered" size="sm" centered>
          <p>This modal is vertically centered.</p>
        </Modal>
      </>
    );
  },
};

export const WithFooter: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open with Footer</Button>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title="Confirm"
          size="sm"
          showFooter
          footerNode={
            <>
              <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>Cancel</Button>
              <Button size="sm" onClick={() => setOpen(false)}>Confirm</Button>
            </>
          }
        >
          <p>Are you sure you want to proceed?</p>
        </Modal>
      </>
    );
  },
};

export const Fullscreen: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Fullscreen</Button>
        <Modal open={open} onClose={() => setOpen(false)} title="Fullscreen" size="fullscreen">
          <p>Fullscreen modal takes the entire viewport.</p>
        </Modal>
      </>
    );
  },
};
