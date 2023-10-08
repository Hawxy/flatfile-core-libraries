import fetch from 'node-fetch'
import { IFieldOptionDictionary, ISettings, IValidator } from '../types'

enum PlatformTypes {
  String = 'string',
  Num = 'number',
  Date = 'date',
  Enum = 'enum',
  Bool = 'boolean',
  Ref = 'reference',
}

type Constraint = {
  // these are the only 2 for conversion purposes
  type: 'unique' | 'required'
}

type Config = {
  options?: IFieldOptionDictionary[]
}

type INewField = {
  key: string
  label: string
  type: PlatformTypes
  description?: string
  config?: Config
  constraints?: Constraint[]
  metadata?: { v2_validators?: IValidator[] }
}

export const schemaConverter = async ({
  licenseKey,
  batchId,
  schema,
}: {
  licenseKey?: string
  batchId?: string
  schema?: ISettings
}): Promise<any> => {
  const convert = (convertObject: ISettings) => {
    let fieldsArray: INewField[] = []
    try {
      fieldsArray = convertObject.fields.map((field) => {
        let returnObject: INewField = {
          key: field.key,
          label: field.label,
          type: PlatformTypes.String,
        }

        if (field.description) {
          returnObject.description = field.description
        }
        if (field.type) {
          if (field.type === 'checkbox') {
            returnObject.type = PlatformTypes.Bool
          }
          if (field.type === 'select') {
            returnObject.type = PlatformTypes.Enum
            returnObject.config = { options: field.options }
          }
        }
        if (field.validators) {
          field.validators.forEach((validator: IValidator) => {
            if (validator.validate === 'required') {
              if (!returnObject.constraints) {
                returnObject.constraints = [{ type: 'required' }]
              } else {
                returnObject.constraints.push({ type: 'required' })
              }
            } else if (validator.validate === 'unique') {
              if (!returnObject.constraints) {
                returnObject.constraints = [{ type: 'unique' }]
              } else {
                returnObject.constraints.push({ type: 'unique' })
              }
            } else {
              if (!returnObject?.metadata?.v2_validators) {
                returnObject.metadata = {}
                returnObject.metadata.v2_validators = [validator]
              } else {
                returnObject.metadata.v2_validators.push(validator)
              }
            }
          })
        }
        return returnObject
      })
    } catch (e) {
      console.log(e)
    }
    return {
      name: schema?.type || 'No name provided',
      sheets: [
        {
          name: schema?.type || 'No sheet name',
          fields: fieldsArray,
        },
      ],
    }
  }
  if (schema) {
    return convert(schema)
  } else if (licenseKey) {
    const legacySettings = await fetch(
      `https://brewster.flaftile.com/api/upgrade/v2-schema?licenseKey=${licenseKey}${
        batchId ? '&batchId=' + batchId : null
      }`
    ).then(response => response.json()).then(data => data.data)
    return convert(legacySettings)
  } else {
    throw new Error('Must provide a schema or licenseKey')
  }
}
