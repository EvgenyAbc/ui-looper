import { type ButtonHTMLAttributes, forwardRef, type ReactNode } from 'react';

import styles from './Button.module.css';

/* ── Types ── */

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'danger';

export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Button content */
  children?: ReactNode;
  /** Visual style variant */
  variant?: ButtonVariant;
  /** Size preset */
  size?: ButtonSize;
  /** Make button span full width of container */
  fullWidth?: boolean;
  /** Show loading spinner and disable interactions */
  loading?: boolean;
  /** Icon element placed before or after children */
  icon?: ReactNode;
  /** Icon position relative to children */
  iconPosition?: 'left' | 'right';
}

/* ── Styles map ── */

const variantClass: Record<ButtonVariant, string> = {
  primary: styles.variantPrimary,
  secondary: styles.variantSecondary,
  outline: styles.variantOutline,
  ghost: styles.variantGhost,
  danger: styles.variantDanger,
};

const sizeClass: Record<ButtonSize, string> = {
  sm: styles.sizeSm,
  md: styles.sizeMd,
  lg: styles.sizeLg,
};

/* ── Component ── */

/**
 * `Button` — the foundation of the @ui-looper/core design system.
 *
 * Renders a native `<button>` with theme-aware styling via CSS custom properties.
 * Supports variants, sizes, icons, loading state, and full-width mode.
 *
 * @example
 * ```tsx
 * <Button variant="primary" size="md" onClick={handleClick}>
 *   Click me
 * </Button>
 *
 * <Button variant="outline" icon={<StarIcon />} iconPosition="left">
 *   Star
 * </Button>
 *
 * <Button variant="danger" loading disabled>
 *   Deleting…
 * </Button>
 * ```
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      loading = false,
      disabled = false,
      icon,
      iconPosition = 'left',
      className,
      type = 'button',
      ...rest
    },
    ref,
  ) => {
    const classes = [
      styles.btn,
      variantClass[variant],
      sizeClass[size],
      fullWidth ? styles.fullWidth : '',
      loading ? styles.loading : '',
      className ?? '',
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button
        ref={ref}
        type={type}
        className={classes}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        {...rest}
      >
        {loading && (
          <span className={styles.spinner} aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" className={styles.spinnerSvg}>
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="31.4 31.4"
                className={styles.spinnerCircle}
              />
            </svg>
          </span>
        )}

        {!loading && icon && iconPosition === 'left' && (
          <span className={styles.iconLeft}>{icon}</span>
        )}

        {children && <span className={styles.content}>{children}</span>}

        {!loading && icon && iconPosition === 'right' && (
          <span className={styles.iconRight}>{icon}</span>
        )}
      </button>
    );
  },
);

Button.displayName = 'Button';

export default Button;
