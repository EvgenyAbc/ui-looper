import { forwardRef, type HTMLAttributes } from 'react';

import { cn } from '../_shared/utils/cn';

import styles from './Spinner.module.css';

/* ── Types ── */

export type SpinnerSize = 'sm' | 'md' | 'lg';

export type SpinnerVariant = 'primary' | 'accent' | 'current';

export interface SpinnerProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** Size preset */
  size?: SpinnerSize;
  /** Colour variant */
  variant?: SpinnerVariant;
  /** Accessible label (default: "Loading…") */
  label?: string;
}

/* ── Semantic DOM ── */

export type SpinnerSemanticDOM = 'root' | 'icon' | 'track';

/* ── Styles map ── */

const sizeClass: Record<SpinnerSize, string> = {
  sm: styles.sizeSm,
  md: styles.sizeMd,
  lg: styles.sizeLg,
};

const variantClass: Record<SpinnerVariant, string> = {
  primary: styles.variantPrimary,
  accent: styles.variantAccent,
  current: styles.variantCurrent,
};

/* ── Component ── */

/**
 * `Spinner` — animated loading indicator.
 *
 * Renders an inline SVG spinner with theme-aware colours.
 * Supports three sizes and colour variants.
 *
 * @example
 * <Spinner />
 * <Spinner size="lg" variant="accent" />
 */
export const Spinner = forwardRef<HTMLSpanElement, SpinnerProps>(
  (
    {
      size = 'md',
      variant = 'primary',
      label = 'Loading…',
      className,
      ...rest
    },
    ref,
  ) => {
    const classes = cn(
      styles.root,
      sizeClass[size],
      variantClass[variant],
      className,
    );

    return (
      <span
        ref={ref}
        role="status"
        aria-label={label}
        className={classes}
        {...rest}
      >
        <svg
          className={styles.icon}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle
            className={styles.track}
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="31.4 31.4"
          />
        </svg>
      </span>
    );
  },
);

Spinner.displayName = 'Spinner';

export default Spinner;
