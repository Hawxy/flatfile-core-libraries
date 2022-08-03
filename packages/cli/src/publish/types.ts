export interface PublishSchema {
  teamId: number
  schemaId: number
  apiURL: string
  env?: 'prod' | 'dev'
}
