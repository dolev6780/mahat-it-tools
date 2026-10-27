// שומר על נתוני חברת התרגול: הם חייבים להתאים לשקפים. נכשל אם משהו השתנה.
import company from '../src/data/company.json' with { type: 'json' }
import { deepStrictEqual } from 'node:assert/strict'

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
