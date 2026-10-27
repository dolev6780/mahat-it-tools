import { useState } from 'react'
import { CheckNumber } from '../components/CheckNumber'
import { Button, Card, Chip } from '../components/ui'
import { checkNumbers, items } from '../lib/data'
import { actions, canRun, inventoryValue, modules, stockAfter, type ErpAction } from '../lib/erp'
import { fmt, fmtILS } from '../lib/format'
import { useTeacherMode, useUrlParams } from '../lib/urlState'

/** מצב המודול אחרי חשיפת התשובה, מול מה שהסטודנט סימן */
type Verdict = 'hit' | 'missed' | 'wrong' | 'idle'

export function Lesson6() {
  const [teacher] = useTeacherMode()
  const [params, setParams] = useUrlParams()
  const doneParam = params.get('done') ?? ''
  const selectedId = params.get('a') ?? ''
  const done = doneParam ? doneParam.split(',').filter((id) => actions.some((a) => a.id === id)) : []
  const selected = actions.find((a) => a.id === selectedId)

  // הניחושים של הסטודנט לפעולה הנבחרת (לא קריטי, לכן לא ב-URL)
  const [guess, setGuess] = useState<Set<string>>(new Set())

  const revealed = selected !== undefined && (teacher || done.includes(selected.id))
  const stock = stockAfter(done)
  const value = inventoryValue(stock)
  const lastDone = actions.find((a) => a.id === done[done.length - 1])

  const select = (a: ErpAction) => {
    setParams({ a: a.id })
    setGuess(new Set())
  }
  const run = () => {
    if (selected && canRun(selected, done)) setParams({ done: [...done, selected.id].join(',') })
  }
  const reset = () => {
    setParams({ done: '', a: '' })
    setGuess(new Set())
  }
  const toggleGuess = (id: string) => {
    if (revealed) return
    const next = new Set(guess)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setGuess(next)
  }

  const verdict = (moduleId: string): Verdict => {
    if (!selected || !revealed) return 'idle'
    const updates = moduleId in selected.updates
    if (teacher) return updates ? 'hit' : 'idle'
    if (updates) return guess.has(moduleId) ? 'hit' : 'missed'
    return guess.has(moduleId) ? 'wrong' : 'idle'
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(16rem,1fr)_2fr]">
      {/* רשימת הפעולות */}
      <Card>
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-xl font-bold">פעולות</h2>
          <span className="num text-ink-2">
            {done.length}/{actions.length}
          </span>
        </div>
        <ol className="mt-3 grid gap-2">
          {actions.map((a, i) => {
            const isDone = done.includes(a.id)
            const locked = !isDone && !canRun(a, done)
            const needs = a.requires.map((r) => actions.find((x) => x.id === r)?.title).join(', ')
            return (
              <li key={a.id}>
                <Chip on={a.id === selectedId} onClick={() => select(a)}>
                  <span className="flex items-baseline gap-2">
                    <span className="num text-sm text-ink-2">{i + 1}</span>
                    <span className={isDone ? 'text-ink-2 line-through decoration-blue' : ''}>{a.title}</span>
                    {isDone && <span className="text-blue">✓</span>}
                  </span>
                  {locked && <span className="block text-sm text-ink-2">קודם: {needs}</span>}
                </Chip>
              </li>
            )
          })}
        </ol>
        <div className="mt-4">
          <Button variant="ghost" onClick={reset} disabled={done.length === 0 && !selectedId}>
            התחלה מחדש
          </Button>
        </div>
      </Card>

      <div className="grid content-start gap-4">
        {/* הפעולה הנבחרת */}
        <Card>
          {selected ? (
            <>
              <h2 className="text-2xl font-bold">{selected.title}</h2>
              <p className="mt-1 text-lg">{selected.desc}</p>
              {!revealed && <p className="mt-2 text-orange">סמנו את המודולים שלדעתכם יתעדכנו, ואז לחצו "בצע ובדוק".</p>}
              <div className="mt-3 flex flex-wrap gap-2">
                {done.includes(selected.id) ? (
                  <span className="text-blue">הפעולה בוצעה ✓</span>
                ) : (
                  <Button onClick={run} disabled={!canRun(selected, done)}>
                    {teacher ? 'בצע' : 'בצע ובדוק'}
                  </Button>
                )}
              </div>
            </>
          ) : (
            <p className="text-lg text-ink-2">בחרו פעולה מהרשימה.</p>
          )}
        </Card>

        {/* המודולים סביב מסד נתונים אחד */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {modules.map((m) => (
            <ModuleCard
              key={m.id}
              name={m.name}
              desc={m.desc}
              guessed={guess.has(m.id)}
              verdict={verdict(m.id)}
              update={revealed ? selected?.updates[m.id] : undefined}
              clickable={selected !== undefined && !revealed}
              onClick={() => toggleGuess(m.id)}
            />
          ))}
          <div className="col-span-2 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-line p-3 text-center sm:col-span-1">
            <span className="font-display text-lg font-bold">מסד נתונים אחד</span>
            <span className="text-sm text-ink-2">כל המודולים קוראים וכותבים לאותם נתונים</span>
          </div>
        </div>

        {!teacher && revealed && selected && guess.size > 0 && <Score selected={selected} guess={guess} />}

        {/* מצב המלאי */}
        <Card>
          <h2 className="text-xl font-bold">מלאי</h2>
          <div className="mt-2 overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-line text-ink-2">
                  <th className="px-2 py-1 text-start font-semibold">פריט</th>
                  <th className="px-2 py-1 text-start font-semibold">כמות</th>
                  <th className="px-2 py-1 text-start font-semibold">שווי</th>
                </tr>
              </thead>
              <tbody>
                {items.map((i) => {
                  const qty = stock.get(i.code) ?? 0
                  const delta = lastDone?.stock.find((s) => s.code === i.code)?.delta
                  return (
                    <tr key={i.code} className={`border-b border-line last:border-0 ${delta ? 'bg-blue/10' : ''}`}>
                      <td className="px-2 py-1">
                        <span className="num text-ink-2">{i.code}</span> {i.name}
                      </td>
                      <td className="px-2 py-1">
                        <span className="num">{fmt(qty)}</span>
                        {delta !== undefined && (
                          <span className={`num ms-3 text-sm font-bold ${delta > 0 ? 'text-blue' : 'text-orange'}`}>
                            ({delta > 0 ? `+${fmt(delta)}` : `−${fmt(-delta)}`})
                          </span>
                        )}
                      </td>
                      <td className="px-2 py-1">
                        <span className="num">{fmtILS(qty * i.price)}</span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>

        <CheckNumber
          target={checkNumbers.inventoryValue}
          value={value}
          hint={`בצעו את כל ${actions.length} הפעולות. שווי המלאי בסוף צריך להתאים לשקף.`}
        />
      </div>
    </div>
  )
}

function ModuleCard({
  name,
  desc,
  guessed,
  verdict,
  update,
  clickable,
  onClick,
}: {
  name: string
  desc: string
  guessed: boolean
  verdict: Verdict
  update?: string
  clickable: boolean
  onClick: () => void
}) {
  const style = {
    hit: 'border-blue bg-blue/15',
    missed: 'border-orange border-dashed bg-orange/10',
    wrong: 'border-orange bg-card opacity-70',
    idle: guessed ? 'border-orange bg-card' : 'border-line bg-card',
  }[verdict]
  const tag = { hit: 'מתעדכן', missed: 'פספסתם – מתעדכן', wrong: 'לא מתעדכן', idle: guessed ? 'סימנתם' : '' }[verdict]

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!clickable}
      aria-pressed={guessed}
      className={`rounded-xl border-2 p-3 text-start transition-colors ${style} ${clickable ? 'hover:border-ink-2' : 'cursor-default'}`}
    >
      <div className="flex items-baseline justify-between gap-2">
        <span className="font-display text-lg font-bold">{name}</span>
        {tag && (
          <span className={`text-sm font-bold ${verdict === 'hit' ? 'text-blue' : 'text-orange'}`}>{tag}</span>
        )}
      </div>
      <p className="text-sm text-ink-2">{update ?? desc}</p>
    </button>
  )
}

function Score({ selected, guess }: { selected: ErpAction; guess: Set<string> }) {
  const correct = Object.keys(selected.updates)
  const hits = correct.filter((id) => guess.has(id)).length
  const wrong = [...guess].filter((id) => !correct.includes(id)).length
  const perfect = hits === correct.length && wrong === 0
  return (
    <p className={`text-lg font-bold ${perfect ? 'text-blue' : 'text-orange'}`}>
      {perfect
        ? `מצוין – זיהיתם את כל ${correct.length} המודולים.`
        : `זיהיתם ${hits} מתוך ${correct.length} מודולים${wrong ? `, ו-${wrong} סימונים מיותרים` : ''}.`}
    </p>
  )
}
