import { type ButtonHTMLAttributes, forwardRef, type ReactNode } from 'react';

import { cn } from '../_shared/utils/cn';

import styles from './Tag.module.css';

/* ── Types ── */

export type TagVariant =
  | 'default'
  | 'primary'
  | 'accent'
  | 'success'
  | 'warning'
  | 'danger';

export type TagSize = 'sm' | 'md';

export interface TagProps
  extends Omit<ButtonHTMLAttributes<HTMLSpanElement>, 'children' | 'onClose'> {
  children?: ReactNode;
  /** Colour variant */
  variant?: TagVariant;
  /** Size preset */
  size?: TagSize;
  /** If set, shows a close button */
  onClose?: () => void;
  /** Custom close icon (default: ×) */
  closeIcon?: ReactNode;
}

/* ── Semantic DOM ── */

export type TagSemanticDOM = 'root' | 'close' | 'label';

/* ── Styles map ── */

const variantClass: Record<TagVariant, string> = {
  default: styles.variantDefault,
  primary: styles.variantPrimary,
  accent: styles.variantAccent,
  success: styles.variantSuccess,
  warning: styles.variantWarning,
  danger: styles.variantDanger,
};

const sizeClass: Record<TagSize, string> = {
  sm: styles.sizeSm,
  md: styles.sizeMd,
};

/* ── Component ── */

/**
 * `Tag` — small label with optional removal.
 *
 * Used for metadata, filters, and multi-select tokens.
 *
 * @example
 * <Tag variant="accent">New</Tag>
 * <Tag onClose={() => remove(id)}>Filter item</Tag>
 */
export const Tag = forwardRef<HTMLSpanElement, TagProps>(
  (
    {
      children,
      variant = 'default',
      size = 'md',
      onClose,
      closeIcon,
      className,
      ...rest
    },
    ref,
  ) => {
    const classes = cn(
      styles.root,
      variantClass[variant],
      sizeClass[size],
      className,
    );

    return (
      <span ref={ref} className={classes} {...rest}>
        <span className={styles.label}>{children}</span>

        {onClose && (
          <button
            type="button"
            className={styles.close}
            onClick={onClose}
            aria-label="Remove"
          >
            {closeIcon ?? '\u00D7'}
          </button>
        )}
      </span>
    );
  },
);

Tag.displayName = 'Tag';

export default Tag;
