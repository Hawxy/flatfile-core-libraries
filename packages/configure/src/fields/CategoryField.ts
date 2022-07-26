import { makeField, setProp } from '../ddl/Field'

export const CategoryField = makeField<string, { categories?: Record<string, string> }>((opts) => {
  return (base, key) =>
    setProp(base, key, { type: 'enum', labelEnum: opts.options.categories })
})
