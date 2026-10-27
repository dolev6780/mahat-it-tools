import { fmt, fmtILS } from '../lib/format'
import { checkNumbers, type CheckKey } from '../lib/data'
import { useTeacherMode } from '../lib/urlState'

type Props = {
  /** איזה מספר בדיקה מהשקף הכלי אמור להפיק */
  check: CheckKey
  /** הערך שהכלי חישב כרגע; null כשהסטודנט עוד לא סיים */
  value: number | null
}

/**
 * פס תחתון שכל כלי מסתיים בו: מציג את התוצאה להשוואה מול השקף.
 * במצב מרצה מוצג גם המספר הנכון וסימון התאמה.
 */
export function CheckNumber({ check, value }: Props) {
  const [teacher] = useTeacherMode()
  const target = checkNumbers[check]
  const show = target.currency ? fmtILS : fmt
  const match = value !== null && Math.abs(value - target.value) < 0.005

  return (
    <div className="mt-6 rounded-xl border border-line bg-card p-4 flex flex-wrap items-center gap-x-6 gap-y-2">
      <span className="text-ink-2">מספר בדיקה · {target.label}</span>
      <span className="num font-display text-3xl font-bold text-blue">
        {value === null ? '—' : show(value)}
      </span>
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
  )
}
