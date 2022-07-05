import { makeField, setProp } from '../ddl/Field'

export const TextField = makeField(() => {
  return (base, key) => setProp(base, key, { type: 'string' })
})
