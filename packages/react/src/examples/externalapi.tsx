import api, { Flatfile } from '@flatfile/api'
import { FlatfileListener } from '@flatfile/listener'

export const config: Pick<
  Flatfile.WorkbookConfig,
  'name' | 'sheets' | 'actions'
> = {
  name: 'Brewery workbook',
  sheets: [
    {
      name: 'TestSheet',
      slug: 'TestSheet',
      fields: [
        {
          key: 'brewery-name',
          type: 'string',
          label: 'Brewery name',
          constraints: [
            {
              type: 'required'
            }
          ]
        }
      ],
      actions: [
        {
          label: 'Verify breweries',
          operation: 'breweries:verify',
          description: 'Would you like to verify breweries?',
          mode: 'foreground',
          confirm: true
        }
      ]
    }
  ],
  actions: [
    {
      label: 'Submit',
      operation: 'breweries:submit',
      description: 'Would you like to submit your workbook?',
      mode: 'foreground',
      primary: true,
      confirm: true
    }
  ]
}

async function verifyBreweries(jobId: string, sheetId: string) {
  if (!jobId) {
    throw new Error('Missing jobid')
  }

  if (!sheetId) {
    throw new Error('Missing sheetId')
  }

  // fetch Flatfile records by sheet
  const records = await api.records.get(sheetId)
  if (!records) return

  // hit external brewery api
  const breweries = await fetch(
    'https://api.openbrewerydb.org/breweries?by_city=denver'
  )
    .then((res) => {
      return res.json()
    })
    .then((data) => {
      return data
    })

  // verify Flatfile data against brewery DB
  const recordsUpdates = records?.data.records?.map((record: any) => {
    const breweryNameRecordValue = record.values['brewery-name'].value
    const matchingBrewery = breweries.find((brewery: any) => {
      return brewery.name === breweryNameRecordValue
    })
    console.log('matchingBrewery', matchingBrewery)
    if (matchingBrewery) {
      record.values['brewery-name'].value = 'Exists in DB'
    }
    return record
  })

  // update Flatfile records
  await api.records.update(sheetId, recordsUpdates as Flatfile.Record_[])

  // complete the job
  await api.jobs.complete(jobId, {
    info: 'Brewery verification job is complete!'
  })
}

async function submit(jobId: string) {
  await api.jobs.ack(jobId, {
    info: "I'm starting the job - inside client",
    progress: 33
  })

  // hit your api here
  await new Promise((res) => setTimeout(res, 2000))

  await api.jobs.complete(jobId, {
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
    { payload: { operation: 'breweries:verify' } },
    async (event: any) => {
      const { context } = event
      console.log('context: ', context)
      return verifyBreweries(context.jobId, context.sheetId)
    }
  )

  client.on(
    'job:ready',
    // @ts-ignore
    { payload: { operation: 'breweries:submit' } },
    async (event: any) => {
      const { context } = event
      console.log('context: ', context)
      return submit(context.jobId)
    }
  )
})
