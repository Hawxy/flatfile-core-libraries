import {
  JsonSchema,
  EMessageLevel,
  IJsonSchema,
  ISchemaProperty,
  IValidationError,
} from '../../types'

import { TPrimitive, EValidationType, ICell, IRecord } from '../SchemaPrime'

import { validatePhoneNumber } from './ValidationUtils'
import Ajv, { ErrorObject } from 'ajv'

import { Transformation } from './Transformation'

export function ensureDataPath(error: IValidationError) {
  if (error.dataPath.length > 0) {
    return error
  }
  if ('missingProperty' in error.params) {
    return {
      ...error,
      message: 'Required value',
      dataPath: `.${error.params.missingProperty}`,
    }
  }
  return {
    ...error,
    dataPath: '.UNKNOWN',
  }
}

// ajv returns different datapaths for fields with spaces.
// eg:
// * for 'name', datapath is '.name'
// * for 'phone no', its "['phone no']"
// * for 'first.Name' its '.first.Name
// So we are using a regex to get the key from the datapath property.
export const extractAjvKey = (dataPath: string) => {
  const key = new RegExp(/\['(.*?)\']/).exec(dataPath)
  const final = key
    ? key[1]
    : dataPath.charAt(0) === '.'
    ? dataPath.substr(1)
    : undefined
  if (!final) {
    throw new Error(`cannot read key from: ${dataPath}`)
  }
  return final
}

interface AJVValidationTransformationOptions {
  jsonSchema: IJsonSchema
}

const TRUTHY_VALUES = ['1', 'yes', 'true', 'on', 't', 'y']
const FALSY_VALUES = ['0', 'no', 'false', 'off', 'f', 'n']
//const ajv = new Ajv({ allErrors: true, nullable: true, meta: IJsonSchema })
const ajv = new Ajv({ allErrors: true, nullable: true, meta: JsonSchema })

ajv.addFormat('phone', (phoneNumberString) => {
  return validatePhoneNumber(phoneNumberString)
})

export class AJVValidationTransformation extends Transformation<
  AJVValidationTransformationOptions,
  IRecord[],
  IRecord[]
> {
  public async transform(records: IRecord[]): Promise<IRecord[]> {
    if (!ajv.validateSchema(this.schemaThatHandlesNullValues)) {
      throw new Error('JSON schema is invalid.')
    }

    const { properties } = this.schemaThatHandlesNullValues
    return new Promise((resolve) => {
      resolve(
        records.map((record) => {
          const data = this.transformCellsObject(Object.values(record.cells))
          ajv.validate(this.schemaThatHandlesNullValues, data)
          const ajvValidationErrors: IValidationError[] | [] = ajv.errors
            ? ajv.errors.map((ajvError) => ({
                ...(ajvError.dataPath
                  ? this.updateValidationMessage(
                      ajvError,
                      properties[extractAjvKey(ajvError.dataPath)]
                    )
                  : ajvError),
                level: EMessageLevel.ERROR,
              }))
            : []
          const additionalValidationErrors =
            this.additionalValidationErrors(data)
          const rowErrors: IValidationError[] = [
            ...ajvValidationErrors,
            ...additionalValidationErrors,
          ]
          record.validations = record.validations.concat(
            rowErrors.map(ensureDataPath).map((error) => ({
              error: error.level,
              key: extractAjvKey(error.dataPath),
              message: error.message,
              type: EValidationType.valueError,
            }))
          )
          record.upToDateValidations = true
          record.updateFromObject(data)
          return record
        })
      )
    })
  }

  public updateValidationMessage(
    error: ErrorObject,
    prop: ISchemaProperty
  ): ErrorObject {
    switch (error.keyword) {
      case 'maximum': {
        const { maximum, minimum } = prop
        error.message =
          typeof minimum !== 'undefined'
            ? `Value must be between ${minimum} and ${maximum}`
            : `Value must be less than ${maximum}`
        break
      }
      case 'minimum': {
        const { maximum, minimum } = prop
        error.message =
          typeof maximum !== 'undefined'
            ? `Value must be between ${minimum} and ${maximum}`
            : `Value must be greater than ${minimum}`
        break
      }
      case 'type': {
        const {
          type: [type],
        } = prop
        error.message = `Value is not a ${type}`
        break
      }
      case 'format': {
        const { format } = prop
        let detailedFormat = format
        if (format === 'phone') {
          detailedFormat = `${format} number`
        }
        if (format === 'email') {
          detailedFormat = `${format} address`
        }
        error.message = `Not a valid ${detailedFormat}`
        break
      }
    }
    return error
  }

  // Additional validation always produces errors with a level: 'error'
  private additionalValidationErrors(data: any): IValidationError[] {
    const jsonSchema = this.schemaThatHandlesNullValues
    return Object.keys(jsonSchema.properties).reduce(
      (errors: IValidationError[], key) => {
        const property = jsonSchema.properties[key]
        if (property.regexp) {
          if (!property.regexp.cache) {
            property.regexp.cache = new RegExp(
              property.regexp.pattern,
              property.regexp.flags
            )
          }
          const isEmpty = data[key] === null || data[key] === undefined
          const value = isEmpty ? '' : String(data[key])

          // resetting regexp last index for each test
          property.regexp.cache.lastIndex = 0
          if (
            (value !== '' || !property.regexp.ignoreBlanks) &&
            !property.regexp.cache.test(value)
          ) {
            return [
              ...errors,
              {
                keyword: '',
                dataPath: `.${key}`,
                schemaPath: key,
                params: {},
                message: 'Value does not match the required format',
                level: EMessageLevel.ERROR,
              },
            ]
          }

          if (property.format === 'phone' && !validatePhoneNumber(value)) {
            return [
              ...errors,
              {
                keyword: '',
                dataPath: `.${key}`,
                schemaPath: key,
                params: {},
                message: 'Not a valid phone number',
                level: EMessageLevel.ERROR,
              },
            ]
          }
        }

        return errors
      },
      [] as IValidationError[]
    )
  }

  private transformCellsObject(cells: ICell[]): { [k: string]: any } {
    const jsonSchema = this.schemaThatHandlesNullValues
    const transformValue = (cell: ICell) => {
      const value = cell.value

      const schemaProp = jsonSchema.properties[cell.property.originalKey]

      if ('$schemaId' in schemaProp) {
        return value
      }

      if (schemaProp && schemaProp.type.includes('number')) {
        const numericValue = Number(value)
        if (value !== '' && value !== null && !isNaN(numericValue)) {
          return numericValue
        } else {
          if (!value) {
            return null
          }
        }
      }

      if (schemaProp && schemaProp.type.includes('boolean')) {
        if (value === null || value === '') {
          return null
        }
        const cleanedValue = value.toString().trim().toLowerCase()
        if (TRUTHY_VALUES.includes(cleanedValue)) {
          return true
        }
        if (FALSY_VALUES.includes(cleanedValue)) {
          return false
        }
      }

      if (schemaProp && schemaProp.type.includes('string')) {
        if (typeof value === 'number') {
          return value.toString()
        } else if (!value) {
          return null
        }
      }

      return value
    }

    return Object.entries(cells).reduce((obj, d) => {
      const cell = d[1]
      const cellKey = cell.property.originalKey
      let transformed: TPrimitive = null
      if (
        Object.keys(this.configuration.jsonSchema.properties).includes(cellKey)
      ) {
        transformed = transformValue(cell)
      }
      if (transformed === null) {
        return obj
      }
      return Object.assign(obj, { [cellKey]: transformed })
    }, {})
  }

  private get schemaThatHandlesNullValues(): any {
    const jsonSchema = { ...this.configuration.jsonSchema } as any
    for (const column in jsonSchema.properties) {
      if (jsonSchema.properties.hasOwnProperty(column)) {
        if (
          !jsonSchema.required?.includes(column) &&
          typeof jsonSchema.properties[column].type === 'string'
        ) {
          jsonSchema.properties[column].type = [
            jsonSchema.properties[column].type as string,
            'null',
          ]
        }
      }
    }
    return jsonSchema
  }
}
