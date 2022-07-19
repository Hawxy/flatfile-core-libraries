import { IJsonSchema } from './types/JsonSchema'
import { SchemaILModel } from './types/SchemaIL'
import { compileEnum, compileToJsonSchema } from './convert'

const jsonSchema: IJsonSchema = {
  properties: {
    first_name: { type: 'string', label: 'First Name', field: 'first_name' },
    id: { type: 'number', label: 'Id', field: 'id' },
    is_admin: { type: 'boolean', label: 'Is Admin', field: 'is_admin' },
    color: {
      type: 'string',
      label: 'Color',
      field: 'color',
      enum: ['red', 'blue', 'green'],
      enumLabel: ['Red', 'Blue', 'Green'],
    },
  },
  type: 'object',
  required: ['first_name', 'id'],
  unique: ['id'],
  primary: 'id',
}

const ddlSchema: SchemaILModel = {
  fields: {
    first_name: {
      type: 'string',
      label: 'First Name',
      required: true,
      field: 'first_name',
    },
    id: {
      type: 'number',
      label: 'Id',
      required: true,
      primary: true,
      unique: true,
      field: 'id',
    },
    is_admin: {
      type: 'boolean',
      label: 'Is Admin',
      required: false,
      field: 'is_admin',
    },
    color: {
      field: 'color',
      label: 'Color',
      type: 'enum',
      labelEnum: { red: 'Red', blue: 'Blue', green: 'Green' },
      required: false,
    },
  },
  name: 'testSchema',
  slug: 'test',
  namespace: 'testspace',
}

describe('compiler tests', () => {
  it('checks enum compile function', () => {
    expect(
      compileEnum({
        type: 'enum',
        label: 'Color',
        field: 'color',
        labelEnum: { red: 'Red', blue: 'Blue', green: 'Green' },
      })
    ).toMatchObject({
      type: 'string',
      label: 'Color',
      enum: ['red', 'blue', 'green'],
      enumLabel: ['Red', 'Blue', 'Green'],
    })
  })

  it('tests a records validity on import', () => {
    expect(compileToJsonSchema(ddlSchema)).toMatchObject(jsonSchema)
  })
})
