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
              type: 'required',
            },
          ],
        },
        {
          key: 'last_name',
          type: 'string',
          label: 'last name',
        },
        {
          key: 'full_name',
          type: 'string',
          label: 'full name',
        },
      ],
      actions: [
        {
          label: 'Join fields',
          operation: 'contacts:join-fields',
          description: 'Would you like to join fields?',
          mode: 'foreground',
          confirm: true,
        },
      ],
    },
  ],
  actions: [
    {
      label: 'Submit',
      operation: 'contacts:submit',
      description: 'Would you like to submit your workbook?',
      mode: 'foreground',
      primary: true,
      confirm: true,
    },
  ],
}

async function joinFields(jobId: string, sheetId: string) {
  const storedToken = sessionStorage.getItem('token')

  if (!storedToken) {
    throw new Error('Error retrieving stored token')
  }

  const Flatfile = new FlatfileClient({
    token: storedToken,
    environment: 'https://platform.flatfile.com/api/v1',
  })

  await Flatfile.jobs.ack(jobId, {
    info: "I'm starting the joining fields job",
  })

  const records = await Flatfile.records.get(sheetId)
  const recordsUpdates = records.data.records?.map((record) => {
    const fullName = `${record.values['first_name'].value} ${record.values['last_name'].value}`
    record.values['full_name'].value = fullName
    return record
  })

  await Flatfile.records.update(sheetId, recordsUpdates as Flatfile.Record_[])

  await Flatfile.jobs.complete(jobId, {
    info: "Job's work is done",
  })
}

/**
 * Example Listener
 */
export const listener = FlatfileListener.create((client) => {
  client.on(
    'job:ready',
    // @ts-ignore
    { payload: { operation: 'contacts:join-fields' } },
    async (event: any) => {
      const { context } = event
      console.log('join-fields', event)
      return joinFields(context.jobId, context.sheetId)
    }
  )
})
