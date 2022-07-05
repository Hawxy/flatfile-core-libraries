import { makeField } from '../ddl/Field'

export const NumberField = makeField(() => {
  return (base) => ({ ...base, type: 'number' })
})
