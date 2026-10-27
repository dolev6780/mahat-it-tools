import type { ReactNode } from 'react'

/** כפתור בחירה (סלייסר, בחירת פעולה וכו'). `on` = נבחר. */
export function Chip({
  on,
  onClick,
  disabled,
  children,
}: {
  on: boolean
  onClick: () => void
  disabled?: boolean
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={on}
      className={`rounded-lg border px-3 py-1.5 text-start transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
        on ? 'border-blue bg-blue/15 text-blue' : 'border-line bg-card text-ink hover:border-ink-2'
      }`}
    >
      {children}
    </button>
  )
}

export function Button({
  onClick,
  disabled,
  variant = 'primary',
  children,
}: {
  onClick: () => void
  disabled?: boolean
  variant?: 'primary' | 'ghost'
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded-lg px-4 py-2 font-bold disabled:cursor-not-allowed disabled:opacity-40 ${
        variant === 'primary'
          ? 'bg-blue text-bg hover:bg-blue/85'
          : 'border border-line bg-card text-ink-2 hover:text-ink'
      }`}
    >
      {children}
    </button>
  )
}

export function Card({ className = '', children }: { className?: string; children: ReactNode }) {
  return <section className={`rounded-xl border border-line bg-card p-4 ${className}`}>{children}</section>
}
