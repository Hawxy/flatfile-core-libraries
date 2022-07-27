import { TPrimitive } from '@flatfile/orm'
import { FlatfileRecord } from '@flatfile/hooks'
import { SchemaILField, SchemaILModel } from '@flatfile/schema'
import { HookContract, HookProvider } from '../lib/HookProvider'
import { capitalCase } from 'case-anything'
import { forEachObj, isError } from 'remeda'
import { FlatfileEvent } from '../lib/FlatfileEvent'

export type TRecordStageLevel =
  | 'cast'
  | 'empty'
  | 'compute'
  | 'validate'
  | 'apply'
  | 'other'

export class Field<
  T extends any,
  O extends Record<string, any>
> extends HookProvider<FieldEventRegistry<T>> {
  public constructor(
    public readonly options: O &
      GenericFieldOptions &
      Partial<IFieldEvents<T>> = {} as O
  ) {
    super()
    this.attachListenersFromOptions(options)
  }

  public registerSerializer(
    cb: (base: SchemaILModel, key: string) => SchemaILModel
  ) {
    this.configFactory = cb
  }

  public async routeEvents<E extends FlatfileEvent<FlatfileRecord>>({
    key,
    event,
    events = Object.keys(EventNames) as (keyof typeof EventNames)[],
  }: {
    key: string
    event: E
    events?: (keyof typeof EventNames)[]
  }) {
    let e: FlatfileEvent<any>
    e = event.fork('cast', { value: event.data.get(key) })

    for (const eventName of events) {
      try {
        switch (eventName) {
          case 'cast':
            e = await this.pipeHookListeners(eventName, e)
            break
          case 'empty':
            if (e.data.value === null) {
              e = await this.pipeHookListeners(eventName, e)
              this.applyHookResponseToRecord(event.data, key, e.data.value)
            }
            break
          case 'value':
            if (e.data.value !== null) {
              e = await this.pipeHookListeners(eventName, e)
              this.applyHookResponseToRecord(event.data, key, e.data.value)
            }
            break
          case 'validate':
            e = await this.pipeHookListeners(eventName, e)
            this.applyHookResponseToRecord(
              event.data,
              key,
              undefined,
              e.data.messages
            )
            break
        }
      } catch (err: any) {
        const errorMessage = new Message(err, 'error', EventNames[eventName])
        this.applyHookResponseToRecord(event.data, key, undefined, errorMessage)
        return
      }
    }
  }

  public toSchemaIL(baseSchema: SchemaILModel, key: string): SchemaILModel {
    const builtSchema = this.configFactory(baseSchema, key)
    const { required, unique, primary, description, label } = this.options

    builtSchema.fields[key] = {
      ...builtSchema.fields[key],
      ...(description ? { description } : {}),
      ...(primary ? { primary } : {}),
      ...(required ? { required } : {}),
      ...(unique ? { unique } : {}),

      label: label || capitalCase(key),
    }

    return builtSchema
  }

  public applyHookResponseToRecord(
    record: FlatfileRecord,
    key: string,
    value?: TPrimitive,
    message?: string | Error | Message | Message[]
  ) {
    if (value !== undefined) {
      record.set(key, value)
    }
    if (message !== undefined) {
      if (isError(message)) {
        record.addError(key, message.message)
      } else if (typeof message === 'string') {
        record.addError(key, message)
      } else if (message instanceof Message) {
        record.pushInfoMessage(
          key,
          message.message,
          message.level,
          message.stage
        )
      }
    }
  }

  private attachListenersFromOptions(
    options: O & GenericFieldOptions & Partial<IFieldEvents<T>>
  ) {
    forEachObj.indexed(options, (cb: any, key) => {
      switch (key) {
        case 'cast':
          this.on('cast', (e) => {
            return { value: cb(e.data.value, e) }
          })
          break
        case 'compute':
          this.on('value', (e) => {
            return { value: cb(e.data.value, e) }
          })
          break
        case 'empty':
          this.on('empty', (e) => {
            return { value: cb(null, e) }
          })
          break
        case 'validate':
          this.on('validate', (e) => {
            return { messages: cb(e.data.value, e) }
          })
          break
      }
    })
  }

  private configFactory: (base: SchemaILModel, key: string) => SchemaILModel = (
    base
  ) => base
}

export type FieldEventRegistry<T> = {
  cast: HookContract<{ value: Nullable<TPrimitive> }, { value: Nullable<T> }>
  value: HookContract<{ value: T }, { value: Nullable<T> }>
  empty: HookContract<{ value: null }, { value: Nullable<T> }>
  validate: HookContract<{ value: T }, { messages: void | Message[] | Message }>
}

/*
 * OptionsAndEvents are Options and Events and are used to create a Field
 */
type OptionsAndEvents<T, O> = O & GenericFieldOptions & Partial<IFieldEvents<T>>

export function makeField<T extends any, O extends Record<string, any> = {}>(
  factory: (
    field: Field<T, O>
  ) => (base: SchemaILModel, key: string) => SchemaILModel
) {
  function fieldHelper(options?: OptionsAndEvents<T, O>): Field<T, O>
  function fieldHelper(
    label: string,
    options?: OptionsAndEvents<T, O>
  ): Field<T, O>
  function fieldHelper(
    labelOptions?: string | O,
    options?: OptionsAndEvents<T, O>
  ): Field<T, O> {
    // if labelOptions is a string, then it is the label
    const label = typeof labelOptions === 'string' ? labelOptions : undefined
    // if labelOptions is an object, then it is the options
    const labelOrOptions =
      (typeof labelOptions !== 'string' ? labelOptions : options) ?? {}

    // merge the label and options
    const mergedOptions = {
      label,
      ...labelOrOptions,
    }

    const field = new Field<T, O>(mergedOptions as unknown as O)
    const serializer = factory(field)
    field.registerSerializer(serializer)
    return field
  }

  return fieldHelper
}

export function setProp(
  base: SchemaILModel,
  key: string,
  prop: Partial<SchemaILField>
): SchemaILModel {
  return {
    ...base,
    fields: {
      ...base.fields,
      [key]: {
        type: 'string',
        ...prop,
      } as SchemaILField,
    },
  }
}

export interface GenericFieldOptions {
  /**
   * Describe the field
   */
  description?: string
  primary?: boolean
  required?: boolean
  unique?: boolean
}

export interface IFieldEvents<T> {
  cast: (value: Dirty<T>) => Nullable<T>
  empty: () => T
  compute: (value: T) => T
  validate: (value: T) => Waitable<void | Message[] | Message>
}

export type Dirty<T> = string | null | T
export type Nullable<T> = null | T
export type Waitable<T> = T
export type Writable<T> = Waitable<T | Value<T>>

class Value<T> {
  constructor(
    public readonly value: T,
    public readonly meta: Record<any, any>
  ) {}
}

export class Message {
  constructor(
    public readonly message: string,
    public readonly level: 'error' | 'warn' | 'info' = 'info',
    public readonly stage: TRecordStageLevel
  ) {}
}

enum EventNames {
  cast = 'cast',
  value = 'compute',
  empty = 'empty',
  validate = 'validate',
}
