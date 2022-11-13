import { FlatfileRecords, FlatfileSession } from '@flatfile/hooks'
import { Sheet } from './Sheet'
import { Portal } from './Portal'

export class Workbook {
  constructor(public readonly options: IWorkbookOptions) {}

  public async processRecords(
    records: FlatfileRecords<any>,
    payload: IHookPayload,
    logger?: any
  ) {
    // find models identified by target
    const { namespace } = this.options
    const sheetTarget = payload.schemaSlug
    const targets = Object.keys(this.options.sheets)
    const foundTarget = targets.find((t) =>
      sheetTarget.includes(namespace + '/' + t)
    )
    if (foundTarget) {
      return await this.options.sheets[foundTarget].runProcess(
        records,
        payload as FlatfileSession,
        logger
      )
    } else {
      throw new Error('no target found')
    }
  }

  public async handleLegacyDataHook(payload: IHookPayload) {
    const recordBatch = new FlatfileRecords(
      payload.rows.map((r: { row: any }) => r.row)
    )
    await this.processRecords(recordBatch, payload)

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
    await this.processRecords(recordBatch, session, logger)
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

interface IWorkbookOptions {
  namespace: string
  name: string
  sheets: Record<string, Sheet<any>>
  ref?: string
  options?: {
    // tbd
  }
  portals?: Portal[]
}
