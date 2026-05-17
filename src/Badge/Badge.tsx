import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

import { cn } from '../_shared/utils/cn';

import styles from './Badge.module.css';

/* ── Types ── */

export type BadgeVariant =
  | 'primary'
  | 'accent'
  | 'success'
  | 'warning'
  | 'danger';

export type BadgeMode = 'dot' | 'count' | 'text';

export interface BadgeProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** Children — the element the badge attaches to */
  children?: ReactNode;
  /** Colour variant */
  variant?: BadgeVariant;
  /** Display mode */
  mode?: BadgeMode;
  /** Numeric count (mode="count") */
  count?: number;
  /** Max count before showing "+" (mode="count") */
  maxCount?: number;
  /** Text content (mode="text") */
  text?: ReactNode;
  /** Show dot as a standalone indicator (no children wrapper) */
  standalone?: boolean;
}

/* ── Semantic DOM ── */

export type BadgeSemanticDOM = 'root' | 'sup' | 'dot';

/* ── Styles map ── */

const variantClass: Record<BadgeVariant, string> = {
  primary: styles.variantPrimary,
  accent: styles.variantAccent,
  success: styles.variantSuccess,
  warning: styles.variantWarning,
  danger: styles.variantDanger,
};

/* ── Component ── */

/**
 * `Badge` — indicator dot, count, or text attached to a child element.
 */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      children,
      variant = 'primary',
      mode = 'count',
      count,
      maxCount = 99,
      text,
      standalone = false,
      className,
      ...rest
    },
    ref,
  ) => {
    const classes = cn(
      styles.root,
      variantClass[variant],
      standalone ? styles.standalone : null,
      className,
    );

    const dotMarkup =
      mode === 'dot' ? (
        <span className={cn(styles.sup, styles.supDot)} aria-label="indicator" />
      ) : mode === 'count' && count !== undefined ? (
        <span className={styles.sup} aria-label={`${count} items`}>
          {count > maxCount ? `${maxCount}+` : count}
        </span>
      ) : mode === 'text' && text ? (
        <span className={styles.sup}>{text}</span>
      ) : null;

    if (standalone || !children) {
      return (
        <span ref={ref} className={cn(classes, styles.standaloneRoot)} {...rest}>
          {mode === 'dot' ? (
            <span className={cn(styles.sup, styles.supDot)} />
          ) : null}
        </span>
      );
    }

    return (
      <span ref={ref} className={classes} {...rest}>
        {children}
        {dotMarkup}
      </span>
    );
  },
);

Badge.displayName = 'Badge';

export default Badge;
