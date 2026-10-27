import type { ComponentType } from 'react'

/**
 * רישום הכלים: מספר שיעור → רכיב הכלי.
 * כלי חדש: יוצרים src/tools/LessonN.tsx, מוסיפים כאן, ומסמנים ready ב-src/data/lessons.json.
 */
export const tools: Partial<Record<number, ComponentType>> = {}
