import {
  forwardRef,
  type InputHTMLAttributes,
  type ReactNode,
  useId,
} from 'react';

import { cn } from '../_shared/utils/cn';

import styles from './Input.module.css';

/* ── Types ── */

export type InputVariant = 'outline' | 'filled' | 'ghost';

export type InputSize = 'sm' | 'md' | 'lg';

export type InputStatus = 'default' | 'error' | 'warning' | 'success';

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'> {
  /** Visual variant */
  variant?: InputVariant;
  /** Size preset */
  size?: InputSize;
  /** Validation status */
  status?: InputStatus;
  /** Label text (renders a `<label>` above the input) */
  label?: ReactNode;
  /** Helper text below the input */
  helper?: ReactNode;
  /** Icon / element before the input */
  prefix?: ReactNode;
  /** Icon / element after the input */
  suffix?: ReactNode;
  /** Make input span full width */
  fullWidth?: boolean;
}

/* ── Semantic DOM ── */

export type InputSemanticDOM =
  | 'root'
  | 'input'
  | 'label'
  | 'helper'
  | 'prefix'
  | 'suffix';

/* ── Styles map ── */

const variantClass: Record<InputVariant, string> = {
  outline: styles.variantOutline,
  filled: styles.variantFilled,
  ghost: styles.variantGhost,
};

const sizeClass: Record<InputSize, string> = {
  sm: styles.sizeSm,
  md: styles.sizeMd,
  lg: styles.sizeLg,
};

const statusClass: Record<InputStatus, string> = {
  default: '',
  error: styles.statusError,
  warning: styles.statusWarning,
  success: styles.statusSuccess,
};

/* ── Component ── */

/**
 * `Input` — themed text input with label, helper, prefix/suffix, and validation.
 *
 * Renders a native `<input>` with theme-aware styling via CSS custom properties.
 *
 * @example
 * <Input label="Email" placeholder="you@example.com" />
 * <Input status="error" helper="Invalid email" />
 * <Input prefix={<SearchIcon />} placeholder="Search…" />
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      variant = 'outline',
      size = 'md',
      status = 'default',
      label,
      helper,
      prefix,
      suffix,
      fullWidth = false,
      disabled = false,
      className,
      id,
      ...rest
    },
    ref,
  ) => {
    const autoId = useId();
    const inputId = id ?? autoId;
    const helperId = helper ? `${inputId}-helper` : undefined;

    const rootClasses = cn(
      styles.root,
      variantClass[variant],
      sizeClass[size],
      statusClass[status],
      fullWidth ? styles.fullWidth : null,
      disabled ? styles.disabled : null,
      className,
    );

    return (
      <div className={rootClasses}>
        {label && (
          <label htmlFor={inputId} className={cn(styles.label)}>
            {label}
          </label>
        )}

        <div className={styles.wrapper}>
          {prefix && (
            <span className={styles.prefix} aria-hidden="true">
              {prefix}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            className={styles.input}
            disabled={disabled}
            aria-invalid={status === 'error' || undefined}
            aria-describedby={helperId}
            {...rest}
          />

          {suffix && (
            <span className={styles.suffix} aria-hidden="true">
              {suffix}
            </span>
          )}
        </div>

        {helper && (
          <p id={helperId} className={styles.helper}>
            {helper}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';

export default Input;
