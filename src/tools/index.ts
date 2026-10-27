import type { ComponentType } from 'react'
import { Lesson1 } from './Lesson1'
import { Lesson3 } from './Lesson3'
import { Lesson6 } from './Lesson6'
import { Lesson10 } from './Lesson10'

/**
 * רישום הכלים: מספר מפגש → רכיב הכלי.
 * כלי חדש: יוצרים src/tools/LessonN.tsx, מוסיפים כאן, ומסמנים ready ב-src/data/lessons.json.
 */
export const tools: Partial<Record<number, ComponentType>> = {
  1: Lesson1,
  3: Lesson3,
  6: Lesson6,
  10: Lesson10,
}
