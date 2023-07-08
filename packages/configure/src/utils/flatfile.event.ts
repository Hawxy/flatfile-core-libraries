import { AuthenticatedClient } from './authenticated.client'
import { Event } from '@flatfile/api'
// const axios = require('axios')
export class FlatfileEvent extends AuthenticatedClient {
  /**
   * Event ID from the API
   *
   * @example us0_ev_82hgidh9skd
   * @readonly
   *
   */
  public readonly id?: string

  /**
   * Topic the event was produced on
   *
   * @example workbook:created
   * @readonly
   */
  public readonly topic?: string

  public readonly name: string
  public readonly domain: string
  public readonly target: string
  public readonly context: any
  public readonly body: any

  public readonly action?: string
  /**
   * Target entity id
   *
   * @example us0_wb_82hgidh9skd
   */
  // public readonly target: string // workbook(PrimaryCRMWorkbook)

  // public readonly context: any // -> [us0_acc_ihjh8943h9w, space_id, workbook_id]
  // public readonly body: any

  constructor(readonly src: Event) {
    super()
    const actionName = src.context.actionName
    const sheetSlug = src.context.sheetSlug
    this.domain = sheetSlug && src.domain === 'workbook' ? 'sheet' : src.domain
    const actionTarget = `${this.domain}(${actionName?.split(':')[0]})`
    this.name = src.topic // workbook:created, file:uploaded
    this.target =
      this.domain === 'file'
        ? 'space(*)'
        : actionName
        ? actionTarget
        : `sheet(${sheetSlug?.split('/').pop()})` // workbook(PrimaryCRMWorkbook)
    this.context = src.context // -> [us0_acc_ihjh8943h9w, space_id, workbook_id]
    this.body = src.payload
    this.action = actionName
  }

  /**
   * Should return either event body if expanded already or fetch data from the
   * signed callback URL
   */
  get data(): Promise<any> {
    if (this.src.dataUrl) {
      return this.fetch(this.src.dataUrl)
    } else {
      return this.body
    }
  }

  /**
   * Fetch the actual body of each context item referenced
   * @param _contexts
   * @todo later
   */
  expand(..._contexts: string[]) {
    // await ev.expand('acccount', 'space')
    // ev.account
    // -> accounts.getAccount('id')
  }

  ack(_progress: number = 100) {
    // call ack API with error
    // only on ackable events
  }
}

export type EventCallback = (evt: FlatfileEvent) => void
