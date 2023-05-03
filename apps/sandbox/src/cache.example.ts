import {
  Client,
  FlatfileVirtualMachine,
  FlatfileEvent,
} from '@flatfile/listener'
import {
  RecordHook,
  RecordTranslater,
  createBlueprintFromConfigure,
} from '@flatfile/configure'
import { FlatfileRecord, FlatfileRecords } from '@flatfile/hooks'
import { RecordWithLinks, RecordsWithLinks } from '@flatfile/api'
import xdk from './xdk-simple-deploy'

const prepareXRecords = async (records: any): Promise<FlatfileRecords<any>> => {
  const clearedMessages: RecordWithLinks[] = records.map(
    (record: { values: { [x: string]: { messages: never[] } } }) => {
      // clear existing cell validation messages
      Object.keys(record.values).forEach((k) => {
        record.values[k].messages = []
      })
      return record
    }
  )
  const fromX = new RecordTranslater<RecordWithLinks>(clearedMessages)
  return fromX.toFlatFileRecords()
}

const recordHook = (
  sheetName: string,
  handler: (record: FlatfileRecord) => void
) => {
  return (listener: Client) => {
    listener.on(
      'records:*',
      { target: `sheet(${sheetName})` },
      async (event) => {
        const { sheetId } = event.context
        try {
          const records = await event.cache.init<RecordsWithLinks>(
            'records',
            async () => (await event.data).records
          )

          if (!records) return

          const batch = await prepareXRecords(records)

          // run client defined data hooks
          await batch.records.map(handler)

          const recordsUpdates = new RecordTranslater<FlatfileRecord>(
            batch.records
          ).toXRecords()

          await event.cache.set('records', async () => recordsUpdates)

          event.afterAll(() => {
            const records = event.cache.get('records')
            const clearedMessages = (records as RecordsWithLinks).map(
              (record) => {
                // clear existing cell validation messages
                Object.keys(record.values).forEach((k) => {
                  record.values[k].messages = []
                })
                return record
              }
            )
            try {
              return event.api.updateRecords({
                sheetId,
                recordsUpdates: clearedMessages,
              })
            } catch (e) {
              console.log(`Error putting records: ${e}`)
            }
          })
        } catch (e) {
          console.log(`Error getting records: ${e}`)
        }

        return handler
      }
    )
  }
}

const capitalizeValues = (sheetName: string, keyName: string) => {
  return recordHook(sheetName, (record) => {
    const value = record.get(keyName)
    if (typeof value !== 'string') return
    record.set(keyName, value.toUpperCase())
  })
}

const example = Client.create((client) => {
  /**
   * This is a basic hook on events with no sugar on top
   */

  client.use(
    recordHook('TestSheet', (record: FlatfileRecord) => {
      const firstName = record.get('firstName')
      // Gettign the real types here would be nice but seems tricky
      record.set('middleName', 'TestSheet ' + firstName)
      return record
    })
  )

  client.use(capitalizeValues('TestSheet', 'firstName'))
  client.use(capitalizeValues('TestSheet', 'middleName'))
  client.use(capitalizeValues('TestSheet', 'lastName'))

  /**
   * This is a setup of the space with its workbooks
   */
  client.on('client:init', async (event) => {
    // Set "deployNewSpace": "true" in .flatfilerc's "internal" param to create a Space Config and Space here
    const { deployNewSpace } = process.env
    // console.log('client:init')
    // Will build the space config and create the space
    if (deployNewSpace === 'true') {
      try {
        const blueprint = createBlueprintFromConfigure(xdk.mount())
        if (!blueprint) return

        const environmentId = event.context.environmentId

        // Create Space
        const space = await client.api.addSpace({
          spaceConfig: {
            name: 'Test Space 3',
            environmentId,
          },
        })

        if (!space.data) return

        // Create Workbook
        const workbook = await client.api.addWorkbook({
          workbookConfig: {
            name: 'Test Workbook',
            spaceId: space.data.id,
            environmentId,
            sheets: blueprint.blueprints[0].sheets,
          },
        })

        if (!workbook.data) return

        // Update Space with Workbook
        await client.api.updateSpaceById({
          spaceId: space.data.id,
          spaceConfig: {
            primaryWorkbookId: workbook.data.id,
            environmentId,
          },
        })
      } catch (e) {
        console.log(`error creating Space or Workbook: ${e}`)
      }
    }
  })
})

const FlatfileVM = new FlatfileVirtualMachine()

example.mount(FlatfileVM)

export default example
