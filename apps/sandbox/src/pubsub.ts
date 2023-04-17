import {
  Client,
  FlatfileVirtualMachine,
  FlatfileEvent,
} from '@flatfile/listener'
import { RecordHook, createBlueprintFromConfigure } from '@flatfile/configure'
import { FlatfileRecord } from '@flatfile/hooks'
import xdk from './xdk-simple-deploy'
import { EventTopic } from '@flatfile/api'

const example = Client.create((client) => {
  /**
   * This is a basic hook on events with no sugar on top
   */

  client.on(
    'records:*',
    { target: 'sheet(TestSheet)' },
    (event: FlatfileEvent) => {
      RecordHook(event, (record: FlatfileRecord) => {
        const firstName = record.get('firstName')
        // Gettign the real types here would be nice but seems tricky
        record.set('middleName', 'TestSheet ' + firstName)
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

        const environmentId = event.context.environmentId

        // Create Space
        const space = await client.api.addSpace({
          spaceConfig: {
            name: 'Test Space 2',
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
