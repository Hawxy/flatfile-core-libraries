import { FlatfileListener } from '@flatfile/listener'
import { Flatfile, FlatfileClient } from '@flatfile/api'

export const config: Pick<
  Flatfile.WorkbookConfig,
  'name' | 'sheets' | 'actions'
> = {
  name: 'Employees workbook',
  sheets: [
    {
      name: 'TestSheet',
      slug: 'TestSheet',
      fields: [
        {
          key: 'first_name',
          type: 'string',
          label: 'First name',
          constraints: [
            {
              type: 'required'
            }
          ]
        },
        {
          key: 'last_name',
          type: 'string',
          label: 'last name'
        },
        {
          key: 'full_name',
          type: 'string',
          label: 'full name'
        }
      ],
      actions: [
        {
          label: 'split fields',
          operation: 'contacts:split-fields',
          description: 'Would you like to split fields?',
          mode: 'foreground',
          confirm: true
        }
      ]
    }
  ],
  actions: [
    {
      label: 'Submit',
      operation: 'contacts:submit',
      description: 'Would you like to submit your workbook?',
      mode: 'foreground',
      primary: true,
      confirm: true
    }
  ]
}

async function splitFields(jobId: string, sheetId: string) {
  const storedToken = sessionStorage.getItem('token')

  if (!storedToken) {
    throw new Error('Error retrieving stored token')
  }

  const Flatfile = new FlatfileClient({
    token: storedToken,
    environment: 'https://platform.flatfile.com/api/v1'
  })

  await Flatfile.jobs.ack(jobId, {
    info: "I'm starting the spliting fields job"
  })

  const records = await Flatfile.records.get(sheetId)
  const recordsUpdates = records.data.records?.map((record) => {
    const fullName = record.values['full_name'].value
    const splitName = fullName?.toLocaleString().split(' ')

    record.values['first_name'].value = splitName ? splitName[0] : ''
    record.values['last_name'].value = splitName ? splitName[1] : ''

    return record
  })

  await Flatfile.records.update(sheetId, recordsUpdates as Flatfile.Record_[])

  await Flatfile.jobs.complete(jobId, {
    info: "Job's work is done"
  })
}

/**
 * Example Listener
 */
export const listener = FlatfileListener.create((client) => {
  client.on(
    'job:ready',
    // @ts-ignore
    { payload: { operation: 'contacts:split-fields' } },
    async (event: any) => {
      const { context } = event
      return splitFields(context.jobId, context.sheetId)
    }
  )
})
