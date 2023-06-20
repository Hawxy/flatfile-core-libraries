import { EventSubscriber } from './EventSubscriber'
import { getErrorMessage } from './getErrorMessage'

interface InitializePubnub {
  spaceId: string
  accessToken: string
}

export const initializePubnub = async ({
  spaceId,
  accessToken
}: InitializePubnub) => {
  try {
    const response = await EventSubscriber.getClient(spaceId, accessToken)
    if (!response) {
      throw new Error('Failed to obtain response from Event Subscriber')
    }
    if (!response.pubnub) {
      throw new Error(
        'Failed to obtain pubnub object from Event Subscriber response'
      )
    }
    return response.pubnub
  } catch (e) {
    throw new Error(`Failed to initialize Pubnub: ${getErrorMessage(e)}`)
  }
}
