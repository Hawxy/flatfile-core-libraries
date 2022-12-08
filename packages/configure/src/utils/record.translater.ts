import {
  FlatfileRecord,
  TPrimitive,
  TRecordData,
  FlatfileRecords,
  IRawRecord,
} from '@flatfile/hooks/'

export interface XRecord {
  id: string
  values: {
    [x: string]: {
      value: TPrimitive
      messages: never[]
      valid: boolean
    }
  }
}

export class RecordTranslater<T extends FlatfileRecord | XRecord> {
  constructor(private readonly records: T[]) {
    this.records = records
  }

  to = (type: XRecord | FlatfileRecord) => {}

  toFlatFileRecords = () => {
    if (this.records instanceof FlatfileRecords) {
      return this.records as FlatfileRecords<any>
    } else {
      const xrecords = this.records as XRecord[]
      const FFRecords = new FlatfileRecords(
        xrecords.map((record: XRecord) => {
          let rawData: TRecordData = {}
          for (let [k, v] of Object.entries(record.values)) {
            rawData[k] = v.value
          }
          return {
            rowId: record.id,
            rawData,
          } as IRawRecord
        })
      )
      return FFRecords as FlatfileRecords<any>
    }
  }
  toXRecords = () => {
    if (this.records[0] instanceof FlatfileRecord) {
      const FFRecords = this.records as FlatfileRecord[]
      return FFRecords.map((record: FlatfileRecord) => {
        const recordWithInfo = record.toJSON()
        console.dir({ recordWithInfo }, { depth: null })
        let values: any = {}
        for (let [k, v] of Object.entries(recordWithInfo.row.rawData)) {
          const messages = recordWithInfo.info
            .filter((info) => info.field === k)
            .map((info) => ({ message: info.message, type: info.level }))

          values[k] = {
            value: v,
            messages: messages,
            valid: true,
          }
        }
        return {
          id: String(record.rowId),
          values,
        }
      })
    } else {
      return this.records as XRecord[]
    }
  }
}
