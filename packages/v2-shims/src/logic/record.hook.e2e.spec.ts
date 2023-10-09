import {
  createRecords,
  deleteSpace,
  getRecords,
  setupListener,
  setupSimpleWorkbook,
  setupSpace,
} from '@flatfile/utils-testing'
import { convertHook } from './record.hook'
import { recordHook } from '@flatfile/plugin-record-hook'
import { Flatfile } from '@flatfile/api'

const v2RecordHook = (record: Record<string, any>) => {
  let out = {}
  if (record.firstName) {
    out = {
      firstName: {
        value: `Mr. ${record.firstName}`,
        info: [
          {
            message: 'Prefix firstName with "Mr."',
            level: 'info',
          },
        ],
      },
    }
  }
  if (record.lastName) {
    out = {
      ...out,
      lastName: 'Smith',
    }
  }
  if (record.email) {
    out = {
      ...out,
      email: {
        info: [
          {
            message: 'email is deprecated',
            level: 'warning',
          },
        ],
      },
    }
  }
  if (record.notes) {
    out = {
      ...out,
      notes: {
        info: [
          {
            message: 'notes must contain less than 10 characters',
            level: 'error',
          },
        ],
      },
    }
  }
  return out
}

describe('convertHook() e2e', () => {
  const listener = setupListener()

  let spaceId: string
  let sheet: Flatfile.Sheet

  beforeAll(async () => {
    const space = await setupSpace()
    spaceId = space.id
    const workbook = await setupSimpleWorkbook(space.id, [
      'firstName',
      'lastName',
      'email',
      'notes',
    ])
    sheet = workbook.sheets![0]
    listener.use(recordHook(sheet.config.slug!, convertHook(v2RecordHook)))
  })

  afterAll(async () => {
    await deleteSpace(spaceId)
  })

  it('correctly modifies a value', async () => {
    await createRecords(sheet.id, [
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@doe.com',
        notes: 'foobar',
      },
    ])

    await listener.waitFor('commit:created')
    const records = await getRecords(sheet.id)
    expect(records[0].values['firstName']).toMatchObject({
      value: 'Mr. John',
      messages: [
        {
          type: 'info',
          field: 'firstName',
          message: 'Prefix firstName with "Mr."',
        },
        {
          type: 'info',
          source: 'is-artifact',
          message: '🪄️ Transformed from "John"',
          field: 'firstName',
        },
      ],
      valid: true,
    })
    expect(records[0].values['lastName']).toMatchObject({
      value: 'Smith',
      messages: [
        {
          type: 'info',
          source: 'is-artifact',
          message: '🪄️ Transformed from "Doe"',
          field: 'lastName',
        },
      ],
      valid: true,
    })
    expect(records[0].values['email']).toMatchObject({
      value: 'john@doe.com',
      messages: [
        {
          type: 'warn',
          field: 'email',
          message: 'email is deprecated',
        },
      ],
      valid: true,
    })
    expect(records[0].values['notes']).toMatchObject({
      value: 'foobar',
      messages: [
        {
          type: 'error',
          field: 'notes',
          message: 'notes must contain less than 10 characters',
        },
      ],
      valid: false,
    })
  })
})
