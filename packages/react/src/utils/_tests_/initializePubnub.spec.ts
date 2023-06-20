import { vi } from 'vitest'
import { initializePubnub } from '../initializePubnub'
import { EventSubscriber } from '../EventSubscriber'
import PubNub from 'pubnub'

vi.mock('./EventSubscriber', () => ({
  EventSubscriber: {
    getClient: vi.fn()
  }
}))

const spaceId = 'your-space-id'
const accessToken = 'your-access-token'

describe('initializePubnub', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterAll(() => {
    vi.resetAllMocks()
  })

  it('should return pubnub when initialization is successful', async () => {
    const pubnub = new PubNub({
      subscribeKey: 'test-subscribe-key',
      uuid: 'test-uuid'
    })

    vi.spyOn(EventSubscriber, 'getClient').mockResolvedValueOnce({
      pubnub,
      token: accessToken
    })

    const result = await initializePubnub({ spaceId, accessToken })

    expect(EventSubscriber.getClient).toHaveBeenCalledWith(spaceId, accessToken)
    expect(result).toBe(pubnub)
  })

  it('should throw an error if pubnub object is falsy', async () => {
    const error = new Error(
      'Failed to obtain pubnub object from Event Subscriber response'
    )

    vi.spyOn(EventSubscriber, 'getClient').mockRejectedValue(error)

    await expect(initializePubnub({ spaceId, accessToken })).rejects.toThrow(
      'Failed to initialize Pubnub: Failed to obtain pubnub object from Event Subscriber response'
    )

    expect(EventSubscriber.getClient).toHaveBeenCalledWith(spaceId, accessToken)
  })
})
