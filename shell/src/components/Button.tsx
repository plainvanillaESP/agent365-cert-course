import { forwardRef } from 'react'
import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import type { LinkProps } from 'react-router-dom'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'subtle'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonBaseProps {
  variant?: ButtonVariant
  size?: ButtonSize
  iconLeft?: ReactNode
  iconRight?: ReactNode
  fullWidth?: boolean
  className?: string
  children: ReactNode
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    'bg-[var(--color-pv-purple-600)] text-white hover:bg-[var(--color-pv-purple-700)] active:bg-[var(--color-pv-purple-800)] shadow-[0_1px_2px_rgba(123,47,190,0.18)]',
  secondary:
    'bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-default)] hover:bg-[var(--bg-surface-hover)] hover:border-[var(--border-strong)]',
  ghost:
    'text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)]',
  subtle:
    'bg-[var(--bg-surface-2)] text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]',
}

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-[13px] gap-1.5 rounded-md',
  md: 'h-10 px-4 text-[14px] gap-2 rounded-md',
  lg: 'h-11 px-5 text-[14.5px] gap-2 rounded-md',
}

const BASE_CLASSES =
  'inline-flex items-center justify-center font-medium select-none whitespace-nowrap no-underline transition-colors duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-pv-purple-500)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)] disabled:opacity-50 disabled:pointer-events-none'

function classes({
  variant = 'primary',
  size = 'md',
  fullWidth,
  className = '',
}: Pick<ButtonBaseProps, 'variant' | 'size' | 'fullWidth' | 'className'>) {
  return [
    BASE_CLASSES,
    SIZE_CLASSES[size],
    VARIANT_CLASSES[variant],
    fullWidth && 'w-full',
    className,
  ]
    .filter(Boolean)
    .join(' ')
}

/**
 * Botón nativo (`<button>`).
 */
export type ButtonProps = ButtonBaseProps & ButtonHTMLAttributes<HTMLButtonElement>

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant, size, iconLeft, iconRight, fullWidth, className, children, type = 'button', ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={classes({ variant, size, fullWidth, className })}
      {...rest}
    >
      {iconLeft}
      <span>{children}</span>
      {iconRight}
    </button>
  )
})

/**
 * Variante anchor — para enlaces externos.
 */
export type ButtonAnchorProps = ButtonBaseProps & AnchorHTMLAttributes<HTMLAnchorElement>

export const ButtonAnchor = forwardRef<HTMLAnchorElement, ButtonAnchorProps>(function ButtonAnchor(
  { variant, size, iconLeft, iconRight, fullWidth, className, children, ...rest },
  ref,
) {
  return (
    <a ref={ref} className={classes({ variant, size, fullWidth, className })} {...rest}>
      {iconLeft}
      <span>{children}</span>
      {iconRight}
    </a>
  )
})

/**
 * Variante <Link> de React Router — para navegación interna.
 */
export type ButtonLinkProps = ButtonBaseProps & Omit<LinkProps, 'className' | 'children'>

export const ButtonLink = forwardRef<HTMLAnchorElement, ButtonLinkProps>(function ButtonLink(
  { variant, size, iconLeft, iconRight, fullWidth, className, children, ...rest },
  ref,
) {
  return (
    <Link ref={ref} className={classes({ variant, size, fullWidth, className })} {...rest}>
      {iconLeft}
      <span>{children}</span>
      {iconRight}
    </Link>
  )
})

/**
 * IconButton para acciones de un solo icono (toggles, close, etc.).
 * Cuadrado, sin texto.
 */
interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: ButtonSize
  variant?: 'ghost' | 'secondary'
  label: string
  children: ReactNode
}

const ICON_BUTTON_SIZE: Record<ButtonSize, string> = {
  sm: 'size-8 rounded-md',
  md: 'size-9 rounded-md',
  lg: 'size-10 rounded-md',
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { size = 'md', variant = 'ghost', label, className = '', children, type = 'button', ...rest },
  ref,
) {
  const variantClass =
    variant === 'ghost'
      ? 'text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)]'
      : 'bg-[var(--bg-surface)] border border-[var(--border-default)] text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]'
  return (
    <button
      ref={ref}
      type={type}
      aria-label={label}
      className={[
        'inline-flex items-center justify-center transition-colors duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-pv-purple-500)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)]',
        ICON_BUTTON_SIZE[size],
        variantClass,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {children}
    </button>
  )
})
