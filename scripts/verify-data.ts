// שומר על נתוני חברת התרגול: הם חייבים להתאים לשקפים. נכשל אם משהו השתנה.
import company from '../src/data/company.json' with { type: 'json' }
import fileAccess from '../src/data/fileAccess.json' with { type: 'json' }
import d2k from '../src/data/dataToKnowledge.json' with { type: 'json' }
import { deepStrictEqual, equal } from 'node:assert/strict'
import { binaryProbes } from '../src/lib/fileAccess'
import { actions, inventoryValue, stockAfter } from '../src/lib/erp'
import { inContext, rows, sumQty, totalsBySupplier } from '../src/lib/receipts'

const pick = <T extends object, K extends keyof T>(arr: T[], keys: K[]) =>
  arr.map((o) => Object.fromEntries(keys.map((k) => [k, o[k]])))

deepStrictEqual(pick(company.items, ['code', 'name', 'price']), [
  { code: 1001, name: 'משטח עץ', price: 45 },
  { code: 1002, name: 'רדיד', price: 38 },
  { code: 1003, name: 'קרטון 40x30', price: 2.8 },
  { code: 1004, name: 'קרטון 60x40', price: 4.5 },
  { code: 1005, name: 'סרט', price: 6 },
  { code: 1006, name: 'מדבקות', price: 55 },
  { code: 1007, name: 'רצועות', price: 22 },
  { code: 1008, name: 'כפפות', price: 9 },
  { code: 1009, name: 'קרטון 30x20', price: 1.9 },
  { code: 1010, name: 'משטח פלסטיק', price: 85 },
])
deepStrictEqual(pick(company.suppliers, ['code', 'name', 'city']), [
  { code: 501, name: 'אריזות הנגב', city: 'באר שבע' },
  { code: 502, name: 'פלסט דרום', city: 'אשדוד' },
  { code: 503, name: 'משטחי הדרום', city: 'דימונה' },
])
deepStrictEqual(
  Object.fromEntries(Object.entries(company.checkNumbers).map(([k, v]) => [k, v.value])),
  { inventoryValue: 15580, outbound: 17342, inbound: 15600, supplierNegev: 14277, shipments: 3170 },
)
console.log('✓ נתוני חברת התרגול תקינים')

// כל כלי חייב להגיע בדיוק למספר הבדיקה שבשקף
const cn = company.checkNumbers

// מפגש 3: חיפוש בינארי לרשומת הבדיקה
equal(binaryProbes(fileAccess.records, fileAccess.check.record).length, fileAccess.check.value, 'מפגש 3: קריאות בינארי')

// מפגש 6: שווי מלאי אחרי כל הפעולות; כל פעולה ניתנת לביצוע בסדר הרשימה
const ids = actions.map((a) => a.id)
actions.forEach((a, i) => a.requires.forEach((r) => equal(ids.indexOf(r) < i, true, `מפגש 6: ${a.id} תלוי ב-${r}`)))
equal(inventoryValue(stockAfter(ids)), cn.inventoryValue.value, 'מפגש 6: ערך מלאי')
for (const [code, qty] of stockAfter(ids)) equal(qty >= 0, true, `מפגש 6: מלאי שלילי בפריט ${code}`)

// מפגש 10: סה"כ כניסות, והסינון לאריזות הנגב
equal(sumQty(rows), cn.inbound.value, 'מפגש 10: סה"כ כניסות')
equal(sumQty(rows.filter((r) => inContext(r, { supplier: 501, warehouse: null }))), cn.supplierNegev.value, 'מפגש 10: אריזות הנגב')

// מפגש 1: סיכום לפי ספק מגיע לסה"כ כניסות, ובדיוק תשובה נכונה אחת
const bySupplier = totalsBySupplier(rows)
equal(bySupplier.reduce((s, t) => s + t.qty, 0), cn.inbound.value, 'מפגש 1: סה"כ כניסות')
equal(bySupplier.find((t) => t.supplier === 501)?.qty, cn.supplierNegev.value, 'מפגש 1: אריזות הנגב')
equal(d2k.question.options.filter((o) => o.correct).length, 1, 'מפגש 1: תשובה נכונה אחת')

console.log('✓ מפגשים 1, 3, 6, 10 מגיעים למספרי הבדיקה')
