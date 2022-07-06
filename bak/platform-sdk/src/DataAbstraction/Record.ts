import { EMessageLevel, EValidationState, Levels, TPrimitive } from '../types'
import { Cell } from './Cell'
import { SPSanitize } from './SchemaProperty'
import {
  IValidation,
  EPropertyType,
  RecordCells,
  mapObject,
  EAuthorType,
  ICell,
  RawRecord,
  IRecord,
  MinSheet,
} from './SchemaPrime'

export class Record implements IRecord {
  constructor(
    public sheet: MinSheet, //Sheet
    public rowId?: number
  ) {}

  public cells: RecordCells = {}
  public deleted: boolean = false
  public deletedByMergeId?: string
  public externalValidations: IValidation[] = []
  public externalId?: string
  public mergeId?: string
  public uploadId?: string
  public partIndex?: number
  public chunkIndex?: number
  public status: EValidationState = EValidationState.review
  public upToDateValidations: boolean = false
  public validations: IValidation[] = []
  public numberOfRecordsMerged: number = 0
  public okToMerge: boolean = true

  public get belongsToPendingTable(): boolean {
    return (
      this.validations.filter((v) => v.error === EMessageLevel.ERROR).length > 0
    )
  }

  public getCells(): ICell[] {
    return Object.keys(this.cells).map((k) => this.cells[k])
  }

  public getFieldValue(key: string, stored: boolean = false): TPrimitive {
    const cell = this.cells[key]
    if (!cell) {
      //throw new NotFoundException(`key ${key} not found in record ${this.rowId}`)
      throw new Error(`key ${key} not found in record ${this.rowId}`)
    }
    return stored ? cell.storedValue : cell.value
  }

  public getLinkedRecordId(key: string): number | undefined {
    const cell = this.cells[key]
    if (!cell) {
      //throw new NotFoundException(`key ${key} not found in record ${this.rowId}`)
      throw new Error(`key ${key} not found in record ${this.rowId}`)
    }
    switch (typeof cell.value) {
      case 'number':
        return cell.value
      case 'string':
        return parseInt(cell.value, 10)
    }
  }

  public updateCell(key: string, incomingCell: Cell) {
    if (!this.sheet.schema.hasRawProperty(key)) {
      throw new TypeError(`No schema property exists for ${key}`)
    }
    this.cells[key] = incomingCell
  }

  public setCellValue(key: string, value: TPrimitive): ICell {
    const cell = this.cells[key]
    if (!cell) {
      throw new Error(`Cell for key: ${key} not present`)
    }
    cell.setValue(value)
    return cell
  }

  public updateFromObject(obj: { [k: string]: TPrimitive }): this {
    mapObject<string>(obj, (k, value) => {
      this.setCellValue(k, value)
    })
    return this
  }

  /**
   * Return an indication of if this record is valid or not.
   */
  public get valid(): boolean {
    return !this.validations
      .concat(this.externalValidations)
      .some((v) => v.error === EMessageLevel.ERROR)
  }

  public static async fromRawRecord(
    rawRecord: RawRecord,
    sheet: MinSheet ///Sheet
  ): Promise<Record> {
    return (await Record.upsertFromRawRecords([rawRecord], sheet))[0]
  }

  // this is slightly different from DataAbstractionModule/Record.ts:upsertFromRawRecords  this doens't deal with linked or relational records
  private static async upsertFromRawRecords(
    rawRecords: RawRecord[],
    sheet: MinSheet //Sheet
  ): Promise<Record[]> {
    const records: Record[] = []
    for (const [i, rawRecord] of rawRecords.entries()) {
      //
      // NO SQL IN HERE. JUST IN-MEMORY STUFF.
      //

      let record = new Record(sheet, rawRecord.rowId)
      record.okToMerge = rawRecord.okToMerge ?? true

      for (const schema of sheet.getSchemas()) {
        schema.properties.forEach((prop) => {
          let value = rawRecord.rawData[prop.originalKey]
          if (
            ([undefined, null, ''] as typeof value[]).includes(value) &&
            prop.default
          ) {
            value = prop.default
          }
          const pending = undefined

          const cell = new Cell(prop, record, null, pending)

          cell.setValue(value, [EAuthorType.TYPE_CAST, 'any'])
          record.cells[prop.originalKey] = cell
        })
      }

      records.push(record)
    }
    return records
  }

  /**
   * Convert a stored record into a Record object w/cells
   *
   * @todo move cell population to the constructor
   * @param result
   * @param sheet
   * @param properties
   * @returns
   */

  public toString(): string {
    return Object.entries(this.cells)
      .map(([columnName, cell]) => {
        return `${columnName}: ${cell.value}`
      })
      .reduce((s, c) => {
        return s + ', ' + c
      }, '')
      .substring(2)
  }

  /**
   * Return a list of messages for a given cell.
   *
   * @todo this should be refactored to come from the cell abstraction
   * @param key
   * @param level
   * @returns
   */
  public getMessagesForCell(key: string, level?: Levels): IValidation[] {
    return this.validations.filter(
      (v) => (!level || v.error === level) && key === v.key
    )
  }

  /**
   * Converts the row to a basic raw key:value pairs
   *
   * @returns
   */
  public toRawObject(includeLinkedRecordIds = true): {
    [k: string]: TPrimitive
  } {
    return this.getCells().reduce((acc, cell) => {
      if (cell.property.type === EPropertyType.SCHEMA_REF) {
        if (!includeLinkedRecordIds) {
          return acc
        }
      }
      return { ...acc, [cell.property.originalKey]: cell.value }
    }, {})
  }

  /**
   * Converts the row into a series of strings for backwards compatibility with batch api call
   *
   * @returns
   */
  public toArrayOfStrings(keys?: string[]): string[] {
    const cells = keys
      ? this.getCells().filter((cell) =>
          keys.map((k) => SPSanitize(k)).includes(cell.key)
        )
      : this.getCells()
    return cells.map(
      (cell) =>
        `${cell.value === undefined || cell.value === null ? '' : cell.value}`
    )
  }
}

export interface IStorageRecord {
  [key: string]: any
  deleted: boolean
  deletedByMergeId?: string
  id: number
  mergeId?: string
  status: EValidationState
  validations: IValidation[]
  uploadId?: string
  part?: number
  chunk?: number
  externalId?: string
}
