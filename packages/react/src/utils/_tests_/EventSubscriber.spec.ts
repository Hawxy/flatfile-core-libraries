import { vi } from 'vitest'
import { FlatfileClient } from '@flatfile/api'
import { EventSubscriber, fetchEventToken } from '../EventSubscriber'
import Pubnub from 'pubnub'

vi.mock('@flatfile/api', () => ({
  FlatfileClient: {
    events: {
      getEventToken: vi.fn()
    }
  }
}))

const fetchEventTokenMock = vi.fn()
vi.mock('./EventSubscriber', () => ({
  fetchEventToken: fetchEventTokenMock
}))

const setToken = vi.fn()
vi.mock('pubnub', () => ({
  default: vi.fn().mockImplementation(() => {
    return {
      setToken
    }
  })
}))

const mockClient = new FlatfileClient({
  token: 'test-token',
  environment: 'https://platform.flatfile.com/api/v1'
})

describe('fetchEventToken', () => {
  const spaceId = 'your-space-id'
  const mockData = {
    subscribeKey: 'your-subscribe-key',
    accountId: 'your-account-id',
    token: 'your-token'
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterAll(() => {
    vi.resetAllMocks()
  })

  it('should fetch the token when all required fields are present', async () => {
    vi.spyOn(
      FlatfileClient.prototype.events,
      'getEventToken'
    ).mockResolvedValueOnce({
      data: mockData
    })

    const result = await fetchEventToken(mockClient, spaceId)

    expect(result).toEqual(mockData)
  })

  it('should throw an error when subscribeKey is missing', async () => {
    vi.spyOn(
      FlatfileClient.prototype.events,
      'getEventToken'
    ).mockResolvedValueOnce({
      data: {}
    })

    await expect(fetchEventToken(mockClient, spaceId)).rejects.toThrow(
      `Missing subscribe key in event token response`
    )
  })

  it('should throw an error when accountId is missing', async () => {
    vi.spyOn(
      FlatfileClient.prototype.events,
      'getEventToken'
    ).mockResolvedValueOnce({
      data: { subscribeKey: 'your-subscribe-key' }
    })

    await expect(fetchEventToken(mockClient, spaceId)).rejects.toThrow(
      'Missing account ID in event token response'
    )
  })

  it('should throw an error when token is missing', async () => {
    vi.spyOn(
      FlatfileClient.prototype.events,
      'getEventToken'
    ).mockResolvedValueOnce({
      data: {
        subscribeKey: 'your-subscribe-key',
        accountId: 'your-account-id'
      }
    })

    await expect(fetchEventToken(mockClient, spaceId)).rejects.toThrow(
      'Missing token in event token response'
    )
  })
})

describe('EventSubscriber', () => {
  describe('getClient', () => {
    beforeEach(() => {
      vi.clearAllMocks()
    })

    it('should create a PubNub instance and set the token', async () => {
      const spaceId = 'spaceId'
      const accessToken = 'accessToken'
      const subscribeKey = 'subscribeKey'
      const accountId = 'accountId'
      const token = 'token'

      // Mock the PubNub class and its methods
      const setTokenMock = vi.fn()
      const addListenerMock = vi.fn()
      const pubnubInstanceMock = {
        setToken: setTokenMock,
        addListener: addListenerMock
      }
      vi.spyOn(
        FlatfileClient.prototype.events,
        'getEventToken'
      ).mockResolvedValue({
        data: {
          subscribeKey,
          accountId,
          token
        }
      })

      vi.spyOn(Pubnub.prototype as any, 'constructor').mockReturnValueOnce(
        pubnubInstanceMock
      )
      const result = await EventSubscriber.getClient(spaceId, accessToken)

      expect(result.token).toEqual(token)
    })
  })
})
