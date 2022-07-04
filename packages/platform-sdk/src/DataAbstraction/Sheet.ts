import { Record } from './Record'
import { Schema } from './Schema'
import { SchemaProperty } from './SchemaProperty'
import { RawRecord, RawRecordArray, IRecord, MinSheet } from './SchemaPrime'
import { TPrimitive } from '../types'

export class SmallSheet implements MinSheet {
  constructor(
    public readonly schema: Schema,
    public readonly fullSchema: Schema
  ) {}

  public getSchemas() {
    return [this.schema]
  }

  public update(records: Record[], eventId?: string): Promise<IRecord[]> {
    return new Promise((resolve) => {
      resolve([] as IRecord[])
    })
  }
  public getRecordsByColumnValues(
    prop: string,
    values: TPrimitive[],
    onlyOnePerValue?: boolean
  ): Promise<IRecord[]> {
    return new Promise((resolve) => {
      resolve([] as IRecord[])
    })
  }

  public previewFields(): { [key: string]: SchemaProperty } {
    return {}
  }

  public accessSiblingSheets(
    schemaIds: number[]
  ): Promise<{ [k: string]: MinSheet }> {
    return new Promise((resolve) => {
      resolve({})
    })
  }

  getRecordsByIds(
    ids: number[],
    joinLinkedProperties: boolean
  ): Promise<IRecord[]> {
    return new Promise((resolve) => {
      resolve([] as IRecord[])
    })
  }

  public get linkedPropertiesFromAllSchemas(): SchemaProperty[] {
    return []
  }

  get propertiesFromAllSchemas(): SchemaProperty[] {
    return []
  }

  public async encodeRecordsFromArray(
    rawRecords: RawRecordArray[],
    mapping: { [k: string]: string },
    runValidations: boolean = true
  ): Promise<IRecord[]> {
    const prepped: RawRecord[] = rawRecords.map((raw) => {
      const rawData = raw.rawData.reduce(
        (acc, r) => ({ ...acc, [mapping[r.key]]: r.value }),
        {}
      )
      return { rawData, rowId: raw.rowId }
    })
    return (
      await Promise.all(
        prepped.map((record) => Record.fromRawRecord(record, this))
      )
    ).map((r) => {
      r.partIndex = 1
      return r
    })
  }
}
