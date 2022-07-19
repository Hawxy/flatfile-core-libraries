import { makeField, setProp } from '../ddl/Field'

export const BooleanField = makeField<boolean>((opts) => {
  return (base, key) => setProp(base, key, { type: 'boolean' })
})
