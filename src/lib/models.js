export const DEFAULT_TRUCK_MINUTES = { Sucursal: 9, Bodega: 12, Central: 24 }

export function transport({ boxes, destination, trucks, people, boxesPerPerson, minutes }) {
  const capacity = trucks * 4 + people * boxesPerPerson
  if (!Number.isFinite(boxes) || boxes < 0 || capacity <= 0) return { capacity, trips: 0, minutes: 0, distribution: [] }
  const trips = Math.ceil(boxes / capacity)
  const total = trips * minutes
  const distribution = Array.from({ length: trips }, (_, i) => Math.min(capacity, Math.max(0, boxes - i * capacity)))
  return { capacity, trips, minutes: total, distribution }
}

export function eoqValues({ demand, orderCost, holdingCost, usualOrder }) {
  const raw = Math.sqrt((2 * demand * orderCost) / holdingCost)
  const candidates = [Math.floor(raw), Math.ceil(raw)].filter(q => q > 0)
  const annualCost = q => (demand / q) * orderCost + (q / 2) * holdingCost
  const optimal = candidates.sort((a, b) => annualCost(a) - annualCost(b))[0]
  return { raw, optimal, optimalCost: annualCost(optimal), usualCost: annualCost(usualOrder), orders: demand / optimal, reorder: Math.round((demand / 12 / 26) * 3), annualCost }
}

export function preparationMinutes(boxes) {
  if (boxes === 50) return 60
  if (boxes === 120) return 300
  return Math.round(boxes * 2.5)
}

export const money = value => `Q${value.toLocaleString('es-GT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
export const number = value => value.toLocaleString('es-GT', { maximumFractionDigits: 0 })
