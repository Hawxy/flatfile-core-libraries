import { IRawRecord } from '../../types'

export abstract class Transformation<T, I, O> {
  constructor(configuration: T) {
    this.configuration = configuration
  }

  configuration: T

  async transform(records: I): Promise<O> {
    return records as unknown as O
  }
}

export interface RawRecordWithInfo {
  row: IRawRecord
  info: any[]
}
