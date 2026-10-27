const nf = new Intl.NumberFormat('he-IL', { maximumFractionDigits: 2 })

export const fmt = (n: number) => nf.format(n)
export const fmtILS = (n: number) => `₪${nf.format(n)}`
