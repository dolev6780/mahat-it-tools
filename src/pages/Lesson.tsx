import { useParams } from 'react-router-dom'
import { ToolShell } from '../components/ToolShell'
import { lessons } from '../lib/data'
import { tools } from '../tools'
import { NotFound } from './NotFound'

export function Lesson() {
  const id = Number(useParams().id)
  const lesson = lessons.find((l) => l.id === id)
  if (!lesson) return <NotFound />

  const Tool = tools[id]
  return (
    <ToolShell title={lesson.title} subtitle={lesson.summary}>
      {Tool ? (
        <Tool />
      ) : (
        <div className="rounded-xl border border-dashed border-line p-8 text-center text-ink-2">
          הכלי לשיעור הזה עדיין בהכנה.
        </div>
      )}
    </ToolShell>
  )
}
