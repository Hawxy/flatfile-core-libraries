import { makeField, setProp } from '../ddl/Field'

export const EmailField = makeField<{ nonPublic?: boolean }>((field) => {
  field.on('change', ({ body: { value } }) => {
    if (field.options.nonPublic && value.includes('gmail')) {
      throw new Error('GMail addresses not allowed')
    }
    return { value }
  })
  return (base, key) => setProp(base, key, { type: 'string' })
})
