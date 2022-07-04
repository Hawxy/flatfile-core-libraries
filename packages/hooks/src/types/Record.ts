
export type TPrimitive = string | boolean | number | Date | null

export type TRecordData<T extends TPrimitive | undefined = TPrimitive> = { [key: string]: T }

export interface IRawRecord {
  rawData: TRecordData
  rowId: number
}

export type TRecordInfoLevel = 'error' | 'warn' | 'info'
export interface IRecordInfo {
  level: TRecordInfoLevel
  field: string
  message: string
}

export interface IRawRecordWithInfo {
  row: IRawRecord
  info: IRecordInfo[]
}
