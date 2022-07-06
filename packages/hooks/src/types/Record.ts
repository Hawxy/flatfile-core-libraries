
export type TPrimitive = string | boolean | number | null

export type TRecordData<T extends TPrimitive | undefined = TPrimitive> = { [key: string]: T }

export interface IRawRecord {
  rawData: TRecordData
  rowId: number
}

export type TRecordInfoLevel = 'error' | 'warn' | 'info'
export interface IRecordInfo<M extends TRecordData = TRecordData, K = keyof M> {
  level: TRecordInfoLevel
  field: K
  message: string
}

export interface IRawRecordWithInfo<M extends TRecordData = TRecordData> {
  row: IRawRecord
  info: IRecordInfo<M>[]
}
