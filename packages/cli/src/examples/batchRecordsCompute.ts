import { FlatfileRecords } from '@flatfile/hooks'
import fetch from 'node-fetch'
import {
  Sheet,
  Workbook,
  TextField,
  BooleanField,
  NumberField,
  OptionField,
  Message,
} from '@flatfile/configure'

const EmployeesBatch = new Sheet(
  'Testing batchRecordCompute',
  {
    firstName: TextField({
      required: true,
      description: 'Given name',
    }),
    lastName: TextField({}),
    fullName: TextField({}),

    stillEmployed: BooleanField(),
    department: OptionField({
      label: 'Department',
      options: {
        engineering: 'Engineering',
        hr: 'People Ops',
        sales: 'Revenue',
      },
    }),
    fromHttp: TextField({ label: 'Set by batchRecordCompute' }),
    salary: NumberField({
      label: 'Salary',
      description: 'Annual Salary in USD',
      required: true,
    }),
  },
  {
    allowCustomFields: true,
    readOnly: true,
    recordCompute: (record) => {
      // 	  const fullName = `{record.get('firstName')} {record.get('lastName')}`
      // console.log(`fullName, {fullName}`)
      //record.set('fullhName', fullName)
      record.set('fullName', 'paddy')
      return record
    },
    batchRecordsCompute: async (payload: FlatfileRecords) => {
      const response = await fetch('https://api.us.flatfile.io/health', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      })
      const result = await response.json()
      payload.records.map(async (record) => {
        await record.set('fromHttp', result.info.postgres.status)
      })
    },
  }
)

export default new Workbook({
  name: 'README workbook ',
  namespace: 'onboarding2',
  sheets: {
    EmployeesBatch,
  },
})
