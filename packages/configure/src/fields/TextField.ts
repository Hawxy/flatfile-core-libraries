import { makeField, setProp } from '../ddl/Field'

export const TextField = makeField<string>((opts) => {
  return (base, key) => setProp(base, key, { type: 'string' })
})
