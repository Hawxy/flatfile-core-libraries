import { JsonSchemaPropertyWithArrayTypes } from '../types'

import md5 from 'md5'

import {
  TPrimitive,
  EPropertyType,
  IEnumOption,
  ISchema,
  ISchemaProperty,
} from './SchemaPrime'

export function SPSanitize(rawKey: string): string {
  const sanitizedKey = rawKey.replace(/[\W]/g, '')
  if (sanitizedKey.length > 50) {
    // MySQL limits column names to 64 characters. We need 14 characters for the suffix "_match_key_sub"
    const hash = md5(rawKey)
    return `${sanitizedKey.substring(0, 30)}__${hash.substring(0, 18)}` // 30 + 2 + 18 + 14 = 64
  }
  return sanitizedKey
}

export class SchemaProperty implements ISchemaProperty {
  constructor(
    protected schema: ISchema,
    private readonly rawKey: string,
    private readonly definition: JsonSchemaPropertyWithArrayTypes
  ) {}

  public sanitize(rawKey: string): string {
    return SPSanitize(rawKey)
  }
  public get key(): string {
    return SPSanitize(this.rawKey)
  }

  public get originalKey(): string {
    return this.rawKey
  }

  public get unique(): boolean {
    return this.schema.raw.unique?.includes(this.rawKey) ?? false
  }

  public get custom(): boolean {
    return !!this.definition.custom
  }

  public get schemaId(): number | undefined {
    return this.definition.$schemaId
      ? parseInt(this.definition.$schemaId, 10)
      : undefined
  }

  public get label(): string | undefined {
    return this.definition.label
  }

  public get type(): EPropertyType {
    const { type = [] } = this.definition ?? {}

    if (type.includes(EPropertyType.SCHEMA_REF)) {
      return EPropertyType.SCHEMA_REF
    }

    if ('enum' in this.definition) {
      return EPropertyType.ENUM
    }

    if (type.includes('boolean')) {
      return EPropertyType.BOOLEAN
    }

    if (type.includes('number')) {
      return EPropertyType.NUMERIC
    }

    return EPropertyType.DEFAULT
  }

  /**
   * Return a list of properly formatted enum options based on the JSON Schema
   */
  get options(): IEnumOption[] {
    if (!this.definition.enum) {
      throw new Error('this is not an enum property type')
    }
    return this.definition.enum.map((value, i) => {
      // @ts-ignore: enumLabel is something Flatfile adds :(
      const label = this.definition.enumLabel[i]
      return { value: value as unknown as TPrimitive, label }
    })
  }

  get default(): JsonSchemaPropertyWithArrayTypes['default'] {
    return this.definition.default
  }
}
