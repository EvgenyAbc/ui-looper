import { Heading as HeadingComponent } from './Heading';
import { Text as TextComponent } from './Text';

/**
 * Compound namespace for typography primitives.
 */
export const Typography = {
  Text: TextComponent,
  Heading: HeadingComponent,
};

// Direct exports for tree-shaking / single imports
export type { HeadingLevel, HeadingProps, HeadingSemanticDOM } from './Heading';
export { Heading } from './Heading';
export type { TextColor, TextProps, TextSemanticDOM,TextVariant, TextWeight } from './Text';
export { Text } from './Text';
