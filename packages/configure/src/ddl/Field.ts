import { HookContract, HookProvider, Tuple } from '../lib/HookProvider'
import { capitalCase } from 'case-anything'
import { SchemaILModel, SchemaILField } from '@flatfile/schema'
import { TPrimitive } from '@flatfile/orm'
import { forEachObj } from 'remeda'
import { FlatfileEvent } from '../lib/FlatfileEvent'

export class Field<
  T extends any,
  O extends Record<string, any>
> extends HookProvider<FieldEventRegistry<T>> {
  public constructor(
    public options: O & GenericFieldOptions & Partial<IFieldEvents<T>> = {} as O
  ) {
    super()
    this.attachListenersFromOptions()
  }

  public registerSerializer(
    cb: (base: SchemaILModel, key: string) => SchemaILModel
  ) {
    this.configFactory = cb
  }

  public async routeEvents(e: FlatfileEvent<any>) {
    // run all cast in series, abandon if promise rejection or exception, get final value, apply to record
    // run all empty in series, abandon if promise rejection or exception, get final value, apply to record
    // run all value in series, abandon if promise rejection or exception, get final value, apply to record
    // run all validate in series, abandon if promise rejection or exception, get final value, apply to record
    const castedValue = await this.pipeHookListeners('cast', e)
  }

  public toSchemaIL(baseSchema: SchemaILModel, key: string): SchemaILModel {
    return this.configFactory(baseSchema, key)
  }

  private attachListenersFromOptions() {
    forEachObj.indexed(this.options, (key: string, cb: any) => {
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
  function fieldHelper(opts?: O & GenericFieldOptions): Field<T, O>
  function fieldHelper(
    label: string,
    opts?: O & GenericFieldOptions
  ): Field<T, O>
  function fieldHelper(
    labelOpts?: string | O,
    opts?: O & GenericFieldOptions
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

const foo: Partial<IFieldEvents<number>> = {
  onValidate: (v) => {
    if (v > 1) {
      throw 'Stop being an idiot'
    } else {
      return new Message('Hey david, good going')
    }
  },
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
