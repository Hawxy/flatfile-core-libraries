import { HookContract, HookProvider } from "../lib/HookProvider";
import { capitalCase } from "case-anything";
import { SchemaILEntity, SchemaILField } from "@flatfile/schema";

export class Field<
  O extends Record<string, any>
> extends HookProvider<FieldEventRegistry> {
  public constructor(public options: O & GenericFieldOptions = {} as O) {
    super()
  }

  public registerSerializer(
    cb: (base: SchemaILEntity, key: string) => SchemaILEntity
  ) {
    this.configFactory = cb
  }

  public toSchemaIL(baseSchema: SchemaILEntity, key: string): SchemaILEntity {
    return this.configFactory(baseSchema, key)
  }

  private configFactory: (base: SchemaILEntity, key: string) => SchemaILEntity =
    (base) => base
}

export type FieldEventRegistry = {
  change: HookContract<
    { value: string },
    void | { value: string; disabled?: boolean }
  >
}

export function makeField<
  O extends Record<string, any> = {},
  A extends [] = []
>(
  factory: (
    field: Field<O & GenericFieldOptions>
  ) => (base: SchemaILEntity, key: string) => SchemaILEntity
) {
  function fieldHelper(): Field<O>
  function fieldHelper(opts?: O & GenericFieldOptions): Field<O>
  function fieldHelper(label: string, opts?: O & GenericFieldOptions): Field<O>
  function fieldHelper(
    labelOpts?: string | O,
    opts?: O & GenericFieldOptions
  ): Field<O> {
    const label = typeof labelOpts === 'string' ? labelOpts : undefined
    const mergedOpts = (labelOpts !== 'string' ? labelOpts : opts) ?? {}
    const options = {
      label,
      ...mergedOpts,
    } as unknown as O
    const field = new Field(options)
    const serializer = factory(field)
    field.registerSerializer(serializer)
    return field
  }

  return fieldHelper
}

export function setProp(
  base: SchemaILEntity,
  key: string,
  prop: Partial<SchemaILField>
): SchemaILEntity {
  return {
    ...base,
    fields: {
      ...base.fields,
      [key]: {
        label: capitalCase(key),
        type: 'string',
        ...prop,
      },
    },
  }
}

export interface GenericFieldOptions {
  /**
   * Describe the field
   */
  description?: string
  required?: boolean
  unique?: boolean
}
