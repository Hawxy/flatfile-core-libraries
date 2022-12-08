import wildMatch from 'wildcard-match'
import { mapSeries } from 'async'
import { authAction } from './auth.action'
import { Event } from '@flatfile/api'
import axios from 'axios'
import { FlatfileRecord, FlatfileRecords } from '@flatfile/hooks'
import { IHookPayload } from '../ddl/Workbook'
import { RecordTranslater, XRecord } from './record.translater'

const adapter = require('axios/lib/adapters/http')

const AGENT_INTERNAL_URL =
  process.env.AGENT_INTERNAL_URL || 'http://localhost:3000'
export class EventHandler {
  /**
   * Event target name, defaults to all events
   */
  public readonly targetName: string = '*'
  public processRecords = async (
    _records: FlatfileRecords<any>,
    _payload: IHookPayload,
    _logger?: undefined
  ): Promise<FlatfileRecords<any>> => {
    return _records
  }
  /**
   * Cache of registered listeners on this instance
   * @private
   */
  private eventListeners: [string | string[], EventCallback][] = []

  /**
   * Cache of registered child nodes for this listener
   * @private
   */
  private childNodes: [EventHandler, undefined | string][] = []

  /**
   * Register a subscriber for events that match this path
   *
   * @param listenerQuery any event name or grep pattern
   */
  on(listenerQuery: string | string[], callback: EventCallback) {
    this.eventListeners.push([listenerQuery, callback])
    return this
  }
  /**
   * Register a subscriber for events that match this path
   *
   * @param eventlistener any event name or grep pattern
   */
  addEventListener(listenerQuery: string | string[], callback: EventCallback) {
    this.eventListeners.push([listenerQuery, callback])
    return this
  }

  /**
   * Add child nodes to send this event to as well
   *
   * @param children
   */
  addNode(node: EventHandler, slug?: string) {
    this.childNodes.push([node, slug])
  }

  /**
   * Register a bulk set of listeners instead
   *
   * @param listeners
   */
  registerListeners(listeners: Record<string, EventCallback>) {
    for (const x in listeners) {
      this.addEventListener(x, listeners[x])
    }
  }

  /**
   * Emit an event and resolve the promise once it has completed (or errored
   * @param event
   */
  async emit(event: FlatfileEvent): Promise<void> {
    const target = this.findTargetNode(event.target)
    if (!target) {
      return
    } else {
      return target.trigger(event)
    }
  }

  /**
   * Actually trigger the event listeners on this particular target
   *
   * @note It is safer for now to run this in series to avoid IO locks and
   *       potential race conditions and uncaught errors
   *
   * @param event
   */
  async trigger(event: FlatfileEvent): Promise<void> {
    const listeners = this.getListeners(event)
    await mapSeries(listeners, (cb: EventCallback) => {
      return cb(event)
    })
  }

  /**
   * Get any listeners from this target subscribing to this event
   *
   * @param event
   */
  public getListeners(event: FlatfileEvent): EventCallback[] {
    return this.eventListeners
      .filter(([query]) => {
        const isMatch = wildMatch(query, ':')
        return isMatch(event.name)
      })
      .map(([_q, cb]) => cb)
  }

  /**
   * Implement a function that returns a target name compatible with the event
   * routing system
   *
   * @param slug A context-defined slug (allows the same entity to be used in
   *             multiple contexts)
   */
  public getEventTargetName(slug?: string): string {
    if (slug) {
      return `${this.targetName}(${slug})`
    } else {
      return this.targetName
    }
  }

  /**
   * Traverse through entire target tree and find the target node to emit from
   *
   * @param target
   */
  public findTargetNode(
    target: string,
    slug?: string
  ): EventHandler | undefined {
    if (this.getEventTargetName(slug) === target) {
      return this
    }

    const childNodes = this.childNodes
      .map(([n, slug]) => n.findTargetNode(target, slug))
      .filter((v) => v)

    return childNodes.length > 0 ? childNodes[0] : undefined
  }

  public async routeEvent(event: Event) {
    const headers = {
      Authorization: process.env.FLATFILE_BEARER_TOKEN ?? `Bearer foo`,
    }

    const client = axios.create({
      baseURL: AGENT_INTERNAL_URL,
      adapter,
      timeout: 2500,
      headers,
    })

    async function route(event: Event) {
      const { domain, topic, context } = event

      if (domain === 'file' && topic === 'upload:completed') {
        return fileUploadHook(context.fileId)
      } else if (
        domain === 'workbook' &&
        (topic === 'records:created' || topic === 'records:updated')
      ) {
        // TODO: Provide better fallbcks for these values not being present
        if (!context.workbookId) {
          throw new Error(
            'Missing required context.workbookId for records created hook'
          )
        }
        if (!context.sheetId) {
          throw new Error(
            'Missing required context.sheetId for records created hook'
          )
        }
        if (!context.sheetSlug) {
          throw new Error(
            'Missing required context.sheetSlug for records created hook'
          )
        }
        if (!event.dataUrl) {
          throw new Error(
            'Missing required event.dataUrl for records created hook'
          )
        }
        return recordsCreatedHook(
          context.workbookId,
          context.sheetId,
          context.sheetSlug,
          event.dataUrl
        )
      }
    }

    async function fileUploadHook(fileId: string | undefined) {
      const file = await client.get(`v1/files/${fileId}`, { headers })

      const { ext } = file.data.data
      if (ext === 'csv') {
        const extraction = await client.post(`/v1/files/${fileId}/jobs`, {
          driver: 'csv',
        })
        const { id } = extraction.data.data
        await client.post(`/v1/files/${fileId}/jobs/${id}/execute`)
      }
    }

    // TODO: This could be much cleaner but mimics the example agent.js code nearly 1:1
    const recordsCreatedHook = async (
      workbookId: string,
      sheetId: string,
      sheetslug: string,
      dataUrl: string
    ) => {
      const records = await fetchRecords(dataUrl)
      if (!records) {
        return
      }
      const clearedMessages: XRecord[] = records.map(
        (record: { values: { [x: string]: { messages: never[] } } }) => {
          // clear existing cell validation messages
          Object.keys(record.values).forEach((k) => {
            record.values[k].messages = []
          })
          return record
        }
      )
      const fromX = new RecordTranslater<XRecord>(clearedMessages)
      const recordBatch = fromX.toFlatFileRecords()
      await this.processRecords(recordBatch, {
        schemaSlug: sheetslug,
      } as IHookPayload)

      const fromSDK = new RecordTranslater<FlatfileRecord>(recordBatch.records)
      const convertedRecords = fromSDK.toXRecords()
      return updateRecords(workbookId, sheetId, convertedRecords)
    }

    async function fetchRecords(url: string) {
      const response = (await client.get(`/${url}`)).data.data
      if (response.success) {
        return response.records
      }
      return false
    }

    async function updateRecords(
      workbookId: any,
      sheetId: any,
      records: any[]
    ) {
      return client.put(
        `/v1/workbooks/${workbookId}/sheets/${sheetId}/records`,
        records
      )
    }

    await route(event)
  }
}

export class FlatfileEvent {
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
  public api: any

  /**
   * Target entity id
   *
   * @example us0_wb_82hgidh9skd
   */
  // public readonly target: string // workbook(PrimaryCRMWorkbook)

  // public readonly context: any // -> [us0_acc_ihjh8943h9w, space_id, workbook_id]
  // public readonly body: any

  constructor(
    // private readonly data: any, // us0_ev_82hgidh9skd
    public readonly name: string, // workbook:created
    public readonly target: string, // workbook(PrimaryCRMWorkbook)
    public readonly context: any, // -> [us0_acc_ihjh8943h9w, space_id, workbook_id]
    public readonly body: any
  ) {
    this.authAPI()
  }

  /**
   * Should return either event body if expanded already or fetch data from the
   * signed callback URL
   */
  get data(): Promise<any> {
    // fetch from url
    if (this.body.dataUrl) {
      return this.api.rawRequest(this.body.dataUrl) //
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
  async authAPI() {
    // TODO: get the accesstoken from the environment that the event was triggered from

    const apiUrl = process.env.FLATFILE_API_URL
    if (!apiUrl) {
      console.log(`You must provide a API Endpoint URL.`)
      process.exit(1)
    }

    const clientId = process.env.FLATFILE_CLIENT_ID
    if (!clientId) {
      console.log(
        `You must provide a secret. Set 'clientId' in your .flatfilerc`
      )
      process.exit(1)
    }

    const secret = process.env.FLATFILE_CLIENT_SECRET

    if (!secret) {
      console.log(`You must provide a secret. Set 'secret' in your .flatfilerc`)
      process.exit(1)
    }
    // this.target = target
    this.api = await authAction({ apiUrl, clientId, secret })
  }
}

export type EventCallback = (evt: FlatfileEvent) => void
