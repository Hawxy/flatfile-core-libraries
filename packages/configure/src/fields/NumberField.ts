import { makeField } from '../old/models/Field'

export const NumberField = makeField((field) => {
  return (base) => ({ ...base, type: 'number' })
})
