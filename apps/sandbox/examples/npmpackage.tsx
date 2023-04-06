import { Blueprint } from '@flatfile/api'
import { Client } from '@flatfile/listener'
import { RecordsUpdates } from '@flatfile/api'
import Color from 'color'

export const config: {
  slug: string
  name: string
  blueprints: Blueprint[]
} = {
  slug: 'npm-package-config',
  name: 'Editable Name',
  blueprints: [
    {
      slug: 'basic-config-local',
      name: 'npm package blueprint',
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
          ]
        }
      ]
    }
  ]
}

/**
 * Example Client that gets hex value of color-string
 */
export const npmPackageClient = Client.create((client) => {
  client.on(
    'records:*',
    // @ts-ignore
    { context: { sheetSlug: 'TestSheet' } },
    async (event) => {
      const { sheetId, versionId } = event.context
      // get records

      try {
        const {
          data: { records }
        } = await event.api.getRecords({
          sheetId,
          versionId
        })

        if (!records) return

        const recordsUpdates = records?.map((record: any) => {
          const newColor = Color(record.values.color.value).hex()
          record.values.color.value = newColor

          return record
        })

        console.log('updates', { recordsUpdates })

        await event.api.updateRecords({
          sheetId,
          recordsUpdates: recordsUpdates as RecordsUpdates
        })
      } catch (e) {
        console.log(
          `Error updating records - Use console logs inside your events to further debug: ${e}`
        )
      }
    }
  )
})
