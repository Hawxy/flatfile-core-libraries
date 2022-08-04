import { FlatfileRecords } from '@flatfile/hooks'
import { TextField, BooleanField } from './Field'
import { Sheet } from './Sheet'

const CategoryAndBoolean = new Sheet(
  'CategoryAndBoolean',
  {
    firstName: TextField({
      required: true,
      description: 'foo',
      compute: (v) => v.toUpperCase(),
    }),
    testBoolean: BooleanField({}),
  },
  {
    allowCustomFields: true,
    readOnly: true,
  }
)

describe('Sheet test', () => {
  test('verify SchemaIL output', async () => {
    expect(
      CategoryAndBoolean.toSchemaIL('fake namespace', 'fake slug')
    ).toMatchObject({
      name: 'CategoryAndBoolean',
      slug: 'fake slug',
      namespace: 'fake namespace',
      fields: {
        firstName: {
          label: 'firstName',
          type: 'string',
          required: true,
          description: 'foo',
        },
        testBoolean: { label: 'testBoolean', type: 'boolean' },
      },
    })
  })
  test('verify runProcess', () => {
    const row1 = { firstName: 'foo', age: '10', testBoolean: 'true' }
    const iRaw = [{ rawData: row1, rowId: 1 }]
    const recordBatch = new FlatfileRecords(iRaw)
    CategoryAndBoolean.runProcess(recordBatch, undefined)
    expect(recordBatch.records[0].value).toMatchObject({
      age: '10',
      firstName: 'FOO',
      testBoolean: true,
    })
  })
})
