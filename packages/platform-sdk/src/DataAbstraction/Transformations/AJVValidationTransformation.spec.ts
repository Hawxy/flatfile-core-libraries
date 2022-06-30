import { AJVValidationTransformation } from './AJVValidationTransformation'
import { IJsonSchema } from '../../types'
import { SmallSheet } from '../'
import { Schema } from '../'

describe(AJVValidationTransformation.name, () => {
  const jsonSchema: IJsonSchema = {
    properties: {
      first_name: { type: 'string', label: 'First Name', field: 'first_name' },
      last_name: { type: 'string', label: 'Last Name', field: 'last_name' },
      id: { type: 'number', label: 'Id', field: 'id' },
      is_admin: { type: 'boolean', label: 'Is Admin', field: 'is_admin' },
    },
    type: 'object',
    required: ['first_name', 'last_name', 'id', 'is_admin'],
    unique: ['id'],
    primary: 'id',
  }

  const schema = new Schema(jsonSchema)
  let ajvTransformer: AJVValidationTransformation =
    new AJVValidationTransformation({ jsonSchema })

  describe('validations', () => {
    const dataMapping = {
      id: 'id',
      name: 'first_name',
      lastName: 'last_name',
      admin: 'is_admin',
    }
    const sheet = new SmallSheet(schema, schema)
    it('tests a records validity on import', async () => {
      const records = await sheet.encodeRecordsFromArray(
        [
          {
            rawData: [{ key: 'id', value: '' }],
            rowId: 1,
          },
          {
            rawData: [{ key: 'id', value: '0' }],
            rowId: 2,
          },
        ],
        dataMapping
      )
      const validatedRecords = await ajvTransformer.transform(records)
      expect(validatedRecords[0].cells.id.isValid).toBe(false)
      expect(validatedRecords[1].cells.id.isValid).toBe(true)
    })
  })
})

/*



describe(AJVValidationTransformation.name, () => {
  let testingModule: TestingModule

  let ajvTransformer: AJVValidationTransformation

  const publish = jest.fn().mockResolvedValueOnce(true)

  beforeEach(async () => {

    const schemaEntity = new TemplateEntity()
    const jsonSchema: IJsonSchema = {
      properties: {
        first_name: { type: 'string', label: 'First Name', field: 'first_name' },
        last_name: { type: 'string', label: 'Last Name', field: 'last_name' },
        id: { type: 'number', label: 'Id', field: 'id' },
        is_admin: { type: 'boolean', label: 'Is Admin', field: 'is_admin' },
      },
      type: 'object',
      required: ['first_name', 'last_name', 'id', 'is_admin'],
      unique: ['id'],
      primary: 'id',
    }
    schemaEntity.id = 1
    schemaEntity.jsonSchema = {
      schema: jsonSchema,
    }
    ajvTransformer = new AJVValidationTransformation({ jsonSchema })
    workbookEntity = new WorkbookEntity()
    workbookEntity.id = uuid()
    sheetEntityOne = new SheetEntity()
    sheetEntityOne.id = uuid()
    sheetEntityTwo = new SheetEntity()
    sheetEntityTwo.id = uuid()
    sheetEntityTwo.schema = Promise.resolve(schemaEntity)
    sheetEntityOne.schema = Promise.resolve(schemaEntity)
    sheetEntityOne.schemaId = schemaEntity.id
    sheetEntityTwo.schemaId = schemaEntity.id
    workbookEntity.sheets = Promise.resolve([sheetEntityOne, sheetEntityTwo])
    workbook = await service.getWorkbook(TEST_DB, workbookEntity)
  })

  afterEach(async () => {
    Workbook.purgeConnections()
  })

  describe('validations', () => {
    const dataMapping = { id: 'id', name: 'first_name', lastName: 'last_name', admin: 'is_admin' }
    const rawRecords = [
      {
        rawData: [
          { key: 'id', value: 'asdfadsfasdf' },
          { key: 'name', value: 'peter' },
          { key: 'lastName', value: 'Doe' },
          { key: 'admin', value: 'true' },
        ],
        rowId: 1,
      },
      {
        rawData: [
          { key: 'id', value: '2' },
          { key: 'name', value: 'patrick' },
          { key: 'lastName', value: 'patrick' },
          { key: 'admin', value: 'false' },
        ],
        rowId: 2,
      },
    ]

    it('tests a records validity on import', async () => {
      const [sheet] = await workbook.getSheets()
      const records = await sheet.encodeRecordsFromArray(
        [
          {
            rawData: [{ key: 'id', value: '' }],
            rowId: 1,
          },
          {
            rawData: [{ key: 'id', value: '0' }],
            rowId: 2,
          },
        ],
        dataMapping
      )
      const validatedRecords = await ajvTransformer.transform(records)
      expect(validatedRecords[0].cells.id.isValid).toBe(false)
      expect(validatedRecords[1].cells.id.isValid).toBe(true)
    })

    it('tests a records validity on import', async () => {
      const [sheet] = await workbook.getSheets()
      const records = await sheet.encodeRecordsFromArray(rawRecords, dataMapping)
      const validatedRecords = await ajvTransformer.transform(records)
      expect(validatedRecords[0].belongsToPendingTable).toBe(true)
      expect(validatedRecords[1].belongsToPendingTable).toBe(false)
      expect(validatedRecords[0].cells.id.isValid).toBe(false)
      expect(validatedRecords[0].cells.first_name.isValid).toBe(true)
    })

    it('does not override external validations', async () => {
      const [sheet] = await workbook.getSheets()
      const records = await sheet.encodeRecordsFromArray(rawRecords, dataMapping, false)
      records.map((r) => {
        r.validations.push({
          error: EMessageLevel.WARN,
          key: 'admin',
          message: 'no admins allowed',
          type: EValidationType.valueError,
        })
      })
      expect(records[0].validations.length).toBe(1)
      expect(records[1].validations.length).toBe(1)
      const validatedRecords = await ajvTransformer.transform(records)
      expect(validatedRecords[0].validations.length).toBe(2)
      expect(validatedRecords[1].validations.length).toBe(1)
    })
  })

  describe('updateValidationMessage', () => {
    it('should set validation message if value is not the correct type', () => {
      const prop = { type: ['number'] } as ISchemaProperty
      const error = { keyword: 'type' } as ErrorObject
      expect(ajvTransformer.updateValidationMessage(error, prop).message).toBe(
        `Value is not a ${prop.type[0]}`
      )
      prop.type = ['boolean']
      expect(ajvTransformer.updateValidationMessage(error, prop).message).toBe(
        `Value is not a ${prop.type[0]}`
      )
    })
    it('should set validation message if a number value is out of range', () => {
      const prop = { maximum: 5 } as ISchemaProperty
      const error = { keyword: 'maximum' } as ErrorObject
      expect(ajvTransformer.updateValidationMessage(error, prop).message).toBe(
        `Value must be less than ${prop.maximum}`
      )
      prop.minimum = 2
      expect(ajvTransformer.updateValidationMessage(error, prop).message).toBe(
        `Value must be between ${prop.minimum} and ${prop.maximum}`
      )
    })
    it('should handle special formatting messages for phone and email', () => {
      const prop = { format: 'phone' } as ISchemaProperty
      const error = { keyword: 'format' } as ErrorObject
      expect(ajvTransformer.updateValidationMessage(error, prop).message).toBe(
        `Not a valid ${prop.format} number`
      )
      prop.format = 'email'
      expect(ajvTransformer.updateValidationMessage(error, prop).message).toBe(
        `Not a valid ${prop.format} address`
      )
      prop.format = 'whatever'
      expect(ajvTransformer.updateValidationMessage(error, prop).message).toBe(
        `Not a valid ${prop.format}`
      )
    })
  })
})
*/
