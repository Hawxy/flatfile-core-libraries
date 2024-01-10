import Pubnub from 'pubnub'

export interface State {
  pubNub?: Pubnub | null
  error?: Error | string
  localSpaceId: string
  accessTokenLocal: string
  spaceUrl: string
}
