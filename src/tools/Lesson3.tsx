import { useEffect, useMemo, useRef, useState } from 'react'
import fileAccess from '../data/fileAccess.json'
import { CheckNumber } from '../components/CheckNumber'
import { Button, Card } from '../components/ui'
import { binaryProbes, readsFor, worstCase, type Method } from '../lib/fileAccess'
import { fmt } from '../lib/format'
import { useTeacherMode, useUrlParam } from '../lib/urlState'

const N = fileAccess.records

const METHODS: { id: Method; name: string; how: string }[] = [
  { id: 'sequential', name: 'גישה סדרתית', how: 'קוראים רשומה אחרי רשומה מההתחלה, עד שמגיעים לרשומה.' },
  { id: 'binary', name: 'חיפוש בינארי', how: 'הקובץ ממוין. קוראים באמצע, ובכל קריאה חצי מהקובץ יורד מהחיפוש.' },
  { id: 'direct', name: 'גישה ישירה', how: 'מחשבים מהמפתח איפה הרשומה נמצאת וקופצים אליה.' },
]

// משכי האנימציה: הסדרתית איטית ביחס למרחק, הבינארית צעד אחרי צעד
const SEQ_MS_FULL = 7000
const BINARY_STEP_MS = 140
const DIRECT_MS = 300

const reducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

export function Lesson3() {
  const [teacher] = useTeacherMode()
  const [recParam, setRecParam] = useUrlParam('rec', String(fileAccess.defaultRecord))
  const target = clamp(Number(recParam) || 1)
  const probes = useMemo(() => binaryProbes(N, target), [target])

  // זמן שעבר מתחילת החיפוש; null = עוד לא חיפשו
  const [elapsed, setElapsed] = useState<number | null>(null)
  const [guesses, setGuesses] = useState<Record<Method, string>>({ sequential: '', binary: '', direct: '' })
  const raf = useRef(0)

  const seqMs = (target / N) * SEQ_MS_FULL
  const totalMs = Math.max(seqMs, probes.length * BINARY_STEP_MS, DIRECT_MS)
  const done = elapsed !== null && elapsed >= totalMs

  // החלפת רשומה מאפסת את החיפוש
  useEffect(() => {
    cancelAnimationFrame(raf.current)
    setElapsed(null)
  }, [target])

  useEffect(() => () => cancelAnimationFrame(raf.current), [])

  const run = () => {
    cancelAnimationFrame(raf.current)
    if (reducedMotion()) return setElapsed(totalMs)
    const start = performance.now()
    const tick = (now: number) => {
      const t = now - start
      setElapsed(Math.min(t, totalMs))
      if (t < totalMs) raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
  }

  const setTarget = (n: number) => setRecParam(String(clamp(n)))

  // מה כל שיטה הספיקה לקרוא עד עכשיו
  const shown = (m: Method): number => {
    if (elapsed === null) return 0
    if (m === 'sequential') return Math.min(target, Math.round((elapsed / seqMs) * target))
    if (m === 'binary') return Math.min(probes.length, Math.floor(elapsed / BINARY_STEP_MS) + 1)
    return elapsed >= DIRECT_MS ? 1 : 0
  }

  return (
    <div>
      <Card>
        <label htmlFor="rec" className="block text-ink-2">
          מחפשים את רשומה מספר (מתוך <span className="num">{fmt(N)}</span>)
        </label>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <input
            id="rec"
            type="number"
            inputMode="numeric"
            min={1}
            max={N}
            value={target}
            onChange={(e) => setTarget(Number(e.target.value))}
            className="num w-32 rounded-lg border border-line bg-bg px-3 py-2 font-display text-2xl text-ink"
          />
          <input
            type="range"
            min={1}
            max={N}
            value={target}
            onChange={(e) => setTarget(Number(e.target.value))}
            aria-label="בחירת רשומה"
            className="min-w-40 flex-1 accent-blue"
          />
          <Button variant="ghost" onClick={() => setTarget(1 + Math.floor(Math.random() * N))}>
            רשומה אקראית
          </Button>
          <Button onClick={run}>{elapsed === null ? 'חפש ▶' : 'חפש שוב ▶'}</Button>
        </div>
        {!teacher && elapsed === null && (
          <p className="mt-3 text-ink-2">לפני שמחפשים: כמה קריאות כל שיטה תצטרך? רשמו ניחוש בכל שורה.</p>
        )}
      </Card>

      <div className="mt-4 grid gap-3">
        {METHODS.map((m) => {
          const count = shown(m.id)
          const final = readsFor(m.id, N, target)
          const finished = elapsed !== null && count === final
          return (
            <Card key={m.id}>
              <div className="flex flex-wrap items-start gap-x-6 gap-y-2">
                <div className="grow basis-48">
                  <h2 className="text-xl font-bold">{m.name}</h2>
                  <p className="text-ink-2">{m.how}</p>
                </div>

                {!teacher && (
                  <label className="flex flex-col text-sm text-ink-2">
                    הניחוש שלי
                    <input
                      type="number"
                      inputMode="numeric"
                      min={1}
                      value={guesses[m.id]}
                      onChange={(e) => setGuesses({ ...guesses, [m.id]: e.target.value })}
                      className="num mt-1 w-28 rounded-lg border border-line bg-bg px-2 py-1 text-lg text-ink"
                    />
                  </label>
                )}

                <div className="text-end">
                  <div className="text-sm text-ink-2">קריאות</div>
                  <div
                    className={`num font-display text-4xl font-bold ${finished ? 'text-blue' : 'text-orange'}`}
                    aria-live="polite"
                  >
                    {elapsed === null ? '—' : fmt(count)}
                  </div>
                </div>
              </div>

              <Strip method={m.id} target={target} count={count} probes={probes} active={elapsed !== null} />

              {m.id === 'binary' && elapsed !== null && (
                <p className="mt-2 flex flex-wrap gap-x-1 text-sm text-ink-2">
                  {probes.slice(0, count).map((p, i) => (
                    <span key={i} className="num">
                      {i > 0 && '← '}
                      <span className={p === target ? 'font-bold text-blue' : ''}>{fmt(p)}</span>
                    </span>
                  ))}
                </p>
              )}

              {(teacher || done) && (
                <p className="mt-2 text-sm text-ink-2">
                  במקרה הגרוע ביותר: <span className="num font-bold text-ink">{fmt(worstCase(m.id, N))}</span> קריאות
                  {!teacher && guesses[m.id] !== '' && done && (
                    <>
                      {' · '}ניחשתם <span className="num">{fmt(Number(guesses[m.id]))}</span>
                    </>
                  )}
                </p>
              )}
            </Card>
          )
        })}
      </div>

      {teacher && (
        <Card className="mt-4">
          <h2 className="text-xl font-bold">למה זה חשוב</h2>
          <p className="mt-1 text-ink-2">
            בגישה סדרתית מספר הקריאות גדל יחד עם הקובץ. בחיפוש בינארי, הכפלת הקובץ מוסיפה רק קריאה אחת. בגישה ישירה זו
            תמיד קריאה אחת, אבל צריך דרך לחשב את המיקום מהמפתח.
          </p>
        </Card>
      )}

      <CheckNumber
        target={{ label: fileAccess.check.label, value: fileAccess.check.value, currency: false }}
        value={done && target === fileAccess.check.record ? probes.length : null}
        hint={`חפשו את רשומה ${fmt(fileAccess.check.record)} והשוו את מספר הקריאות בחיפוש הבינארי לשקף.`}
      />
    </div>
  )
}

/** פס של כל הרשומות בקובץ; רשומה 1 בצד ההתחלה (ימין). */
function Strip({
  method,
  target,
  count,
  probes,
  active,
}: {
  method: Method
  target: number
  count: number
  probes: number[]
  active: boolean
}) {
  const pos = (r: number) => `${((r - 1) / (N - 1)) * 100}%`
  return (
    <div className="relative mt-3 h-8 overflow-hidden rounded-md border border-line bg-bg" aria-hidden>
      {active && method === 'sequential' && (
        <div className="absolute inset-y-0 start-0 bg-blue/40" style={{ width: `${(count / N) * 100}%` }} />
      )}
      {active &&
        method === 'binary' &&
        probes.slice(0, count).map((p, i) => (
          <div
            key={i}
            className={`absolute inset-y-0 w-1 ${i === count - 1 ? 'bg-orange' : 'bg-blue'}`}
            style={{ insetInlineStart: pos(p) }}
          />
        ))}
      {active && method === 'direct' && count > 0 && (
        <div className="absolute inset-y-0 w-1.5 bg-blue" style={{ insetInlineStart: pos(target) }} />
      )}
      {/* סימון הרשומה המבוקשת */}
      <div
        className="absolute inset-y-0 w-0.5 border-s-2 border-dashed border-orange"
        style={{ insetInlineStart: pos(target) }}
      />
    </div>
  )
}

function clamp(n: number) {
  return Math.min(N, Math.max(1, Math.round(n)))
}
