import { Blueprint } from '@flatfile/api'
import { Client } from '@flatfile/listener'
import { RecordsUpdates } from '@flatfile/api'

export const config: {
  slug: string
  name: string
  blueprints: Blueprint[]
} = {
  slug: 'regex-config',
  name: 'Editable Name',
  blueprints: [
    {
      slug: 'basic-config-local',
      name: 'regex blueprint',
      sheets: [
        {
          name: 'TestSheet',
          slug: 'TestSheet',
          fields: [
            {
              key: 'email',
              type: 'string',
              label: 'email',
            },
          ],
        },
      ],
    },
  ],
}

/**
 * Example Client that validates emails
 */
export const regExClient = Client.create((client) => {
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

        const regex = new RegExp('^S+@S+$')

        if (!records) return

        const recordsUpdates = records?.map((record: any) => {
          const isValid = regex.test(record.values.email.value)
          const messages = record.values.email.messages

          if (!isValid) {
            record.values.email.messages = [
              ...messages,
              {
                message: 'value must contain an @',
                type: 'error',
                source: 'custom-logic',
              },
            ]
          }

          return record
        })

        console.log('updates', { recordsUpdates })

        await event.api.updateRecords({
          sheetId,
          recordsUpdates: recordsUpdates as RecordsUpdates,
        })
      } catch (e) {
        console.log(
          `Error updating records - Use console logs inside your events to further debug: ${e}`
        )
      }
    }
  )
})
