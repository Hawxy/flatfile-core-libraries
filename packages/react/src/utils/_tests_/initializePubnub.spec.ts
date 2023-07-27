import PubNub from 'pubnub'
import { vi } from 'vitest'
import { EventSubscriber } from '../EventSubscriber'
import { initializePubnub } from '../initializePubnub'

vi.mock('./EventSubscriber', () => ({
  EventSubscriber: {
    getClient: vi.fn(),
  },
}))

const spaceId = 'your-space-id'
const accessToken = 'your-access-token'
const apiUrl = 'http://localhost:3000'

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
      uuid: 'test-uuid',
    })

    vi.spyOn(EventSubscriber, 'getClient').mockResolvedValueOnce({
      pubnub,
      token: accessToken,
    })

    const result = await initializePubnub({ spaceId, accessToken, apiUrl })

    expect(EventSubscriber.getClient).toHaveBeenCalledWith(
      spaceId,
      accessToken,
      apiUrl
    )
    expect(result).toBe(pubnub)
  })

  it('should throw an error if pubnub object is falsy', async () => {
    const error = new Error(
      'Failed to obtain pubnub object from Event Subscriber response'
    )

    vi.spyOn(EventSubscriber, 'getClient').mockRejectedValue(error)

    await expect(
      initializePubnub({ spaceId, accessToken, apiUrl })
    ).rejects.toThrow(
      'Failed to initialize Pubnub: Failed to obtain pubnub object from Event Subscriber response'
    )

    expect(EventSubscriber.getClient).toHaveBeenCalledWith(
      spaceId,
      accessToken,
      apiUrl
    )
  })
})
