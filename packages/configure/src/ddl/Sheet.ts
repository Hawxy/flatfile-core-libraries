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

      /*
The PostgreSQL doesn't fail a unique constraint for multiple NULLs in the same column. we should do the same. Other DBs have different behavior.
This thread gives some insight into the background
https://dba.stackexchange.com/questions/80514/why-does-a-unique-constraint-allow-only-one-null

https://stackoverflow.com/questions/20154033/allow-null-in-unique-column
https://www.postgresql.org/docs/current/ddl-constraints.html#DDL-CONSTRAINTS-UNIQUE-CONSTRAINTS

	*/
      // add to unique fields if not already in there
      for (let uniqueFieldKey in uniques) {
        const origValue = record.get(uniqueFieldKey)
        //can't index object by a boolean
        const value =
          typeof origValue === 'boolean' ? String(origValue) : origValue
        // can't index an object by null
        if (value === null) {
          continue
        }
        const uniqueObj = uniques[uniqueFieldKey]

        if (isFullyPresent(uniqueObj[value])) {
          uniqueObj[value].push(index)
        } else {
          // only add to uniques array if value is not null || undefined
          if (isFullyPresent(value)) {
            uniqueObj[value] = [index]
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

export type RecordCompute = {
  dependsOn?: string[] // fields that must be fully present
  uses?: string[] // fields that will be read, but could be null
  modifies?: string[] // the full set of fields which could be written to
  (record: FlatfileRecord<any>, logger?: any): void
}

export interface SheetOptions<FC> {

  allowCustomFields: boolean
  readOnly: boolean
  recordCompute: RecordCompute
  batchRecordsCompute: RecordsComputeType
  previewFieldKey?: string
}

export class Sheet<FC extends FieldConfig> {
  public options: SheetOptions<FC> = {
    allowCustomFields: true,
    readOnly: false,
    recordCompute(): void {},
    // the default implementation of batchRecordsCompute is a no-op
    batchRecordsCompute: async (records: FlatfileRecords<any>) => {},
  }

  private contributedRecordFuncs: Record<string, RecordCompute> = {}
  public idFromAPI: string | undefined

  constructor(
    public name: string,
    //TODO FIXME Maybe, I couldn't get this to work with malleableFields and FC, so loosened the type to FieldConfig
    public fields: FieldConfig,
    public passedOptions?: Partial<SheetOptions<FC>>
  ) {
    if (passedOptions) {
      Object.assign(this.options, passedOptions)
    }

    const malleableFields: Record<string, Field<any, any>> = fields
    toPairs(fields).map(([key, field]) => {
      //do dag checking here on dependsOn, uses, and modifies
      if (field.options.contributeToRecordCompute) {
        this.contributedRecordFuncs[key] =
          field.options.contributeToRecordCompute
      }
      toPairs(field.extraFieldsToAdd).map(([extraKey, extraField]) => {
        if (fields[extraKey] === undefined) {
          malleableFields[extraKey] = extraField
        } else {
          throw Error(
            `extraFieldsToAdd error, ${extraKey} already exists in fields, ${key} was trying to add it`
          )
        }
      })
    })
    this.fields = malleableFields
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
      toPairs(this.contributedRecordFuncs).map(([fieldName, recordCompute]) => {
        try {
          // narrow record and what can be modified on it
          recordCompute(record, logger)
        } catch (e: any) {
          console.log(`error with contributedRecordCompute for ${fieldName}`, e)
        }
      })
      this.options.recordCompute(record, logger) //, session, logger)
    })

    // Run recordCompute record hook
    await this.options.batchRecordsCompute(records)

    records.records.map(async (record: FlatfileRecord) => {
      toPairs(this.fields).map(async ([key, field]) => {
        const origVal = record.get(key)
        if (isFullyPresent(origVal)) {
          // TODO throw an error on null???
          const messages = field.validate(origVal)
          if (messages) {
            messages.map((m) => {
              record.addError(key, m.message)
            })
          }
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
