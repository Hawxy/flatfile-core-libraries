
export interface BaseSchemaILField {
  type: 'string' | 'number' | 'boolean' | 'composite'
  label: string
  field: string
  description?: string
  required?: boolean
  primary?: boolean
  unique?: boolean
}

export interface SchemaILEnumField {
  type: 'enum'
  // enum: { label: string; value: string }[]
  // enumLabel: string[]
  labelEnum: Record<string, string>
  label: string
  field: string
  description?: string
  required?: boolean
  primary?: boolean
  unique?: boolean
}

export type SchemaILField = BaseSchemaILField | SchemaILEnumField


export interface SchemaILModel<Fields extends Record<string, SchemaILField> = Record<string, SchemaILField>> {
  name: string
  slug: string
  namespace: string
  fields: Fields
  unique?: Array<keyof Fields | Array<keyof Fields>>
  primary?: keyof Fields
}
