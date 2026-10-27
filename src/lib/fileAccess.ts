/** חישובי מפגש 3: כמה קריאות כל שיטה צריכה כדי להגיע לרשומה מספר `target` בקובץ של `n` רשומות. */

export type Method = 'sequential' | 'binary' | 'direct'

/** סדרתית: קוראים מההתחלה עד שמגיעים לרשומה. */
export const sequentialReads = (target: number) => target

/** בינארית (קובץ ממוין): כל קריאה חוצה את הטווח שנשאר. מחזירה את הרשומות שנקראו לפי הסדר. */
export function binaryProbes(n: number, target: number): number[] {
  const probes: number[] = []
  let lo = 1
  let hi = n
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2)
    probes.push(mid)
    if (mid === target) break
    if (mid < target) lo = mid + 1
    else hi = mid - 1
  }
  return probes
}

/** ישירה: מחשבים את מיקום הרשומה מהמפתח וקוראים אותה פעם אחת. */
export const directReads = () => 1

export function readsFor(method: Method, n: number, target: number) {
  if (method === 'sequential') return sequentialReads(target)
  if (method === 'binary') return binaryProbes(n, target).length
  return directReads()
}

/** המקרה הגרוע ביותר לכל שיטה */
export function worstCase(method: Method, n: number) {
  if (method === 'sequential') return n
  if (method === 'binary') return Math.floor(Math.log2(n)) + 1
  return 1
}
