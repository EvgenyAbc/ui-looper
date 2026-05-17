import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

import { cn } from '../_shared/utils/cn';

import styles from './Heading.module.css';

/* ── Types ── */

export type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export interface HeadingProps extends Omit<HTMLAttributes<HTMLHeadingElement>, 'children'> {
  /** Semantic heading level (also sets default font size) */
  as?: HeadingLevel;
  children?: ReactNode;
  /** Visual size override (can differ from semantic level) */
  size?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  /** Truncate with ellipsis on overflow */
  truncate?: boolean;
}

/* ── Semantic DOM ── */

export type HeadingSemanticDOM = 'root';

/* ── Styles map ── */

const levelClass: Record<HeadingLevel, string> = {
  h1: styles.levelH1,
  h2: styles.levelH2,
  h3: styles.levelH3,
  h4: styles.levelH4,
  h5: styles.levelH5,
  h6: styles.levelH6,
};

/* ── Component ── */

/**
 * `Heading` — typography primitive for section titles.
 *
 * Renders `<h1>`–`<h6>` with theme-aware sizes.
 * Semantic level sets accessible hierarchy; `size` overrides visual only.
 *
 * @example
 * <Heading as="h1">Page Title</Heading>
 * <Heading as="h2" size="h1">H2 styled as H1</Heading>
 */
export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  (
    {
      as: Component = 'h2',
      children,
      size,
      truncate = false,
      className,
      ...rest
    },
    ref,
  ) => {
    const resolvedSize = size ?? Component;
    const classes = cn(
      styles.root,
      levelClass[resolvedSize],
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

Heading.displayName = 'Heading';

export default Heading;
