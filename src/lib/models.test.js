import { describe, expect, it } from 'vitest'
import { eoqValues, transport } from './models'

describe('modelos NEFNODEL', () => {
  it('calcula el transporte combinado validado', () => {
    expect(transport({ boxes: 120, destination: 'Bodega', trucks: 6, people: 2, boxesPerPerson: 3, minutes: 12 })).toMatchObject({ capacity: 30, trips: 4, minutes: 48 })
  })
  it('calcula EOQ de I-RUN y reposición', () => {
    const result = eoqValues({ demand: 2351, orderCost: 103.41, holdingCost: 4.656168, usualOrder: 200 })
    expect(result.optimal).toBe(323)
    expect(result.reorder).toBe(23)
  })
})
