import { makeField, setProp } from '../ddl/Field'

export const NumberField = makeField<number>(() => {
  return (base, key) => setProp(base, key, { type: 'number' })
})
