import { Portal } from '@flatfile/configure'

export interface PublishSchemas {
  teamId: number
  schemaIds: number[]
  apiURL: string
  env?: 'prod' | 'test'
  portals?: Portal[]
}
export interface PublishSchema {
  teamId: number
  schemaId: number
  apiURL: string
  env?: 'prod' | 'test'
}

export interface PublishEmbed {
  teamId: number
  embedId: string
  apiURL: string
  env?: 'prod' | 'test'
}
