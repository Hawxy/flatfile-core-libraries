import { FlatfileListener, FlatfileEvent } from '@flatfile/listener'
import api from '@flatfile/api'

type V2Record = {
  sequence: number
  valid: any
  data: Record<string, any>
}

type V2Sheet = {
  [name: string]: {
    records?: V2Record[]
  }
}

type V2Result = {
  $data?:
    | V2Record[]
    | {
        records?: V2Record[]
      }
  validData: {
    [name: string]: string
  }[]
  data: {
    [name: string]: string
  }[]
  allData?:
    | V2Record[]
    | {
        records?: V2Record[]
      }
  $meta: {
    endUser: any
  }
}

type HandlerFunction = (results: V2Result) => void

export const onData = (handler: HandlerFunction) => {
  return (listener: FlatfileListener) => {
    listener
      .filter({ job: 'workbook:submitAction' })
      .on('job:ready', async (event: FlatfileEvent) => {
        const { context } = event
        const { workbookId, actorId } = context

        // Collect all Sheet and Record data from the Workbook
        const { data: sheets } = await api.sheets.list({ workbookId })
        const records: { [name: string]: any } | Record<string, string> = {}

        for (const [index, element] of sheets.entries()) {
          records[`Sheet[${index}]`] = await api.records.get(element.id)
        }

        // Transform the records into the desired format
        const transformedRecords: V2Sheet = {}
        const validData = []

        for (const sheetName in records) {
          if (records.hasOwnProperty(sheetName)) {
            const sheet = records[sheetName]
            const transformedData = []
            let sequenceNumber = 0

            for (const record of sheet.data.records) {
              const recordValues: { [name: string]: string } = {}

              for (const key in record.values) {
                if (record.values.hasOwnProperty(key)) {
                  recordValues[key] = record.values[key].value
                }
              }

              const isRecordValid = record.valid // Assuming valid is a boolean

              transformedData.push({
                sequence: sequenceNumber++,
                valid: isRecordValid, // Add the valid property
                data: {
                  ...recordValues, // Spread the existing recordValues
                },
              })

              // Add to validData if valid
              if (isRecordValid) {
                validData.push({ ...recordValues })
              }
            }

            transformedRecords[sheetName] = {
              records: transformedData,
            }
          }
        }

        // If there is only one sheet, remove the "Sheet[0]" layer
        const finalRecords =
          Object.keys(transformedRecords).length === 1
            ? transformedRecords['Sheet[0]']
            : transformedRecords

        // Get user information
        const endUser = await api.users.get(actorId)

        // Add user info to $meta
        const $meta = {
          endUser,
        }

        // Rename "records" to "$data" and add a parent "records" object
        const modifiedOutput: V2Result = {
          $data: finalRecords.records,
          validData, // data only contains valid records
          data: validData, // data only contains valid records
          allData: finalRecords.records,
          $meta, // Add the $meta object with endUser
        }

        // Now, modifiedOutput will have the desired structure

        // console.log(JSON.stringify(modifiedOutput, null, 2))
        handler(modifiedOutput)
      })
  }
}
