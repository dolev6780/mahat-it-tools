import { CheckNumber } from '../components/CheckNumber'
import { Button, Card, Chip } from '../components/ui'
import { checkNumbers, itemByCode, supplierByCode, suppliers } from '../lib/data'
import { fmt } from '../lib/format'
import { inContext, rows, sumQty, warehouses, type Filter } from '../lib/receipts'
import { useTeacherMode, useUrlParams } from '../lib/urlState'

const NEGEV = 501

export function Lesson10() {
  const [teacher] = useTeacherMode()
  const [params, setParams] = useUrlParams()
  const sParam = params.get('s') ?? ''
  const wParam = params.get('w') ?? ''
  const filter: Filter = {
    supplier: suppliers.some((s) => String(s.code) === sParam) ? Number(sParam) : null,
    warehouse: warehouses.some((w) => String(w.id) === wParam) ? Number(wParam) : null,
  }
  const setFilter = (f: Filter) =>
    setParams({
      s: f.supplier === null ? '' : String(f.supplier),
      w: f.warehouse === null ? '' : String(f.warehouse),
    })

  const included = rows.filter((r) => inContext(r, filter))
  const total = sumQty(included)
  const grand = sumQty(rows)

  return (
    <div>
      <p className="text-lg text-ink-2">
        טבלת קבלות סחורה מספקים. כל סלייסר מוסיף תנאי, והסכום מחושב רק על השורות שעומדות בכל התנאים.
      </p>

      {/* סלייסרים */}
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <Card>
          <h2 className="text-lg font-bold">ספק</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            <Chip on={filter.supplier === null} onClick={() => setFilter({ ...filter, supplier: null })}>
              הכול
            </Chip>
            {suppliers.map((s) => (
              <Chip key={s.code} on={filter.supplier === s.code} onClick={() => setFilter({ ...filter, supplier: s.code })}>
                {s.name}
              </Chip>
            ))}
          </div>
        </Card>
        <Card>
          <h2 className="text-lg font-bold">מחסן</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            <Chip on={filter.warehouse === null} onClick={() => setFilter({ ...filter, warehouse: null })}>
              הכול
            </Chip>
            {warehouses.map((w) => (
              <Chip key={w.id} on={filter.warehouse === w.id} onClick={() => setFilter({ ...filter, warehouse: w.id })}>
                {w.name}
              </Chip>
            ))}
          </div>
        </Card>
      </div>

      {/* הסכום בהקשר הנוכחי מול הסה"כ */}
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Card className="border-blue">
          <div className="text-ink-2">סכום הכמות בהקשר הנוכחי</div>
          <div className="num font-display text-5xl font-bold text-blue" aria-live="polite">
            {fmt(total)}
          </div>
          <div className="mt-1 text-ink-2">
            {describe(filter)} · <span className="num">{included.length}</span> מתוך{' '}
            <span className="num">{rows.length}</span> שורות
          </div>
        </Card>
        <Card>
          <div className="text-ink-2">סה"כ כללי (בלי סינון)</div>
          <div className="num font-display text-5xl font-bold">{fmt(grand)}</div>
          <div className="mt-1 text-ink-2">לא משתנה כשבוחרים סלייסר</div>
        </Card>
      </div>

      {teacher && (
        <Card className="mt-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-xl font-bold">כל הקשר הוא תא: ספק × מחסן</h2>
            <Button onClick={() => setFilter({ supplier: NEGEV, warehouse: null })}>הצג פתרון</Button>
          </div>
          <Pivot filter={filter} onPick={setFilter} />
        </Card>
      )}

      {/* טבלת הנתונים: השורות שבהקשר מודגשות */}
      <Card className="mt-4">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-line text-ink-2">
                {['#', 'תאריך', 'ספק', 'מחסן', 'פריט', 'כמות'].map((h) => (
                  <th key={h} className="px-2 py-1.5 text-start font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const on = inContext(r, filter)
                return (
                  <tr
                    key={r.id}
                    className={`border-b border-line transition-opacity last:border-0 ${
                      on ? 'bg-blue/15 font-semibold' : 'opacity-35'
                    }`}
                  >
                    <td className={`px-2 py-1.5 ${on ? 'border-s-4 border-blue' : 'border-s-4 border-transparent'}`}>
                      <span className="num text-ink-2">{r.id}</span>
                    </td>
                    <td className="px-2 py-1.5">
                      <span className="num">{r.date}</span>
                    </td>
                    <td className="px-2 py-1.5">{supplierByCode(r.supplier)?.name}</td>
                    <td className="px-2 py-1.5">{warehouses.find((w) => w.id === r.warehouse)?.name}</td>
                    <td className="px-2 py-1.5">{itemByCode(r.item)?.name}</td>
                    <td className="px-2 py-1.5">
                      <span className="num">{fmt(r.qty)}</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-line">
                <td colSpan={5} className="px-2 py-2 font-bold">
                  סכום השורות המודגשות
                </td>
                <td className="px-2 py-2">
                  <span className="num font-display text-xl font-bold text-blue">{fmt(total)}</span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>

      <CheckNumber
        target={checkNumbers.supplierNegev}
        value={total}
        hint="סננו לפי הספק אריזות הנגב, בלי לסנן מחסן. הסכום צריך להתאים לשקף."
      />
    </div>
  )
}

function describe(f: Filter) {
  const parts = [
    f.supplier !== null && `ספק = ${supplierByCode(f.supplier)?.name}`,
    f.warehouse !== null && `מחסן = ${warehouses.find((w) => w.id === f.warehouse)?.name}`,
  ].filter(Boolean)
  return parts.length ? parts.join(' וגם ') : 'בלי סינון'
}

/** טבלת ציר: כל תא הוא הקשר סינון משלו. לחיצה על תא מפעילה את הסלייסרים המתאימים. */
function Pivot({ filter, onPick }: { filter: Filter; onPick: (f: Filter) => void }) {
  const cell = (supplier: number | null, warehouse: number | null) => {
    const f = { supplier, warehouse }
    const active = f.supplier === filter.supplier && f.warehouse === filter.warehouse
    return (
      <td key={`${supplier}-${warehouse}`} className="p-1">
        <button
          type="button"
          onClick={() => onPick(f)}
          aria-pressed={active}
          className={`num w-full rounded-md px-2 py-1.5 text-start ${
            active ? 'bg-blue font-bold text-bg' : 'bg-bg hover:bg-line'
          }`}
        >
          {fmt(sumQty(rows.filter((r) => inContext(r, f))))}
        </button>
      </td>
    )
  }
  return (
    <div className="mt-3 overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="text-ink-2">
            <th className="px-2 py-1 text-start font-semibold">ספק \ מחסן</th>
            {warehouses.map((w) => (
              <th key={w.id} className="px-2 py-1 text-start font-semibold">
                {w.name}
              </th>
            ))}
            <th className="px-2 py-1 text-start font-semibold">סה"כ</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map((s) => (
            <tr key={s.code}>
              <th className="px-2 py-1 text-start font-semibold">{s.name}</th>
              {warehouses.map((w) => cell(s.code, w.id))}
              {cell(s.code, null)}
            </tr>
          ))}
          <tr>
            <th className="px-2 py-1 text-start font-semibold">סה"כ</th>
            {warehouses.map((w) => cell(null, w.id))}
            {cell(null, null)}
          </tr>
        </tbody>
      </table>
    </div>
  )
}
