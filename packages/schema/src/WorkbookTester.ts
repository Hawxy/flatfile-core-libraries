import * as _ from 'lodash';
import {
  EmailField,
  Sheet,
  TextField,
  NumberField,
  Workbook,
  IHookPayload,
  Message
} from '@flatfile/configure'

export class WorkbookTester {
  public workbook
  constructor(public readonly fields: any, public readonly hooks: any) {
    const TestSheet = new Sheet('test', fields, hooks)
    const TestWorkbook = new Workbook({
      name: `Test Workbook`,
      namespace: 'test',
      sheets: {
        TestSheet,
      },
    })
    this.workbook = TestWorkbook
  }

  public async checkRows(rawDs:any[]): Promise<void> {
    const targets = Object.keys(this.workbook.options.sheets)
    const rows =  _.map(rawDs, (rawData:any, i:number) => {
	return {row: {rawData, rowId: i+1}, info:[]}
    });
    const formattedpayload = {
      schemaSlug: this.workbook.options.namespace + '/' + targets[0],
      rows
    } as IHookPayload
    const result = await this.workbook.handleLegacyDataHook(formattedpayload)

    console.log('toJSONSchema', this.workbook.options.sheets['TestSheet'].toJSONSchema('test', 'test'))
    console.log('result', result);

  }



  public async checkRowResult({
    rawData,
    expectedOutput,
    message,
  }: {
    rawData: any
    expectedOutput?: any
    message?: any
  }): Promise<void> {
    const targets = Object.keys(this.workbook.options.sheets)
    const formattedpayload = {
      schemaSlug: this.workbook.options.namespace + '/' + targets[0],
      rows: [{ row: { rawData, rowId: 1 }, info: [] }],
    } as IHookPayload
    const result = await this.workbook.handleLegacyDataHook(formattedpayload)

    expectedOutput &&
      expect(result[0].row.rawData).toMatchObject(expectedOutput)
    message && expect(result[0].info[0].message).toBe(message)
  }
  public async checkRowMessage({
    rawData,
    message,
  }: {
    rawData: any
    message?: any
  }): Promise<void> {
    const targets = Object.keys(this.workbook.options.sheets)
    const formattedpayload = {
      schemaSlug: this.workbook.options.namespace + '/' + targets[0],
      rows: [{ row: { rawData, rowId: 1 }, info: [] }],
    } as IHookPayload
    const result = await this.workbook.handleLegacyDataHook(formattedpayload)
    expect(message).toBeTruthy()

    message && expect(result[0].info[0].message).toBe(message)
  }

}

export class FieldTester {
  public workbook
  constructor(public readonly field: any) {
    const TestSheet = new Sheet(
      'test',
      {'a': NumberField(field)},
      {})

    const TestWorkbook = new Workbook({
      name: `Test Workbook`,
      namespace: 'test',
      sheets: {
        TestSheet,
      },
    })
    this.workbook = TestWorkbook
  }

  public async checkRowResult({
    rawData,
    expectedOutput,
    message,
  }: {
    rawData: any
    expectedOutput?: any
    message?: any
  }): Promise<void> {
    const targets = Object.keys(this.workbook.options.sheets)
    const formattedpayload = {
      schemaSlug: this.workbook.options.namespace + '/' + targets[0],
      rows: [{ row: { rawData, rowId: 1 }, info: [] }],
    } as IHookPayload
    const result = await this.workbook.handleLegacyDataHook(formattedpayload)

    expectedOutput &&
      expect(result[0].row.rawData).toMatchObject(expectedOutput)
    message && expect(result[0].info[0].message).toBe(message)
  }

  public async checkFieldResult(
    inputVal:any,
    expectedOutputVal:any,
  ): Promise<void> {
    const targets = Object.keys(this.workbook.options.sheets)
    const rawData = {a:inputVal};
    const formattedpayload = {
      schemaSlug: this.workbook.options.namespace + '/' + targets[0],
      rows: [{ row: { rawData, rowId: 1 }, info: [] }],
    } as IHookPayload
    const result = await this.workbook.handleLegacyDataHook(formattedpayload)

    const resultVal = result[0].row.rawData['a'];
    expect(resultVal).toBe(expectedOutputVal);
  }

  public async checkFieldMessage(
    inputVal:any,
    expectedMessage:any,
  ): Promise<void> {
    const targets = Object.keys(this.workbook.options.sheets)
    const rawData = {a:inputVal};
    const formattedpayload = {
      schemaSlug: this.workbook.options.namespace + '/' + targets[0],
      rows: [{ row: { rawData, rowId: 1 }, info: [] }],
    } as IHookPayload
    const result = await this.workbook.handleLegacyDataHook(formattedpayload)

    expect(expectedMessage).toBeTruthy()
    expectedMessage && expect(result[0].info[0].message).toBe(expectedMessage)
  }

  public async matchFieldMessage(
    inputVal:any,
    expectedMessage:Message,
  ): Promise<void> {
    const targets = Object.keys(this.workbook.options.sheets)
    const rawData = {a:inputVal};
    const formattedpayload = {
      schemaSlug: this.workbook.options.namespace + '/' + targets[0],
      rows: [{ row: { rawData, rowId: 1 }, info: [] }],
    } as IHookPayload
    const result = await this.workbook.handleLegacyDataHook(formattedpayload)

    expect(expectedMessage).toBeTruthy()
    expectedMessage && expect(result[0].info[0]).toMatchObject(expectedMessage)
  }

  public async testFullHooks(inputVal:string|undefined, outputVal:number|undefined|null): Promise<void> {
    await this.checkRowResult({rawData:{a:inputVal}, expectedOutput: {a:outputVal}});
  }

  public async testFull(inputVal:string|undefined, outputVal:number|undefined|null, message:string): Promise<void> {
    await this.checkRowResult({rawData:{a:inputVal},  expectedOutput: {a:outputVal}, message});
  }

}


