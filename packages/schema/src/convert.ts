import { SchemaILModel, SchemaILField } from './types/SchemaIL'
import { IJsonSchema } from './types/JsonSchema'
import {
  filter,
  fromPairs,
  isTruthy,
  map,
  mapValues,
  pick,
  pipe,
  values,
} from 'remeda'

export const SchemaILToJsonSchema = (ddl: SchemaILModel): IJsonSchema => {
  // probably refactor
  const fields = pipe(
    ddl.fields,
    mapValues((value, field): SchemaILField & { field: string } => ({
      ...value,
      field,
    })),
    values
  )

  const required = pipe(
    fields,
    filter((f) => isTruthy(f.required)),
    map((f) => f.field)
  )

  const pks = pipe(
    fields,
    filter((f) => isTruthy(f.primary)),
    map((f) => f.field)
  )

  const properties = pipe(
    fields,
    map((f) => tuple(f.field, pick(f, ['type', 'label', 'field']))),
    (v) => fromPairs(v)
  )

  return {
    properties,
    type: 'object',
    required: required,
    unique: pks,
    primary: pks[0],
  }
}

function tuple<A, B>(a: A, b: B): [A, B] {
  return [a, b]
}
