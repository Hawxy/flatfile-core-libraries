import { FlatfileListener } from '@flatfile/listener'
import { Flatfile, FlatfileClient } from '@flatfile/api'
// @ts-ignore
import Color from 'color'

export const config: Pick<
  Flatfile.WorkbookConfig,
  'name' | 'sheets' | 'actions'
> = {
  name: 'Color workbook',
  sheets: [
    {
      name: 'TestSheet',
      slug: 'TestSheet',
      fields: [
        {
          key: 'color',
          type: 'string',
          label: 'Color'
        }
      ],
      actions: [
        {
          label: 'Convert color',
          operation: 'colors:convert-color',
          description: 'Would you like to convert colors?',
          mode: 'foreground',
          confirm: true
        }
      ]
    }
  ],
  actions: [
    {
      label: 'Submit',
      operation: 'colors:submit',
      description: 'Would you like to submit your workbook?',
      mode: 'foreground',
      primary: true,
      confirm: true
    }
  ]
}

async function convertColors(jobId: string, sheetId: string) {
  const storedToken = sessionStorage.getItem('token')

  if (!storedToken) {
    throw new Error('Error retrieving stored token')
  }

  const Flatfile = new FlatfileClient({
    token: storedToken,
    environment: 'https://platform.flatfile.com/api/v1'
  })

  await Flatfile.jobs.ack(jobId, {
    info: "I'm starting the converting colors job"
  })

  const records = await Flatfile.records.get(sheetId)
  const recordsUpdates = records.data.records?.map((record) => {
    const newColor = Color(record.values.color.value).hex()
    record.values['color'].value = newColor

    return record
  })

  await Flatfile.records.update(sheetId, recordsUpdates as Flatfile.Record_[])

  await Flatfile.jobs.complete(jobId, {
    info: "Job's work is done"
  })
}

async function submit(jobId: string) {
  const storedToken = sessionStorage.getItem('token')

  if (!storedToken) {
    throw new Error('Error retrieving stored token')
  }

  const Flatfile = new FlatfileClient({
    token: storedToken,
    environment: 'https://platform.flatfile.com/api/v1'
  })

  await Flatfile.jobs.ack(jobId, {
    info: "I'm starting the job - inside client",
    // progress only makes sense if multipart job - optional
    progress: 33
  })

  // hit your api here
  await new Promise((res) => setTimeout(res, 2000))

  await Flatfile.jobs.complete(jobId, {
    info: "Job's work is done",
    outcome: { next: { type: 'wait' } }
  })
}

/**
 * Example Listener
 */
export const listener = FlatfileListener.create((client) => {
  client.on(
    'job:ready',
    // @ts-ignore
    { payload: { operation: 'colors:convert-color' } },
    async (event: any) => {
      const { context } = event
      return convertColors(context.jobId, context.sheetId)
    }
  )

  client.on(
    'job:ready',
    // @ts-ignore
    { payload: { operation: 'colors:submit' } },
    async (event: any) => {
      const { context } = event
      return submit(context.jobId)
    }
  )
})
