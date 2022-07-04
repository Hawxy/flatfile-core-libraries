import {
  EMessageLevel,
  IJsonSchema,
  JsonSchemaPropertyWithArrayTypes,
  TPrimitive,
} from '../types'

export enum EPropertyType {
  BOOLEAN = 'boolean',
  DEFAULT = 'default',
  ENUM = 'enum',
  NUMERIC = 'number',
  SCHEMA_REF = 'schema_ref',
}

export interface IValidation {
  error: EMessageLevel
  key: string
  message: string | undefined
  type: EValidationType | undefined
}

export type RowData<T extends TPrimitive | undefined = TPrimitive> = {
  [key: string]: T
}

export type RawRecord<T extends TPrimitive | undefined = TPrimitive> = {
  //  rawData: { [key: string]: T };
  rawData: RowData<T>
  rowId: number
  okToMerge?: boolean
}

export type RawRecordArray = {
  rawData: { key: string; value: string }[]
  rowId: number
}

export type RecordCells = { [key: string]: ICell }

export enum EValidationType {
  uniqueError = 'unique',
  typeError = 'type',
  valueError = 'value',
  unlinkedError = 'unlinked',
  missingPreviewWarning = 'missingPreview',
}

export enum EAuthorType {
  USER = 'User',
  SCHEMA_FUNCTION = 'SchemaFunction',
  WEBHOOK = 'Webhook',
  TYPE_CAST = 'TypeCast',
  ENUM_MATCH = 'EnumMatch',
  UPLOAD = 'Upload',
  API = 'API',
}

export interface IStorage {
  value: TPrimitive
  pending?: string | null
  match_key_sub?: string | null
}

export interface IRecord {
  validations: IValidation[]
  upToDateValidations: boolean
  cells: RecordCells
  updateFromObject(obj: { [k: string]: TPrimitive }): IRecord
}

export interface ICell {
  /**
   * Temporary storage of new value if modified
   */

  matchKeySub?: string
  /*
    new(
	property: ISchemaProperty,
	record: IRecord,
	liveValue?: TPrimitive,
	pending?: TPrimitive
    ): ICell;
*/
  readonly property: ISchemaProperty
  // record: IRecord;
  get value(): TPrimitive
  get storedValue(): TPrimitive
  get key(): string
  setValue(value: TPrimitive | undefined, _author?: [EAuthorType, string]): void
  messages(level?: EMessageLevel): IValidation[]
  get isValid(): boolean
  isPure(): boolean
  toStorage(): IStorage
}

export interface IEnumOption {
  label: string
  value: TPrimitive
  icon?: string
}

export interface ISchemaProperty {
  /*
	new(
		schema: ISchema,
		rawKey: string,
		definition: JsonSchemaPropertyWithArrayTypes
	): ISchemaProperty;
*/
  sanitize(rawKey: string): string
  get key(): string
  get originalKey(): string

  get unique(): boolean
  get custom(): boolean
  get schemaId(): number | undefined
  get label(): string | undefined

  get type(): EPropertyType
  get options(): IEnumOption[]
  get default(): JsonSchemaPropertyWithArrayTypes['default']
}

export function mapObject<
  K extends string | number | symbol = string | number | symbol,
  T extends any = any,
  R = any
>(obj: Record<K, T>, cb: (key: K, value: T) => R): R[] {
  return Object.keys(obj).map((k) => {
    // @ts-ignore
    return cb(k as K, obj[k])
  })
}

export interface ISchema {
  /*new( raw: IJsonSchema,  page?: number): ISchema */
  raw: IJsonSchema
  get properties(): ISchemaProperty[]
  hasRawProperty(key: string): boolean
}

export interface MinSheet {
  getSchemas(): ISchema[]
  update(records: IRecord[], eventId?: string): Promise<IRecord[]>
  getRecordsByIds(
    ids: number[],
    joinLinkedProperties: boolean
  ): Promise<IRecord[]>

  getRecordsByColumnValues(
    prop: string,
    values: TPrimitive[],
    onlyOnePerValue?: boolean
  ): Promise<IRecord[]>

  previewFields(): { [key: string]: ISchemaProperty }
  accessSiblingSheets(schemaIds: number[]): Promise<{ [k: string]: MinSheet }>
  get linkedPropertiesFromAllSchemas(): ISchemaProperty[]
  get schema(): ISchema
  get propertiesFromAllSchemas(): ISchemaProperty[]
}
