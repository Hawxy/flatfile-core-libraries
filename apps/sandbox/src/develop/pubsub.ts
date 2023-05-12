import { Client, FlatfileEvent } from '@flatfile/listener'

export default (client: Client) => {
  /**
   * This is a basic hook on events with no sugar on top
   */

  client.on(
    'commit:created',
    {
      context: {
        // @ts-ignore
        sheetSlug: 'TestSheet',
      },
    },
    async (event: FlatfileEvent) => {
      try {
        const { records } = await event.data

        const recordsUpdates = records.map((record) => {
          record.values.middleName.value = 'TEST'
          return record
        })

        await event.api.updateRecords({
          sheetId: event.context.sheetId,
          recordsUpdates,
        })
      } catch (e) {
        console.log(`Error getting records: ${e}`)
      }
    }
  )
}
