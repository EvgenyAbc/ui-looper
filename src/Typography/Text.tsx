import { type ElementType, forwardRef, type HTMLAttributes, type ReactNode } from 'react';

import { cn } from '../_shared/utils/cn';

import styles from './Text.module.css';

/* ── Types ── */

export type TextVariant =
  | 'body'      // default body text
  | 'caption'   // small / secondary
  | 'label'     // form label
  | 'help'      // helper / hint
  | 'error';    // validation error

export type TextWeight = 'normal' | 'medium' | 'semibold' | 'bold';

export type TextColor =
  | 'default'
  | 'secondary'
  | 'tertiary'
  | 'accent'
  | 'error'
  | 'success'
  | 'warning'
  | 'inverse';

export interface TextProps extends Omit<HTMLAttributes<HTMLElement>, 'color'> {
  /** Rendered HTML element (default: span for body, p for caption) */
  as?: ElementType;
  children?: ReactNode;
  /** Semantic variant */
  variant?: TextVariant;
  /** Font weight */
  weight?: TextWeight;
  /** Colour token */
  color?: TextColor;
  /** Truncate with ellipsis on overflow */
  truncate?: boolean;
}

/* ── Semantic DOM ── */

export type TextSemanticDOM = 'root';

/* ── Styles map ── */

const variantClass: Record<TextVariant, string> = {
  body: styles.variantBody,
  caption: styles.variantCaption,
  label: styles.variantLabel,
  help: styles.variantHelp,
  error: styles.variantError,
};

const weightClass: Record<TextWeight, string> = {
  normal: styles.weightNormal,
  medium: styles.weightMedium,
  semibold: styles.weightSemibold,
  bold: styles.weightBold,
};

const colorClass: Record<TextColor, string> = {
  default: styles.colorDefault,
  secondary: styles.colorSecondary,
  tertiary: styles.colorTertiary,
  accent: styles.colorAccent,
  error: styles.colorError,
  success: styles.colorSuccess,
  warning: styles.colorWarning,
  inverse: styles.colorInverse,
};

/* ── Component ── */

/**
 * `Text` — typography primitive for body content, labels, captions, and helpers.
 *
 * Renders a semantic HTML element with theme-aware styling.
 *
 * @example
 * <Text>Default body</Text>
 * <Text variant="caption" color="secondary">Small hint</Text>
 * <Text variant="label" weight="medium">Form Label</Text>
 */
export const Text = forwardRef<HTMLElement, TextProps>(
  (
    {
      as,
      children,
      variant = 'body',
      weight,
      color,
      truncate = false,
      className,
      ...rest
    },
    ref,
  ) => {
    // Pick default element for variant
    const Component =
      as ?? (variant === 'body' ? 'span' : variant === 'caption' ? 'small' : 'span');

    const classes = cn(
      styles.root,
      variantClass[variant],
      weight ? weightClass[weight] : null,
      color ? colorClass[color] : null,
      truncate ? styles.truncate : null,
      className,
    );

    return (
      <Component ref={ref} className={classes} {...rest}>
        {children}
      </Component>
    );
  },
);

Text.displayName = 'Text';

export default Text;
