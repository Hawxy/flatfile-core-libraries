import { ErrorObject } from 'ajv'

export type Levels = 'error' | 'warn' | 'info' | ''
export enum EMessageLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
}

export interface ITransformInfo {
  field: string
  message: string
  level: EMessageLevel
}
export interface JsonSchemaProperty {
  title?: string
  description?: string
  enum?: { label: string; value: string }[]
  enumArray?: { label: string; value: string }[]
  enumLabel?: string[]
  enumLabelArray?: string[]
  field?: string
  format?: string
  isMultiple?: boolean
  items?: {
    type: string | string[]
    enum?: { label: string; value: string }[]
    enumLabel?: string[]
    pattern?: string
    format?: string
  }
  label: string
  minimum?: number
  maximum?: number
  regexp?: {
    cache?: RegExp
    pattern: string
    flags: string
    ignoreBlanks?: boolean
  }
  required?: boolean
  type: string | string[]
  exportDateFormat?: string
  unique?: boolean
  pattern?: string
  primary?: boolean
  $schemaId?: string
  default?: string
  custom?: boolean
}

export interface JsonSchemaPropertyWithArrayTypes extends JsonSchemaProperty {
  type: string[]
}

export interface IRawSchemaProperty extends JsonSchemaProperty {
  field: string
  linkedProperties?: Record<string, IRawSchemaProperty>
}

export interface IJsonSchema {
  properties: Record<string, IRawSchemaProperty>
  type: string
  required?: string[]
  unique?: string[]
  primary?: string
  linkedProperties?: Record<string, IRawSchemaProperty>
  allowCustomFields?: boolean
}

/**
 * Extends the AJV ErrorObject to include error levels
 */
export interface IValidationError extends ErrorObject {
  level: EMessageLevel
}

export enum EValidationState {
  review = 'review',
  dismissed = 'dismissed',
  pushed = 'pushed',
  accepted = 'accepted',
  rejected = 'rejected',
}

export interface IRowStatePayload {
  filter: object
  state: EValidationState
  userId: number
  viewId: number
}
export type TPrimitive = string | boolean | number | Date | null

export type TRecordData<T extends TPrimitive | undefined = TPrimitive> = {
  [key: string]: T
}
export interface IRawRecord {
  rawData: TRecordData
  rowId: number
}
export type IRawRecordSet = IRawRecord[]
