import { FlatfileRecords, FlatfileSession } from '@flatfile/hooks'
import { FlatfileEvent } from '../lib/FlatfileEvent'
import { Sheet } from './Sheet'
import { mapValues, pipe, values } from 'remeda'
import { IJsonSchema } from '@flatfile/schema'

export class Workbook {
  constructor(public readonly options: IWorkbookOptions) {}

  public async routeEvents(event: FlatfileEvent<FlatfileRecords<any>>) {
    // find models identified by target
    const { namespace } = this.options
    const targets = Object.keys(this.options.sheets)
    const foundTarget = targets.find((t) =>
      event.target.includes(namespace + '/' + t)
    )
    if (foundTarget) {
      await this.options.sheets[foundTarget].routeEvents(event)
    } else {
      throw new Error('no target found')
    }
  }

  public async handleLegacyDataHook(payload: IHookPayload) {
    const recordBatch = new FlatfileRecords(
      payload.rows.map((r: { row: any }) => r.row)
    )
    const session = new FlatfileSession(payload)
    const event = new FlatfileEvent(
      'records/change',
      recordBatch,
      session,
      console
    )
    await this.routeEvents(event)
    return recordBatch.toJSON()
  }

  public runHookOnLambda = async ({
    recordBatch,
    session,
    logger,
    eventType = 'records/change',
  }: {
    recordBatch: FlatfileRecords<any>
    session: FlatfileSession
    logger: any
    eventType?: string
  }) => {
    const event = new FlatfileEvent(eventType, recordBatch, session, logger)
    await this.routeEvents(event)
    return recordBatch.toJSON()
  }
}

export interface IHookPayload {
  workspaceId: string
  workbookId: string
  schemaId: number
  schemaSlug: string
  uploads: string[]
  rows: any
  endUser?: any // TODO
  env?: Record<string, string | boolean | number>
  envSignature?: string
}
// target

interface IWorkbookOptions {
  namespace: string
  name: string
  sheets: Record<string, Sheet<any>>
  ref?: string
  options?: {
    // tbd
  }
}
