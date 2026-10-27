import erp from '../data/erp.json'
import { items } from './data'

export type ModuleId = (typeof erp.modules)[number]['id']
export type ErpModule = { id: string; name: string; desc: string }
export type ErpAction = {
  id: string
  title: string
  desc: string
  requires: string[]
  updates: Partial<Record<string, string>>
  stock: { code: number; delta: number }[]
}

export const modules: ErpModule[] = erp.modules
export const actions: ErpAction[] = erp.actions

/** כמות לכל פריט אחרי ביצוע הפעולות שב-`done` (מלאי פתיחה + שינויים). */
export function stockAfter(done: string[]): Map<number, number> {
  const stock = new Map(erp.openingStock.map((s) => [s.code, s.qty]))
  for (const a of actions) {
    if (!done.includes(a.id)) continue
    for (const s of a.stock) stock.set(s.code, (stock.get(s.code) ?? 0) + s.delta)
  }
  return stock
}

export function inventoryValue(stock: Map<number, number>) {
  // עיגול לאגורות כדי שמחירים כמו 2.8 ו-1.9 לא ייצרו שאריות של נקודה צפה
  const total = items.reduce((sum, i) => sum + (stock.get(i.code) ?? 0) * i.price, 0)
  return Math.round(total * 100) / 100
}

export const canRun = (a: ErpAction, done: string[]) =>
  !done.includes(a.id) && a.requires.every((r) => done.includes(r))
