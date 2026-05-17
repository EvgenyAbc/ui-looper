import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

import { cn } from '../_shared/utils/cn';

import styles from './Card.module.css';

/* ── Types ── */

export type CardVariant = 'default' | 'outlined' | 'ghost';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  /** Visual variant */
  variant?: CardVariant;
  /** Remove padding from body (for custom content) */
  noPadding?: boolean;
}

/* ── Semantic DOM ── */

export type CardSemanticDOM = 'root' | 'header' | 'body' | 'footer';

/* ── Styles map ── */

const variantClass: Record<CardVariant, string> = {
  default: styles.variantDefault,
  outlined: styles.variantOutlined,
  ghost: styles.variantGhost,
};

/* ── Root Card ── */

/**
 * `Card` — bordered container compound component.
 *
 * Use with `Card.Header`, `Card.Body`, `Card.Footer`.
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      variant = 'default',
      className,
      ...rest
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          styles.root,
          variantClass[variant],
          className,
        )}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

Card.displayName = 'Card';

/* ── Sub-components ── */

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export interface CardBodyProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  noPadding?: boolean;
}

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ children, className, ...rest }, ref) => (
    <div ref={ref} className={cn(styles.header, className)} {...rest}>
      {children}
    </div>
  ),
);
CardHeader.displayName = 'Card.Header';

const CardBody = forwardRef<HTMLDivElement, CardBodyProps>(
  ({ children, noPadding, className, ...rest }, ref) => (
    <div
      ref={ref}
      className={cn(
        styles.body,
        noPadding ? styles.bodyNoPadding : null,
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  ),
);
CardBody.displayName = 'Card.Body';

const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ children, className, ...rest }, ref) => (
    <div ref={ref} className={cn(styles.footer, className)} {...rest}>
      {children}
    </div>
  ),
);
CardFooter.displayName = 'Card.Footer';

/* ── Compound namespace ── */

export const CardNamespace = Object.assign(Card, {
  Header: CardHeader,
  Body: CardBody,
  Footer: CardFooter,
});

export { CardBody, CardFooter,CardHeader };
export default Card;
