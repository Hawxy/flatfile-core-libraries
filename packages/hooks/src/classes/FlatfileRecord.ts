export type TPrimitive = string | boolean | number | null

export type TRecordData<T extends TPrimitive | undefined = TPrimitive> = { [key: string]: T }

export interface IRawRecord {
  rawData: TRecordData
  rowId: number
}

export type TRecordInfoLevel = 'error' | 'warn' | 'info'
export type TRecordStageLevel = 'cast' | 'empty' | 'required' | 'compute' | 'validate' | 'apply' | 'other';
export interface IRecordInfo<M extends TRecordData = TRecordData, K = keyof M> {
  level: TRecordInfoLevel
  field: K
  message: string
  stage: TRecordStageLevel
}

export interface IRawRecordWithInfo<M extends TRecordData = TRecordData> {
  row: IRawRecord
  info: IRecordInfo<M>[]
}


export interface IPayload {
  workspaceId: string
  workbookId: string
  schemaId: number
  schemaSlug: string
  uploads: string[]
  endUser?: any // TODO
  env?: Record<string, string | boolean | number>
  envSignature?: string
  rows: IRawRecord[]
}



export class FlatfileRecord<M extends TRecordData = TRecordData> {
  private readonly data: M
  private readonly mutated: M
  private readonly _rowId: number
  private _info: IRecordInfo<M>[] = []

  constructor(raw: IRawRecord) {
    this.mutated = Object.assign({}, raw.rawData) as M
    this.data = Object.assign({}, raw.rawData) as M
    this._rowId = raw.rowId
  }

  get rowId() {
    return this._rowId
  }

  get originalValue() {
    return this.data
  }

  get value() {
    return this.mutated
  }

  private verifyField(field: string): boolean {
    if (!Object.prototype.hasOwnProperty.call(this.data, field)) {
      // TODO: make sure user's aware of this message
      console.error(`Record does not have field "${field}".`)
      return false
    }
    return true
  }

  public set(field: string, value: TPrimitive) {
    if (!this.verifyField(field)) {
      return this
    }

    Object.defineProperty(this.mutated, field, {
      value,
    })

    return this
  }

  public get(field: string): null | TPrimitive {
    if (this.verifyField(field)) {
      return this.mutated[field]
    }

    return null
  }

  public addInfo(fields: string | string[], message: string): this {
    return this.pushInfoMessage(fields, message, 'info', 'other')
  }

  /**
   * @alias addInfo
   */
  public addComment(fields: string | string[], message: string): this {
    return this.addInfo(fields, message)
  }

  public addError(fields: string | string[], message: string): this {
    return this.pushInfoMessage(fields, message, 'error', 'other')
  }

  public addWarning(fields: string | string[], message: string) {
    return this.pushInfoMessage(fields, message, 'warn', 'other')
  }

  public pushInfoMessage(
    fields: string | string[],
    message: string,
    level: IRecordInfo['level'],
    stage: TRecordStageLevel
  ): this {
    fields = Array.isArray(fields) ? fields : [fields]

    fields.forEach((field) => {
      if (this.verifyField(field)) {
        this._info.push({
          field,
          message,
          level,
          stage,
        })
      }
    })
    return this
  }

  public toJSON(): IRawRecordWithInfo<M> {
    return {
      row: {
        rawData: this.mutated,
        rowId: this.rowId,
      },
      info: this._info,
    }
  }
}
