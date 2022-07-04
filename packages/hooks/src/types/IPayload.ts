import { IRawRecord } from './Record'

export interface IPayload {
  workspaceId: string
  workbookId: string
  schemaId: number
  schemaSlug: string
  uploads: string[]
  endUser?: any // TODO
  env?: Record<string, string | boolean | number>
  envSignature?: string
  rows: IRawRecord[]
}
