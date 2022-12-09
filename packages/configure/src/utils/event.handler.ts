import wildMatch from 'wildcard-match'
import { mapSeries } from 'async'
import { Event } from '@flatfile/api'
import { AuthenticatedClient } from './authenticated.client'

export class EventHandler extends AuthenticatedClient {
  /**
   * Event target name, defaults to all events
   */
  public readonly targetName: string = '*'

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
   * @param slug
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
    const internalEvent = new FlatfileEvent(event)

    await this.emit(internalEvent)
  }
}

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
  public readonly target: string
  public readonly context: any
  public readonly body: any

  /**
   * Target entity id
   *
   * @example us0_wb_82hgidh9skd
   */
  // public readonly target: string // workbook(PrimaryCRMWorkbook)

  // public readonly context: any // -> [us0_acc_ihjh8943h9w, space_id, workbook_id]
  // public readonly body: any

  constructor(private readonly src: Event) {
    super()
    this.name = src.topic // workbook:created
    this.target = `sheet(${src.context.sheetSlug?.split('/').pop()})` // workbook(PrimaryCRMWorkbook)
    this.context = src.context // -> [us0_acc_ihjh8943h9w, space_id, workbook_id]
    this.body = src.payload
  }

  /**
   * Should return either event body if expanded already or fetch data from the
   * signed callback URL
   */
  get data(): Promise<any> {
    // fetch from url
    if (this.src.dataUrl) {
      return this.http.get(`/${this.src.dataUrl}`).then((res) => {
        return res.data.data
      })
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
