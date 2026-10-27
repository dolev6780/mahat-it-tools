import { fmt, fmtILS } from '../lib/format'
import type { CheckTarget } from '../lib/data'
import { useTeacherMode } from '../lib/urlState'

type Props = {
  /** המספר שבשקף (בדרך כלל מ-checkNumbers) */
  target: CheckTarget
  /** הערך שהכלי חישב כרגע; null כשהסטודנט עוד לא סיים */
  value: number | null
  /** הנחיה קצרה: מה צריך לעשות כדי להגיע למספר */
  hint?: string
}

/**
 * פס תחתון שכל כלי מסתיים בו: מציג את התוצאה להשוואה מול השקף.
 * במצב מרצה מוצג גם המספר הנכון וסימון התאמה.
 */
export function CheckNumber({ target, value, hint }: Props) {
  const [teacher] = useTeacherMode()
  const show = target.currency ? fmtILS : fmt
  const match = value !== null && Math.abs(value - target.value) < 0.005

  return (
    <div className="mt-8 rounded-xl border-2 border-line bg-card p-4">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
        <span className="text-ink-2">מספר בדיקה · {target.label}</span>
        <span className="num font-display text-3xl font-bold text-blue">{value === null ? '—' : show(value)}</span>
        {teacher && (
          <span className="ms-auto flex items-center gap-3">
            <span className="text-ink-2">בשקף:</span>
            <span className="num font-display text-2xl">{show(target.value)}</span>
            {value !== null && (
              <span
                className={`rounded-full px-3 py-0.5 text-sm font-bold ${
                  match ? 'bg-blue/20 text-blue' : 'bg-orange/20 text-orange'
                }`}
              >
                {match ? 'תואם ✓' : 'לא תואם'}
              </span>
            )}
          </span>
        )}
      </div>
      {hint && <p className="mt-1 text-sm text-ink-2">{hint}</p>}
    </div>
  )
}
