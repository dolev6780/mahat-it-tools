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
              className="block h-full rounded-xl border border-line bg-card p-4 hover:border-blue"
            >
              <span className="num text-sm text-ink-2">{l.id}</span>
              <h2 className="text-xl font-bold">{l.title}</h2>
              {l.summary && <p className="mt-1 text-ink-2">{l.summary}</p>}
              {!l.ready && <p className="mt-2 text-sm text-orange">בהכנה</p>}
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
