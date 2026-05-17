import type { Meta, StoryObj } from '@storybook/react';

import { ToastItemComponent,ToastProvider } from './Toast';

const meta: Meta<typeof ToastProvider> = {
  title: 'Components/Toast',
  component: ToastProvider,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ToastProvider>;

export const Info: Story = {
  render: () => (
    <ToastItemComponent
      item={{
        id: '1',
        type: 'info',
        message: 'This is an info toast',
        duration: 0,
        createdAt: Date.now(),
      }}
      onDismiss={() => {}}
    />
  ),
};

export const Success: Story = {
  render: () => (
    <ToastItemComponent
      item={{
        id: '2',
        type: 'success',
        message: 'Operation completed successfully',
        duration: 0,
        createdAt: Date.now(),
      }}
      onDismiss={() => {}}
    />
  ),
};

export const Warning: Story = {
  render: () => (
    <ToastItemComponent
      item={{
        id: '3',
        type: 'warning',
        message: 'Please check your input',
        duration: 0,
        createdAt: Date.now(),
      }}
      onDismiss={() => {}}
    />
  ),
};

export const ErrorToast: Story = {
  name: 'Error',
  render: () => (
    <ToastItemComponent
      item={{
        id: '4',
        type: 'error',
        message: 'Something went wrong',
        description: 'An unexpected error occurred. Please try again.',
        duration: 0,
        createdAt: Date.now(),
      }}
      onDismiss={() => {}}
    />
  ),
};

export const WithDescription: Story = {
  render: () => (
    <ToastItemComponent
      item={{
        id: '5',
        type: 'success',
        message: 'File uploaded',
        description: '3 files were uploaded successfully to /documents',
        duration: 0,
        createdAt: Date.now(),
      }}
      onDismiss={() => {}}
    />
  ),
};

export const WithAction: Story = {
  render: () => (
    <ToastItemComponent
      item={{
        id: '6',
        type: 'warning',
        message: 'File deleted',
        action: { label: 'Undo', onClick: () => alert('Undo!') },
        duration: 0,
        createdAt: Date.now(),
      }}
      onDismiss={() => {}}
    />
  ),
};

export const AllTypes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 360 }}>
      <ToastItemComponent item={{ id: 'a', type: 'info', message: 'Info toast', duration: 0, createdAt: Date.now() }} onDismiss={() => {}} />
      <ToastItemComponent item={{ id: 'b', type: 'success', message: 'Success toast', duration: 0, createdAt: Date.now() }} onDismiss={() => {}} />
      <ToastItemComponent item={{ id: 'c', type: 'warning', message: 'Warning toast', duration: 0, createdAt: Date.now() }} onDismiss={() => {}} />
      <ToastItemComponent item={{ id: 'd', type: 'error', message: 'Error toast', duration: 0, createdAt: Date.now() }} onDismiss={() => {}} />
    </div>
  ),
};
