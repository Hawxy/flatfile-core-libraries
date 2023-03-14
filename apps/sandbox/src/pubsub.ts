import {
  Client,
  FlatfileVirtualMachine,
  FlatfileEvent,
} from '@flatfile/listener'
import { RecordHook, createBlueprintFromConfigure } from '@flatfile/configure'
import { FlatfileRecord } from '@flatfile/hooks'
import xdk from './xdk-simple-deploy'

const example = Client.create((client) => {
  /**
   * This is a basic hook on events with no sugar on top
   */

  client.on(
    'records:*',
    { target: 'sheet(TestSheet)' },
    (event: FlatfileEvent) => {
      RecordHook(event, (record: FlatfileRecord) => {
        const age = record.get('age')
        // Gettign the real types here would be nice but seems tricky
        record.set('middleName', 'TestSheet ' + age)
        return record
      })
    }
  )

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

        // Create Space Config
        const spaceConfig = await client.api.addSpaceConfig({
          spacePatternConfig: blueprint,
        })
        if (!spaceConfig.data?.id) return
        const space = await client.api.addSpace({
          spaceConfig: {
            name: 'Test Space',
            environmentId: event.context.environmentId,
            spaceConfigId: spaceConfig.data.id,
          },
        })
      } catch (e) {
        console.log(`error creating SpaceConfig or Space: ${e}`)
      }
    }
  })
})

const FlatfileVM = new FlatfileVirtualMachine()

example.mount(FlatfileVM)

export default example
