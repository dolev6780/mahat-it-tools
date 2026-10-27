import { ToolShell } from '../components/ToolShell'
import { checkNumbers, items, suppliers } from '../lib/data'
import { fmt, fmtILS } from '../lib/format'
import { useTeacherMode } from '../lib/urlState'

export function CompanyData() {
  const [teacher] = useTeacherMode()
  return (
    <ToolShell title="נתוני חברת התרגול" subtitle="הנתונים שכל הכלים משתמשים בהם">
      <div className="grid gap-6 lg:grid-cols-2">
        <Table
          caption="פריטים"
          head={['קוד', 'שם', 'מחיר']}
          rows={items.map((i) => [i.code, i.name, fmtILS(i.price)])}
        />
        <Table
          caption="ספקים"
          head={['קוד', 'שם', 'עיר']}
          rows={suppliers.map((s) => [s.code, s.name, s.city])}
        />
      </div>

      {teacher && (
        <section className="mt-6">
          <h2 className="mb-3 text-2xl font-bold">מספרי בדיקה</h2>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {Object.values(checkNumbers).map((c) => (
              <li key={c.label} className="rounded-xl border border-line bg-card p-3">
                <div className="text-ink-2">{c.label}</div>
                <div className="num font-display text-2xl font-bold text-blue">
                  {c.currency ? fmtILS(c.value) : fmt(c.value)}
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </ToolShell>
  )
}

function Table({ caption, head, rows }: { caption: string; head: string[]; rows: (string | number)[][] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-line bg-card">
      <table className="w-full border-collapse text-start">
        <caption className="p-3 text-start font-display text-xl font-bold">{caption}</caption>
        <thead>
          <tr className="border-y border-line text-ink-2">
            {head.map((h) => (
              <th key={h} className="px-3 py-2 text-start font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={String(r[0])} className="border-b border-line last:border-0">
              {r.map((c, i) => (
                <td key={i} className="px-3 py-2">
                  {/^[\d₪.,]+$/.test(String(c)) ? <span className="num">{c}</span> : c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
