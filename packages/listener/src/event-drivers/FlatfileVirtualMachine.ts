import { EventDriver } from './_EventDriver'
import { EventHandler, FlatfileEvent } from '../events'

/**
 * Flatfile's Virtual Machine is stateless / serverless. So when a new event
 * is handled, it will just call `handle(event)`.
 */
export class FlatfileVirtualMachine extends EventDriver {
  /**
   * This method is triggered from within the Flatfile Core VM Runner. This
   * EventDriver does not have to listen for events because this method will
   * be invoked as necessary.
   *
   * @param event
   */
  handle(event: FlatfileEvent) {
    this.dispatchEvent(event)
  }

  mountEventHandler(handler: EventHandler): this {
    const IS_NODE =
      typeof global === 'object' &&
      '[object global]' === global.toString.call(global)
    const IS_BROWSER =
      // @ts-ignore - ts says window is undefined here, but when mounted it is not
      typeof window === 'object' &&
      // @ts-ignore - ts says window is undefined here, but when mounted it is not
      '[object Window]' === window.toString.call(window)

    if (IS_NODE && !IS_BROWSER)
      handler.setVariables({
        fetchApi: require('node-fetch')
      })

    this._handler = handler
    return this
  }
}
