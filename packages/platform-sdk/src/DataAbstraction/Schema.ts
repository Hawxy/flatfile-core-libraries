import {
  IJsonSchema,
  JsonSchemaProperty,
  JsonSchemaPropertyWithArrayTypes,
} from '../types'
import { ISchemaProperty, ISchema, EPropertyType } from './SchemaPrime'

import { SchemaProperty, SPSanitize } from './SchemaProperty'

/**
 * Abstraction of the JSON Schema class
 * should be used for all interaction with the schema definition
 */
export class Schema implements ISchema {
  constructor(
    public readonly raw: IJsonSchema,
    public readonly page?: number
  ) {}

  /**
   * Return a virtualized property based on the key
   *
   * @param key
   * @returns
   */
  public getProperty(key: string): SchemaProperty {
    let prop = this.raw.properties?.[key] as JsonSchemaProperty
    if (!prop) {
      for (const name of this.propertyNames) {
        if (SPSanitize(name) === SPSanitize(key)) {
          key = name
          prop = this.raw.properties?.[key]
        }
      }
    }
    if (!prop) {
      throw new Error(`Property "${key}" not present in JSON Schema`)
    }
    if (typeof prop.type === 'string') {
      prop.type = [prop.type]
    }

    return new SchemaProperty(
      this,
      key,
      prop as JsonSchemaPropertyWithArrayTypes
    )
  }

  public hasRawProperty(key: string): boolean {
    return key in this.raw.properties
  }

  public hasSanitizedProperty(key: string): boolean {
    return this.propertyNames.some((name) => SPSanitize(name) === key)
  }

  /**
   * Return a list of properties in the schema
   */
  public get properties(): SchemaProperty[] {
    return this.propertyNames.map((k) => this.getProperty(k))
  }

  public get uniqueProperties(): SchemaProperty[] {
    if (!this.raw.unique) {
      return []
    }
    return this.raw.unique.map((name) => this.getProperty(name))
  }

  /**
   * Return a list of linked properties in the schema
   */
  public get linkedProperties(): ISchemaProperty[] {
    return this.properties.filter(
      (prop) => prop.type === EPropertyType.SCHEMA_REF
    )
  }

  /**
   * Returns a list of custom properties in the schema
   */
  public get customProperties(): SchemaProperty[] {
    return this.properties.filter((prop) => prop.custom === true)
  }

  /**
   * Using the index of the column in the table / schema, get the correlating key
   *
   * @param index
   * @returns
   */
  public getPropertyByIndex(index: number): SchemaProperty {
    if (!this.propertyNames[index]) {
      throw new Error(`No property found in schema at index "${index}"`)
    }
    return this.getProperty(this.propertyNames[index])
  }

  /**
   * Return a list of the propertyNames as defined by the schema
   */
  get propertyNames() {
    return Object.keys(this.raw?.properties ?? {})
  }

  public includesField(key: string): boolean {
    return this.propertyNames
      .map((rawKey) => SPSanitize(rawKey))
      .includes(SPSanitize(key))
  }

  public includes(key: string): boolean {
    return this.propertyNames
      .map((rawKey) => SPSanitize(rawKey))
      .includes(SPSanitize(key))
  }

  public slice(max_size: number): Schema[] {
    const rawSchema = this.raw
    const rawProperties = Object.keys(rawSchema.properties)
    const slicedSchemas: Schema[] = []
    let newSchema: IJsonSchema = {
      properties: {},
      type: rawSchema.type,
      required: [],
      unique: [],
    }
    let pageCount = 0
    for (const property of rawProperties) {
      newSchema.properties[property] = rawSchema.properties[property]
      if (rawSchema.required?.includes(property)) {
        newSchema.required!.push(property)
      }
      if (rawSchema.unique?.includes(property)) {
        newSchema.unique?.push(property)
      }
      if (Object.keys(newSchema.properties).length === max_size) {
        slicedSchemas.push(new Schema(newSchema, pageCount++))
        newSchema = {
          properties: {},
          type: rawSchema.type,
          required: [],
          unique: [],
        }
      }
    }
    if (Object.keys(newSchema.properties).length > 0) {
      slicedSchemas.push(new Schema(newSchema, pageCount))
    }
    return slicedSchemas
  }
}
