import { TPrimitive } from '@flatfile/orm'
import { FlatfileRecord } from '@flatfile/hooks'
import { SchemaILField, SchemaILModel } from '@flatfile/schema'
import { HookContract, HookProvider } from '../lib/HookProvider'
import { capitalCase } from 'case-anything'
import { forEachObj, isError } from 'remeda'
import { FlatfileEvent } from '../lib/FlatfileEvent'

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

  public async routeEvents<E extends FlatfileEvent<FlatfileRecord>>(
    key: string,
    event: E
  ) {
    try {
      let e: any
      e = event.fork('cast', { value: event.data.get(key) })
      e = await this.pipeHookListeners('cast', e)

      if (e.data.value === null) {
        e = await this.pipeHookListeners('empty', e)
      }

      if (e.data.value !== null) {
        e = await this.pipeHookListeners('value', e)
      }

      this.applyHookResponseToRecord(event.data, key, e.data.value)
      e = await this.pipeHookListeners('validate', e)
      this.applyHookResponseToRecord(
        event.data,
        key,
        undefined,
        e.data.messages
      )
    } catch (err: any) {
      this.applyHookResponseToRecord(event.data, key, undefined, err)
    }
  }

  public toSchemaIL(baseSchema: SchemaILModel, key: string): SchemaILModel {
    return this.configFactory(baseSchema, key)
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
        record.pushInfoMessage(key, message.message, message.level)
      }
    }
  }

  private attachListenersFromOptions(
    options: O & GenericFieldOptions & Partial<IFieldEvents<T>>
  ) {
    forEachObj.indexed(options, (cb: any, key) => {
      switch (key) {
        case 'onCast':
          this.on('cast', (e) => {
            return { value: cb(e.data.value, e) }
          })
          break
        case 'onValue':
          this.on('value', (e) => {
            return { value: cb(e.data.value, e) }
          })
          break
        case 'onEmpty':
          this.on('empty', (e) => {
            return { value: cb(null, e) }
          })
          break
        case 'onValidate':
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

export function makeField<
  T extends any,
  O extends Record<string, any> = {},
  A extends [] = []
>(
  factory: (
    field: Field<T, O>
  ) => (base: SchemaILModel, key: string) => SchemaILModel
) {
  function fieldHelper(): Field<T, O>
  function fieldHelper(
    opts?: O & GenericFieldOptions & Partial<IFieldEvents<T>>
  ): Field<T, O>
  function fieldHelper(
    label: string,
    opts?: O & GenericFieldOptions & Partial<IFieldEvents<T>>
  ): Field<T, O>
  function fieldHelper(
    labelOpts?: string | O,
    opts?: O & GenericFieldOptions & Partial<IFieldEvents<T>>
  ): Field<T, O> {
    const label = typeof labelOpts === 'string' ? labelOpts : undefined
    const mergedOpts = (labelOpts !== 'string' ? labelOpts : opts) ?? {}
    const options = {
      label,
      ...mergedOpts,
    } as unknown as O
    const field = new Field<T, O>(options)
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
        label: capitalCase(key),
        type: 'string',
        ...prop,
      },
    },
  }
}

export interface GenericFieldOptions {
  /**
   * Describe the field
   */
  description?: string
  required?: boolean
  unique?: boolean
}

export interface IFieldEvents<T> {
  onCast: (value: Dirty<T>) => Writable<Nullable<T>>
  onEmpty: TPrimitive | (() => Writable<Nullable<T>>)
  onValue: (value: T) => Writable<T>
  onValidate: (value: T) => Waitable<void | Message[] | Message>
}

export type Dirty<T> = string | null | T
export type Nullable<T> = null | T
export type Waitable<T> = T | Promise<T>
export type Writable<T> = Waitable<T | Value<T>>

class Value<T> {
  constructor(
    public readonly value: T,
    public readonly meta: Record<any, any>
  ) {}
}

class Message {
  constructor(
    public readonly message: string,
    public readonly level: 'error' | 'warn' | 'info' = 'info'
  ) {}
}

// - grouping identifier
// - actions (callbacks
