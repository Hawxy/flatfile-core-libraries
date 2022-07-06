export interface SchemaILField {
  type: 'string' | 'number' | 'boolean' | 'composite'
  label: string
  description?: string
  required?: boolean
  primary?: boolean
  unique?: boolean
}

export interface SchemaILModel<Fields extends Record<string, SchemaILField> = Record<string, SchemaILField>> {
  name: string
  slug: string
  namespace: string
  fields: Fields
  unique?: Array<keyof Fields | Array<keyof Fields>>
  primary?: keyof Fields
}
