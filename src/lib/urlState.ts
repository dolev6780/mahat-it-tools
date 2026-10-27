import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'

/**
 * מצב שנשמר ב-URL (ולא ב-localStorage), כך שקישור משותף או רענון מחזירים לאותו מצב.
 * ערך ריק נמחק מה-URL כדי לשמור קישורים קצרים.
 *
 * כמה מפתחות שמשתנים יחד חייבים לעבור בקריאה אחת ל-`set`: קריאות עוקבות באותו אירוע
 * מתחילות כולן מאותו URL, והאחרונה דורסת את הקודמות.
 */
export function useUrlParams(): [URLSearchParams, (changes: Record<string, string>) => void] {
  const [params, setParams] = useSearchParams()
  const set = useCallback(
    (changes: Record<string, string>) => {
      // קוראים את ה-URL הנוכחי ישירות, כדי לא להסתמך על params מרינדור קודם
      const query = window.location.hash.split('?')[1] ?? ''
      const next = new URLSearchParams(query)
      for (const [k, v] of Object.entries(changes)) {
        if (v === '') next.delete(k)
        else next.set(k, v)
      }
      setParams(next, { replace: true })
    },
    [setParams],
  )
  return [params, set]
}

export function useUrlParam(key: string, fallback = ''): [string, (v: string) => void] {
  const [params, set] = useUrlParams()
  const value = params.get(key) ?? fallback
  const setOne = useCallback((v: string) => set({ [key]: v === fallback ? '' : v }), [key, fallback, set])
  return [value, setOne]
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
