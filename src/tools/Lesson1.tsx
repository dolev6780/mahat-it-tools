import d2k from '../data/dataToKnowledge.json'
import { CheckNumber } from '../components/CheckNumber'
import { Button, Card, Chip } from '../components/ui'
import { checkNumbers, itemByCode, supplierByCode } from '../lib/data'
import { fmt } from '../lib/format'
import { rows, sumQty, totalsBySupplier, warehouses, type Receipt } from '../lib/receipts'
import { useTeacherMode, useUrlParams } from '../lib/urlState'

const { stages, steps, question } = d2k
const LAST = steps.length - 1

// סדר "כפי שהוקלד": ערבוב קבוע (5 זר ל-13, אז כל שורה מופיעה פעם אחת)
const rawOrder = [...rows].sort((a, b) => ((a.id * 5) % rows.length) - ((b.id * 5) % rows.length))
const sortedOrder = [...rows].sort((a, b) => a.supplier - b.supplier || a.id - b.id)

const warehouseName = (id: number) => warehouses.find((w) => w.id === id)?.name

export function Lesson1() {
  const [teacher] = useTeacherMode()
  const [params, setParams] = useUrlParams()
  const step = Math.min(LAST, Math.max(0, Number(params.get('step')) || 0))
  const answer = question.options.find((o) => o.id === params.get('k'))
  const stepId = steps[step].id

  // באיזה שלב של השרשרת אנחנו: עד הסיכום – נתונים בעיבוד, בסיכום – מידע, אחרי תשובה נכונה – ידע
  const stage = answer?.correct ? 'knowledge' : step === LAST ? 'info' : 'data'
  const total = sumQty(rows)

  const go = (n: number) => setParams({ step: n === 0 ? '' : String(n), k: '' })

  return (
    <div>
      <Pipeline current={stage} processing={step > 0 && step < LAST} />

      <Card className="mt-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-ink-2">
            שלב <span className="num">{step + 1}</span> מתוך <span className="num">{steps.length}</span>
          </span>
          <h2 className="text-2xl font-bold">{steps[step].title}</h2>
          <div className="ms-auto flex gap-2">
            <Button variant="ghost" onClick={() => go(step - 1)} disabled={step === 0}>
              → הקודם
            </Button>
            <Button onClick={() => go(step + 1)} disabled={step === LAST}>
              {step === 0 ? 'התחילו לעבד ←' : 'הבא ←'}
            </Button>
          </div>
        </div>
        <p className="mt-1 text-lg">{steps[step].desc}</p>
      </Card>

      <Card className="mt-4">
        {stepId === 'group' || stepId === 'total' ? (
          <SummaryTable withTotal={stepId === 'total'} total={total} />
        ) : (
          <RowsTable list={stepId === 'sort' ? sortedOrder : rawOrder} named={stepId !== 'raw'} sorted={stepId === 'sort'} />
        )}
      </Card>

      {step === LAST && (
        <Card className="mt-4">
          <h2 className="text-xl font-bold">{question.prompt}</h2>
          <div className="mt-3 grid gap-2">
            {question.options.map((o) => {
              const show = teacher || answer?.id === o.id
              return (
                <div key={o.id}>
                  <Chip on={answer?.id === o.id} onClick={() => setParams({ k: o.id })}>
                    <span className="flex items-baseline gap-2">
                      {show && (
                        <span className={`font-bold ${o.correct ? 'text-blue' : 'text-orange'}`}>
                          {o.correct ? '✓' : '✗'}
                        </span>
                      )}
                      {o.text}
                    </span>
                  </Chip>
                  {show && <p className={`mt-1 ps-3 ${o.correct ? 'text-blue' : 'text-orange'}`}>{o.why}</p>}
                </div>
              )
            })}
          </div>
        </Card>
      )}

      <CheckNumber
        target={checkNumbers.inbound}
        value={step === LAST ? total : null}
        hint={'עברו את כל שלבי העיבוד עד "סה"כ ואחוזים". הסה"כ צריך להתאים לשקף.'}
      />
    </div>
  )
}

/** השרשרת נתונים → עיבוד → מידע → ידע, עם הדגשת השלב הנוכחי */
function Pipeline({ current, processing }: { current: string; processing: boolean }) {
  const idx = stages.findIndex((s) => s.id === current)
  return (
    <div>
      <ol className="flex flex-wrap items-stretch gap-2">
        {stages.map((s, i) => (
          <li key={s.id} className="flex items-center gap-2">
            {i > 0 && (
              <span className={`text-center text-sm ${i === 1 && processing ? 'font-bold text-orange' : 'text-ink-2'}`}>
                {i === 1 ? 'עיבוד ←' : '←'}
              </span>
            )}
            <span
              className={`rounded-xl border-2 px-4 py-2 font-display text-xl font-bold ${
                i === idx ? 'border-blue bg-blue/15 text-blue' : i < idx ? 'border-line text-ink' : 'border-line text-ink-2'
              }`}
            >
              {s.name}
            </span>
          </li>
        ))}
      </ol>
      <p className="mt-2 text-ink-2">
        <span className="font-bold text-ink">{stages[idx].name}:</span> {stages[idx].def}
      </p>
    </div>
  )
}

function RowsTable({ list, named, sorted }: { list: Receipt[]; named: boolean; sorted: boolean }) {
  // עמודה שהשתנתה בשלב הזה מסומנת בכחול
  const head = (label: string, changed: boolean) => (
    <th key={label} className={`px-1.5 py-1.5 sm:px-2 text-start font-semibold ${changed ? 'text-blue' : 'text-ink-2'}`}>
      {label}
      {changed && sorted && ' ↓'}
    </th>
  )
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-line">
            {head('תאריך', false)}
            {head(named ? 'ספק' : 'קוד ספק', named || sorted)}
            {head(named ? 'פריט' : 'קוד פריט', named && !sorted)}
            {head(named ? 'מחסן' : 'קוד מחסן', named && !sorted)}
            {head('כמות', false)}
          </tr>
        </thead>
        <tbody>
          {list.map((r) => (
            <tr key={r.id} className="border-b border-line last:border-0">
              <td className="px-1.5 py-1.5 sm:px-2">
                <span className="num">{r.date}</span>
              </td>
              <td className="px-1.5 py-1.5 sm:px-2">{named ? supplierByCode(r.supplier)?.name : <span className="num">{r.supplier}</span>}</td>
              <td className="px-1.5 py-1.5 sm:px-2">{named ? itemByCode(r.item)?.name : <span className="num">{r.item}</span>}</td>
              <td className="px-1.5 py-1.5 sm:px-2">{named ? warehouseName(r.warehouse) : <span className="num">{r.warehouse}</span>}</td>
              <td className="px-1.5 py-1.5 sm:px-2">
                <span className="num">{fmt(r.qty)}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function SummaryTable({ withTotal, total }: { withTotal: boolean; total: number }) {
  const pct = (qty: number) => `${((qty / total) * 100).toFixed(1)}%`
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse sm:text-lg">
        <thead>
          <tr className="border-b border-line text-ink-2">
            <th className="px-1.5 py-2 sm:px-2 text-start font-semibold">ספק</th>
            <th className="px-1.5 py-2 sm:px-2 text-start font-semibold">קבלות</th>
            <th className="px-1.5 py-2 sm:px-2 text-start font-semibold">יחידות</th>
            {withTotal && <th className="px-1.5 py-2 sm:px-2 text-start font-semibold text-blue">חלק מהכלל</th>}
          </tr>
        </thead>
        <tbody>
          {totalsBySupplier(rows).map((t) => (
            <tr key={t.supplier} className="border-b border-line">
              <td className="px-1.5 py-2 sm:px-2">{supplierByCode(t.supplier)?.name}</td>
              <td className="px-1.5 py-2 sm:px-2">
                <span className="num">{t.count}</span>
              </td>
              <td className="px-1.5 py-2 sm:px-2">
                <span className="num font-bold">{fmt(t.qty)}</span>
              </td>
              {withTotal && (
                <td className="px-1.5 py-2 sm:px-2">
                  <span className="num">{pct(t.qty)}</span>
                </td>
              )}
            </tr>
          ))}
        </tbody>
        {withTotal && (
          <tfoot>
            <tr className="border-t-2 border-blue">
              <td className="px-1.5 py-2 sm:px-2 font-bold">סה"כ</td>
              <td className="px-1.5 py-2 sm:px-2">
                <span className="num">{rows.length}</span>
              </td>
              <td className="px-1.5 py-2 sm:px-2">
                <span className="num font-display text-xl font-bold text-blue sm:text-2xl">{fmt(total)}</span>
              </td>
              <td />
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  )
}
