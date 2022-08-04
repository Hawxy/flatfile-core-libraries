import { FlatfileRecord, FlatfileRecords } from '@flatfile/hooks'
import {
  IJsonSchema,
  SchemaILModel,
  SchemaILToJsonSchema,
} from '@flatfile/schema'

import { Field } from './Field'
import { toPairs } from 'remeda'
import { isFullyPresent } from '../utils/isFullyPresent'

type Unique = {
  [K in Extract<keyof FieldConfig, string>]: { [value: string]: number[] }
}
export class UniqueAndRequiredPlugin {
  public run(fields: FieldConfig, records: FlatfileRecord<any>[]): void {
    const uniques: Unique = {} as Unique

    const requiredFields: Extract<keyof FieldConfig, string>[] = []

    // build initial uniques and requiredFields
    for (let x in fields) {
      if (fields[x].options.unique === true) {
        uniques[x] = {}
      }
      if (fields[x].options.required === true) {
        requiredFields.push(x)
      }
    }

    records.map((record, index) => {
      // check required fields and add error if missing
      requiredFields.forEach((field) => {
        const value = record.get(field)
        if (!isFullyPresent(value)) {
          record.addError(field, 'Required Value')
        }
      })

      // add to unique fields if not already in there
      for (let uniqueFieldKey in uniques) {
        const value = String(record.get(uniqueFieldKey))
        if (!!uniques[uniqueFieldKey][value]) {
          uniques[uniqueFieldKey][value].push(index)
        } else {
          // only add to uniques array if value is not null || undefined
          if (isFullyPresent(value)) {
            uniques[uniqueFieldKey][value] = [index]
          }
        }
      }
    })

    // add errors for unique fields
    for (let uniqueFieldKey in uniques) {
      for (let value in uniques[uniqueFieldKey]) {
        if (uniques[uniqueFieldKey][value].length > 1) {
          const indexes = uniques[uniqueFieldKey][value]
          indexes.forEach((index) => {
            records[index].addError(uniqueFieldKey, 'Value must be unique')
          })
        }
      }
    }
  }
}

export type RecordsComputeType = (
  records: FlatfileRecords<any>
) => Promise<void>

export const DEFAULT_RECORDS_COMPUTE: RecordsComputeType = async (
  records: FlatfileRecords<any>
) => {}

export interface SheetOptions<FC> {
  allowCustomFields: boolean
  readOnly: boolean
  recordCompute(record: FlatfileRecord<any>, logger?: any): void
  asyncRecordsCompute: RecordsComputeType
}

export class Sheet<FC extends FieldConfig> {
  public plugins: {
    [name: string]: (fields: FC, records: FlatfileRecord<any>[]) => any
  } = {}
  public options: SheetOptions<FC> = {
    allowCustomFields: true,
    readOnly: false,
    recordCompute(): void {},
    asyncRecordsCompute: DEFAULT_RECORDS_COMPUTE,
  }

  constructor(
    public name: string,
    public fields: FC,
    public passedOptions?: Partial<SheetOptions<FC>>
  ) {
    if (passedOptions) {
      Object.assign(this.options, passedOptions)
    }
  }

  public async runProcess(records: FlatfileRecords<any>, logger: any) {
    records.records.map((record: FlatfileRecord) => {
      toPairs(this.fields).map(([key, field]) => {
        const origVal = record.get(key)
        const [newVal, message] = field.computeToValue(origVal)
        if (newVal !== undefined) {
          record.set(key, newVal)
        }
        if (message) {
          record.pushInfoMessage(
            key,
            message.message,
            message.level,
            message.stage
          )
        }
        return record
      })
    })

    records.records.map(async (record: FlatfileRecord) => {
      this.options.recordCompute(record, logger) //, session, logger)
    })

    // Run recordCompute record hook
    if (this.options.asyncRecordsCompute !== DEFAULT_RECORDS_COMPUTE) {
      await this.options.asyncRecordsCompute(records)
    }

    records.records.map(async (record: FlatfileRecord) => {
      toPairs(this.fields).map(async ([key, field]) => {
        const origVal = record.get(key)
        const messages = field.validate(origVal)
        if (messages) {
          messages.map((m) => {
            record.addError(key, m.message)
          })
        }
      })
    })

    // Checks if running on Lambda based on if the logger is defined
    if (!logger) {
      const testPlugin = new UniqueAndRequiredPlugin()
      testPlugin.run(this.fields, records.records)
    }
  }

  public toSchemaIL(namespace: string, slug: string): SchemaILModel {
    let base: SchemaILModel = {
      name: this.name,
      slug,
      namespace,
      fields: {},
    }

    for (const key in this.fields) {
      base.fields[key] = this.fields[key].toSchemaILField(key)
    }
    return base
  }

  public toJSONSchema(namespace: string, slug: string): IJsonSchema {
    return SchemaILToJsonSchema(this.toSchemaIL(namespace, slug))
  }
}

export type FieldConfig = Record<string, Field<any, any>>
