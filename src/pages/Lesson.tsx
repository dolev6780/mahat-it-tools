import { Link, useParams } from 'react-router-dom'
import { ToolShell } from '../components/ToolShell'
import { lessons } from '../lib/data'
import { tools } from '../tools'
import { NotFound } from './NotFound'

export function Lesson() {
  const id = Number(useParams().id)
  const lesson = lessons.find((l) => l.id === id)
  if (!lesson) return <NotFound />

  const Tool = lesson.ready ? tools[id] : undefined
  return (
    <ToolShell eyebrow={`מפגש ${id}`} title={lesson.title} subtitle={lesson.summary}>
      {Tool ? (
        <Tool />
      ) : (
        <div className="rounded-xl border border-dashed border-line p-10 text-center">
          <p className="font-display text-3xl font-bold text-orange">בקרוב</p>
          <p className="mt-2 text-ink-2">הכלי למפגש הזה עדיין בהכנה.</p>
          <Link to="/" className="mt-4 inline-block text-blue hover:underline">
            חזרה לכל המפגשים
          </Link>
        </div>
      )}
    </ToolShell>
  )
}
