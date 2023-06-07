import { Blueprint } from '@flatfile/api'
import { Client } from '@flatfile/listener'

export const config: {
  slug: string
  name: string
  blueprints: Blueprint[]
} = {
  slug: 'cross-field-config',
  name: 'Editable Name',
  blueprints: [
    {
      slug: 'basic-config-local',
      name: 'Cross field blueprint',
      sheets: [
        {
          name: 'TestSheet',
          slug: 'TestSheet',
          fields: [
            {
              key: 'salary',
              type: 'number',
              label: 'salary',
            },
            {
              key: 'needs_raise',
              type: 'boolean',
              label: 'needs raise',
            },
          ],
        },
      ],
    },
  ],
}

/**
 * Example Client that checks values across fields and populates based on that check
 */
export const crossfieldClient = Client.create((client) => {
  client.on(
    'records:*',
    // @ts-ignore
    { context: { sheetSlug: 'TestSheet' } },
    async (event) => {
      const { sheetId, versionId } = event.context

      try {
        const {
          data: { records },
        } = await event.api.getRecords({
          sheetId,
          versionId,
        })

        console.log({ records })

        const recordsUpdates = records?.map((record: any) => {
          if (record.values.salary.value < 50) {
            record.values['needs_raise'].value = true
          } else {
            record.values['needs_raise'].value = false
          }

          return record
        })

        console.log({ recordsUpdates })

        await event.api.updateRecords({
          sheetId,
          recordsUpdates,
        })
      } catch (e) {
        console.log(
          `Error updating records - Use console logs inside your events to further debug: ${e}`
        )
      }
    }
  )
})
