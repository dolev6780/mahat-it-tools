import { Link } from 'react-router-dom'
import { lessons } from '../lib/data'

export function Home() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-8">
      <p className="text-ink-2">מה"ט · לוגיסטיקה · 14176</p>
      <h1 className="mt-1 text-4xl font-bold">כלי המחשה – טכנולוגיות מידע</h1>

      <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {lessons.map((l) => (
          <li key={l.id}>
            <Link
              to={`/lesson/${l.id}`}
              className={`flex h-full flex-col rounded-xl border p-4 ${
                l.ready ? 'border-line bg-card hover:border-blue' : 'border-dashed border-line hover:border-ink-2'
              }`}
            >
              <span className="text-sm text-ink-2">
                מפגש <span className="num">{l.id}</span>
              </span>
              <h2 className={`text-xl font-bold ${l.ready ? '' : 'text-ink-2'}`}>{l.ready ? l.title : 'בקרוב'}</h2>
              {l.ready && l.summary && <p className="mt-1 text-ink-2">{l.summary}</p>}
              {l.ready && <span className="mt-auto pt-3 font-bold text-blue">לכלי ←</span>}
            </Link>
          </li>
        ))}
      </ul>

      <Link to="/data" className="mt-8 inline-block text-blue hover:underline">
        נתוני חברת התרגול ←
      </Link>
    </div>
  )
}
