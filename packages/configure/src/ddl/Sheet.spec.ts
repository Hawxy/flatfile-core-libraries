import { FlatfileRecords, FlatfileSession, IPayload } from '@flatfile/hooks'
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
    envField: TextField(),
    testBoolean: BooleanField({}),
  },
  {
    allowCustomFields: true,
    readOnly: true,
    recordCompute: (record, session, logger) => {
      if (session?.env?.secret) {
        record.set('envField', session.env.secret)
      }
    },
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
    const row1 = {
      firstName: 'foo',
      age: '10',
      testBoolean: 'true',
      envField: '',
    }
    const iRaw = [{ rawData: row1, rowId: 1 }]
    const recordBatch = new FlatfileRecords(iRaw)
    const sample: IPayload = {
      schemaSlug: 'slug',
      workspaceId: '123abc',
      workbookId: '345def',
      schemaId: 1010,
      uploads: ['upload1', 'upload2'],
      endUser: 'alex',
      env: { secret: 'test' },
      envSignature: 'signature',
      rows: [],
    }
    const session = new FlatfileSession(sample)
    CategoryAndBoolean.runProcess(recordBatch, session, undefined)

    expect(recordBatch.records[0].value).toMatchObject({
      age: '10',
      firstName: 'FOO',
      testBoolean: true,
      envField: 'test',
    })
  })
})
