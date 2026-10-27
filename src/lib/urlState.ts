import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'

/**
 * מצב שנשמר ב-URL (ולא ב-localStorage), כך שקישור משותף או רענון מחזירים לאותו מצב.
 * ערך ריק או ברירת מחדל נמחק מה-URL כדי לשמור קישורים קצרים.
 */
export function useUrlParam(key: string, fallback = ''): [string, (v: string) => void] {
  const [params, setParams] = useSearchParams()
  const value = params.get(key) ?? fallback
  const set = useCallback(
    (v: string) =>
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          if (v === '' || v === fallback) next.delete(key)
          else next.set(key, v)
          return next
        },
        { replace: true },
      ),
    [key, fallback, setParams],
  )
  return [value, set]
}

export function useUrlFlag(key: string): [boolean, (v: boolean) => void] {
  const [value, set] = useUrlParam(key)
  return [value === '1', (v: boolean) => set(v ? '1' : '')]
}

/** מצב מרצה (?mode=teacher) מציג פתרונות; ברירת המחדל היא מצב סטודנט. */
export function useTeacherMode(): [boolean, (v: boolean) => void] {
  const [mode, setMode] = useUrlParam('mode', 'student')
  return [mode === 'teacher', (v: boolean) => setMode(v ? 'teacher' : 'student')]
}
