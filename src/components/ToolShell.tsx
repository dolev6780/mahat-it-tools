import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useTeacherMode, useUrlFlag } from '../lib/urlState'

type Props = { eyebrow?: string; title: string; subtitle?: string; children: ReactNode }

/** מסגרת משותפת לכל כלי: כותרת, מעבר מרצה/סטודנט, מצב הקרנה ומסך מלא. */
export function ToolShell({ eyebrow, title, subtitle, children }: Props) {
  const [teacher, setTeacher] = useTeacherMode()
  const [present, setPresent] = useUrlFlag('big')
  const ref = useRef<HTMLDivElement>(null)
  const [isFull, setIsFull] = useState(false)

  useEffect(() => {
    document.documentElement.classList.toggle('present', present)
    return () => document.documentElement.classList.remove('present')
  }, [present])

  useEffect(() => {
    const onChange = () => setIsFull(document.fullscreenElement !== null)
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])

  const toggleFull = () => {
    if (document.fullscreenElement) document.exitFullscreen()
    else ref.current?.requestFullscreen?.()
  }

  return (
    <div ref={ref} className="min-h-dvh bg-bg px-4 py-4 sm:px-8">
      <header className="mb-6 flex flex-wrap items-center gap-3">
        <Link to="/" className="text-ink-2 hover:text-ink" aria-label="חזרה לרשימת המפגשים">
          → כל המפגשים
        </Link>
        <div className="ms-auto flex flex-wrap gap-2">
          <Segmented
            value={teacher}
            onChange={setTeacher}
            options={[
              [false, 'סטודנט'],
              [true, 'מרצה'],
            ]}
          />
          <Toggle on={present} onClick={() => setPresent(!present)}>
            גופן גדול
          </Toggle>
          <Toggle on={isFull} onClick={toggleFull}>
            {isFull ? 'יציאה ממסך מלא' : 'מסך מלא'}
          </Toggle>
        </div>
      </header>
      {eyebrow && <p className="text-ink-2">{eyebrow}</p>}
      <h1 className="text-3xl font-bold sm:text-4xl">{title}</h1>
      {subtitle && <p className="mt-1 text-lg text-ink-2">{subtitle}</p>}
      <main className="mt-6">{children}</main>
    </div>
  )
}

function Toggle({ on, onClick, children }: { on: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className={`rounded-lg border px-3 py-1.5 ${
        on ? 'border-blue bg-blue/15 text-blue' : 'border-line bg-card text-ink-2 hover:text-ink'
      }`}
    >
      {children}
    </button>
  )
}

function Segmented<T>({
  value,
  onChange,
  options,
}: {
  value: T
  onChange: (v: T) => void
  options: [T, string][]
}) {
  return (
    <div className="flex overflow-hidden rounded-lg border border-line" role="group">
      {options.map(([v, label]) => (
        <button
          key={label}
          type="button"
          onClick={() => onChange(v)}
          aria-pressed={v === value}
          className={`px-3 py-1.5 ${v === value ? 'bg-orange/20 text-orange' : 'bg-card text-ink-2 hover:text-ink'}`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
