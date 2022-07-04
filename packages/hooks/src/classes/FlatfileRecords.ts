import { IRawRecord } from '../types/Record'
import { FlatfileRecord } from './FlatfileRecord'

export class FlatfileRecords {
  private readonly _records: FlatfileRecord[]

  constructor(rawRecords: IRawRecord[]) {
    this._records = rawRecords.map((rawRecord) => new FlatfileRecord(rawRecord))
  }

  get records(): FlatfileRecord[] {
    return this._records
  }

  public toJSON() {
    return this.records.map((record) => record.toJSON())
  }
}
