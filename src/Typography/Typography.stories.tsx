import type { Meta, StoryObj } from '@storybook/react';

import { Heading } from './Heading';
import { Text } from './Text';

/* ── Text ── */

const textMeta: Meta<typeof Text> = {
  title: 'Components/Typography/Text',
  component: Text,
  argTypes: {
    variant: {
      control: 'select',
      options: ['body', 'caption', 'label', 'help', 'error'],
    },
    weight: {
      control: 'select',
      options: ['normal', 'medium', 'semibold', 'bold'],
    },
    color: {
      control: 'select',
      options: ['default', 'secondary', 'tertiary', 'accent', 'error', 'success', 'warning', 'inverse'],
    },
    truncate: { control: 'boolean' },
  },
  tags: ['autodocs'],
};

export default textMeta;
type TextStory = StoryObj<typeof Text>;

export const Body: TextStory = {
  args: { variant: 'body', children: 'The quick brown fox jumps over the lazy dog.' },
};

export const Caption: TextStory = {
  args: { variant: 'caption', children: 'Caption text (small)' },
};

export const Label: TextStory = {
  args: { variant: 'label', children: 'Form Label' },
};

export const Help: TextStory = {
  args: { variant: 'help', children: 'This is a hint for the user.' },
};

export const ErrorText: TextStory = {
  args: { variant: 'error', children: 'This field is required.' },
};

export const Bold: TextStory = {
  args: { weight: 'bold', children: 'Bold text' },
};

export const Accent: TextStory = {
  args: { color: 'accent', children: 'Accent coloured text' },
};

export const Truncated: TextStory = {
  args: {
    truncate: true,
    style: { maxWidth: 200, display: 'block' },
    children: 'Very long text that should be truncated with ellipsis at the end',
  },
};

export const TextVariants: TextStory = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Text variant="body">Body text</Text>
      <Text variant="caption">Caption text</Text>
      <Text variant="label">Label text</Text>
      <Text variant="help">Help text</Text>
      <Text variant="error">Error text</Text>
    </div>
  ),
};

/* ── Heading ── */

const headingMeta: Meta<typeof Heading> = {
  title: 'Components/Typography/Heading',
  component: Heading,
  argTypes: {
    as: {
      control: 'select',
      options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    },
    size: {
      control: 'select',
      options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    },
    truncate: { control: 'boolean' },
  },
  tags: ['autodocs'],
};

export const HeadingH1: StoryObj<typeof Heading> = {
  name: 'H1',
  args: { as: 'h1', children: 'Heading 1' },
};

export const HeadingH2: StoryObj<typeof Heading> = {
  name: 'H2',
  args: { as: 'h2', children: 'Heading 2' },
};

export const HeadingH3: StoryObj<typeof Heading> = {
  name: 'H3',
  args: { as: 'h3', children: 'Heading 3' },
};

export const HeadingH4: StoryObj<typeof Heading> = {
  name: 'H4',
  args: { as: 'h4', children: 'Heading 4' },
};

export const HeadingH5: StoryObj<typeof Heading> = {
  name: 'H5',
  args: { as: 'h5', children: 'Heading 5' },
};

export const HeadingH6: StoryObj<typeof Heading> = {
  name: 'H6',
  args: { as: 'h6', children: 'Heading 6' },
};

export const HeadingLevels: StoryObj<typeof Heading> = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Heading as="h1">Heading h1</Heading>
      <Heading as="h2">Heading h2</Heading>
      <Heading as="h3">Heading h3</Heading>
      <Heading as="h4">Heading h4</Heading>
      <Heading as="h5">Heading h5</Heading>
      <Heading as="h6">Heading h6</Heading>
    </div>
  ),
};

// Re-export as Typography namespace
export { headingMeta, textMeta };
