import { Blueprint } from '@flatfile/api'
import { Client } from '@flatfile/listener'

export const config: {
  slug: string
  name: string
  blueprints: Blueprint[]
} = {
  slug: 'split-field-config',
  name: 'Editable Name',
  blueprints: [
    {
      slug: 'basic-config-local',
      name: 'Split field blueprint',
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
                  type: 'required'
                }
              ]
            },
            {
              key: 'last_name',
              type: 'string',
              label: 'last name',
              constraints: [
                {
                  type: 'required'
                }
              ]
            },
            {
              key: 'full_name',
              type: 'string',
              label: 'full name'
            }
          ],
          actions: [
            {
              slug: 'split-field',
              label: 'Split field'
            }
          ]
        }
      ]
    }
  ]
}

/**
 * Example Client that runs split field on action 'Split field'
 */
export const splitFieldClient = Client.create((client) => {
  client.on(
    'action:triggered',
    // @ts-ignore
    { context: { actionName: 'TestSheet:split-field' } },
    async (event) => {
      const { sheetId, versionId } = event.context

      try {
        const {
          data: { records }
        } = await event.api.getRecords({
          sheetId,
          versionId
        })

        console.log({ records })

        const recordsUpdates = records?.map((record: any) => {
          const fullName = record.values['full_name'].value
          const splitName = fullName.split(' ')

          record.values['first_name'].value = splitName[0]
          record.values['last_name'].value = splitName[1]

          return record
        })

        console.log({ recordsUpdates })

        await event.api.updateRecords({
          sheetId,
          recordsUpdates
        })
      } catch (e) {
        console.log(
          `Error updating records - Use console logs inside your events to further debug: ${e}`
        )
      }
    }
  )
})
