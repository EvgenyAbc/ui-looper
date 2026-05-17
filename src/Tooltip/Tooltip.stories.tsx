import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../Button';
import { Tooltip } from './Tooltip';

const meta: Meta<typeof Tooltip> = {
  title: 'Components/Tooltip',
  component: Tooltip,
  argTypes: {
    placement: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right', 'top-start', 'top-end', 'bottom-start', 'bottom-end'],
    },
    trigger: {
      control: 'select',
      options: ['hover', 'click', 'focus'],
    },
    arrow: { control: 'boolean' },
    mouseEnterDelay: { control: 'number' },
    mouseLeaveDelay: { control: 'number' },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Top: Story = {
  args: { title: 'Tooltip on top', placement: 'top' },
  decorators: [(Story) => <Button variant="outline"><Story /></Button>],
};

export const Bottom: Story = {
  args: { title: 'Tooltip on bottom', placement: 'bottom' },
  decorators: [(Story) => <Button variant="outline"><Story /></Button>],
};

export const Left: Story = {
  args: { title: 'Tooltip on left', placement: 'left' },
  decorators: [(Story) => <Button variant="outline"><Story /></Button>],
};

export const Right: Story = {
  args: { title: 'Tooltip on right', placement: 'right' },
  decorators: [(Story) => <Button variant="outline"><Story /></Button>],
};

export const ClickTrigger: Story = {
  args: { title: 'Clicked!', trigger: 'click' },
  decorators: [(Story) => <Button variant="outline">Click me<Story /></Button>],
};

export const WithoutArrow: Story = {
  args: { title: 'No arrow', arrow: false },
  decorators: [(Story) => <Button variant="outline"><Story /></Button>],
};
