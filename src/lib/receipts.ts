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
