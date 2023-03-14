import { Client, FlatfileVirtualMachine } from '@flatfile/listener'
import { RecordWithLinks } from '@flatfile/api'

const example = Client.create((client) => {
  /**
   * This is a basic hook on events with no sugar on top
   */
  client.on('records:*', { target: 'sheet(TestSheet)' }, async (event) => {
    const { sheetId } = event.context
    try {
      const records = (await event.data).records

      const recordsUpdates = records?.map((record: RecordWithLinks) => {
        record.values.middleName.value = 'TestSheet'

        return record
      })

      await client.api.updateRecords({
        sheetId,
        recordsUpdates,
      })
    } catch (e) {
      console.log(`Error getting records: ${e}`)
    }
  })

  /**
   * This is a setup of the space with its workbooks
   */
  client.on('client:init', async (event) => {
    // Create a space + workbooks here
  })
})

const FlatfileVM = new FlatfileVirtualMachine()

example.mount(FlatfileVM)

export default example
