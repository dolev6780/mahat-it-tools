import receipts from '../data/receipts.json'

export type Receipt = (typeof receipts.rows)[number]
export type Warehouse = { id: number; name: string }

export const rows: Receipt[] = receipts.rows
export const warehouses: Warehouse[] = receipts.warehouses

/** null = "הכול" (הסלייסר לא מסנן) */
export type Filter = { supplier: number | null; warehouse: number | null }

export const inContext = (r: Receipt, f: Filter) =>
  (f.supplier === null || r.supplier === f.supplier) && (f.warehouse === null || r.warehouse === f.warehouse)

export const sumQty = (list: Receipt[]) => list.reduce((s, r) => s + r.qty, 0)

export type SupplierTotal = { supplier: number; count: number; qty: number }

/** שורה אחת לכל ספק, לפי סדר הקודים: מספר קבלות וסה"כ יחידות. */
export function totalsBySupplier(list: Receipt[]): SupplierTotal[] {
  const map = new Map<number, SupplierTotal>()
  for (const r of list) {
    const t = map.get(r.supplier) ?? { supplier: r.supplier, count: 0, qty: 0 }
    t.count += 1
    t.qty += r.qty
    map.set(r.supplier, t)
  }
  return [...map.values()].sort((a, b) => a.supplier - b.supplier)
}
