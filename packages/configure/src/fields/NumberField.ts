import { makeField } from '../ddl/Field'

export const NumberField = makeField<number>(() => {
  return (base) => ({ ...base, type: 'number' })
})
