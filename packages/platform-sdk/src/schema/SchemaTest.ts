import { RawRecordArray } from '../DataAbstraction/SchemaPrime'
import {
  Schema,
  SmallSheet,
  AJVValidationTransformation,
} from '../DataAbstraction'
import { DDLCompile, DDLSchema } from './First'
import { IJsonSchema } from '../types'

export type ColumnMapping = { [k: string]: string }

// I want it to be the above, but don't know how to plumb in the other types
//export type CompactRow = Record<string, string|boolean|number>;
export type CompactRow = Record<string, string>
//how do I restrict the second record to only have string keys from the set of string keys used in CompactRow
export type ExpectedErrors = Record<string, boolean>
export type CompactTest = [CompactRow, ExpectedErrors]
export type RowSpecs = CompactTest[]
export type RowDataArr = RawRecordArray['rawData']

export class SchemaTest {
  constructor(
    protected describeName: string,
    protected mapping: ColumnMapping,
    protected ddlSchema: DDLSchema
  ) {
    let jsonSchema: IJsonSchema = DDLCompile(ddlSchema)
    const schema = new Schema(jsonSchema)
    this.ajvTransformer = new AJVValidationTransformation({ jsonSchema })
    this.sheet = new SmallSheet(schema, schema)
    this.mapping = mapping
  }

  private ajvTransformer: AJVValidationTransformation
  private sheet: SmallSheet

  private async makeRecords(testRows: RowSpecs) {
    const cRows: CompactRow[] = testRows.map((v) => {
      return v[0]
    })
    const rawRecordArr: RawRecordArray[] = this.makeRawRecordArray(cRows)
    return await this.sheet.encodeRecordsFromArray(rawRecordArr, this.mapping)
  }

  private makeRowDataArr(row: CompactRow): RowDataArr {
    const retData: RowDataArr = []
    for (const key in row) {
      retData.push({ key, value: row[key] })
    }
    return retData
  }

  private makeRawRecordArray(compactRows: CompactRow[]): RawRecordArray[] {
    const retArr: RawRecordArray[] = []
    compactRows.forEach((cRow, index) => {
      const rawRecordArray: RawRecordArray = {
        rawData: this.makeRowDataArr(cRow),
        rowId: index + 1,
      }
      retArr.push(rawRecordArray)
    })
    return retArr
  }

  // public testRows(rows: RowSpecs): void  {
  // }

  public testRow(row: CompactTest, explanation: string): void {
    describe(this.describeName, () => {
      it(explanation, async () => {
        const records = await this.makeRecords([row])
        const validatedRecords = await this.ajvTransformer.transform(records)
        //loop over ExpectedError of the row and translate it into the following form;
        const expectedResult = row[1]
        for (const key in expectedResult) {
          expect(validatedRecords[0].cells[key].isValid).toBe(
            expectedResult[key]
          )
        }
      })
    })
  }
}
