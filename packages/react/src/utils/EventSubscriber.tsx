import { FlatfileClient } from '@flatfile/api'
import PubNub from 'pubnub'

export class EventSubscriber {
  public static async getClient(spaceId: string, accessToken: string) {
    const flatfile = new FlatfileClient({
      token: accessToken,
      environment: 'https://platform.flatfile.com/api/v1',
    })

    try {
      const { data } = await flatfile.events.getEventToken({ spaceId })

      const pubnub = new PubNub({
        subscribeKey: data.subscribeKey!,
        uuid: data.accountId!,
      })
      pubnub.setToken(data.token!)

      return { pubnub, token: data.token }
    } catch (e) {
      console.warn('Unable to get event token: ', e)
      throw new Error(`Unable to get event token: , ${e}`)
    }
  }
}
