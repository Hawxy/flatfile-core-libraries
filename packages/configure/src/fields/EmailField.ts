import { makeField, setProp } from '../ddl/Field'

export const EmailField = makeField<string, { nonPublic?: boolean }>(
  (field) => {
    field.on('value', ({ data: { value } }) => {
      if (field.options.nonPublic && value.toLowerCase().includes('gmail')) {
        throw new Error('GMail addresses not allowed')
      }
      return { value }
    })
    return (base, key) => setProp(base, key, { type: 'string' })
  }
)
