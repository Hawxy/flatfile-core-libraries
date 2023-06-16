import { AuthenticatedClient } from './authenticated.client'

import { EventCache } from './cache'
import { RecordsWithLinks, Event } from '@flatfile/api/api'
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
  public readonly topic: string
  public readonly domain: string
  public readonly target: string
  public readonly origin: object
  public readonly action: string
  public readonly context: any
  public readonly payload: any
  public readonly cache: EventCache
  public readonly namespace: string[]

  constructor(
    private readonly src: Event,
    accessToken?: string,
    apiUrl?: string
  ) {
    super(accessToken, apiUrl)
    this.cache = new EventCache()
    this.domain = src.domain
    this.topic = src.topic
    this.context = src.context // -> [us0_acc_ihjh8943h9w, space_id, workbook_id]
    this.payload = src.payload
    this.target = src.target || ''
    this.origin = src.origin || {}
    this.action = src.context?.actionName || ''
    this.namespace = src.namespaces || []
  }

  /**
   * Should return either event body if expanded already or fetch data from the
   * signed callback URL
   *
   * @todo this should work with the included callback URL
   */
  get data(): Promise<any> {
    if (this.src.dataUrl) {
      return this.fetch(this.src.dataUrl)
    } else {
      return this.payload
    }
  }

  private afterAllCallbacks: Map<any, any> = new Map()
  afterAll<T>(callback: () => T, cacheKey?: string): void {
    const key = cacheKey || callback.toString()
    if (!this.afterAllCallbacks.get(key)) {
      this.afterAllCallbacks.set(key, callback)
    }
  }

  async update(records: RecordsWithLinks) {
    if (!this.src.dataUrl) {
      throw new Error('Cannot set data on an event without a dataUrl')
    }

    // TODO: do we need to remove source from the messages array?
    records.map((record) => {
      record.messages?.map((message) => {
        delete message.source
      })
    })

    await this.fetch(this.src.dataUrl, {
      method: 'PUT',
      data: records,
    })
  }
}

export type EventCallback = (evt: FlatfileEvent) => void
