import { FlatfileListener } from '@flatfile/listener'
import { recordHook } from '@flatfile/plugin-record-hook'

/**
 * Example Listener
 */
export const listener = FlatfileListener.create((client) => {
  client.use(
    recordHook('contacts', (record) => {
      const firstName = record.get('firstName')
      console.log({ firstName })
      // Gettign the real types here would be nice but seems tricky
      record.set('lastName', 'Rock')
      return record
    })
  )
})
