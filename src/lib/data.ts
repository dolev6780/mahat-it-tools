import company from '../data/company.json'
import lessonsData from '../data/lessons.json'

export type Item = { code: number; name: string; price: number }
export type Supplier = { code: number; name: string; city: string }
export type CheckTarget = { label: string; value: number; currency: boolean }
export type CheckKey = keyof typeof company.checkNumbers
export type Lesson = { id: number; title: string; summary: string; ready: boolean }

export const items: Item[] = company.items
export const suppliers: Supplier[] = company.suppliers
export const checkNumbers: Record<CheckKey, CheckTarget> = company.checkNumbers
export const lessons: Lesson[] = lessonsData.lessons

export const itemByCode = (code: number) => items.find((i) => i.code === code)
export const supplierByCode = (code: number) => suppliers.find((s) => s.code === code)
