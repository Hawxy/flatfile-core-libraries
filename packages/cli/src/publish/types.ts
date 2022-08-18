export interface PublishSchemas {
  teamId: number
  schemaIds: number[]
  apiURL: string
  env?: 'prod' | 'test'
}
export interface PublishSchema {
  teamId: number
  schemaId: number
  apiURL: string
  env?: 'prod' | 'test'
}
