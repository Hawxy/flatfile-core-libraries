import { pick, mapValues, keys } from 'remeda'
import { BaseFieldTypes, SchemaILField } from '@flatfile/schema'
import { isFullyPresent } from '../utils/isFullyPresent'
import _ from 'lodash'

import {
  DateCast,
  BooleanCast,
  NumberCast,
  StringCast,
} from '../stdlib/CastFunctions'
import { Sheet, FieldConfig } from './Sheet'

export type TRecordStageLevel =
  | 'cast'
  | 'required'
  | 'compute'
  //  | 'computedField'  // not sure about this
  | 'validate'
  | 'apply'
  | 'other'

type TRecordLevel = 'error' | 'warn' | 'info'

class Value<T> {
  constructor(
    public readonly value: T,
    public readonly meta: Record<any, any>
  ) {}
}

export type Dirty<T> = string | null | T
export type Nullable<T> = null | T
export type Waitable<T> = T
export type Writable<T> = Waitable<T | Value<T>>

export class Message {
  constructor(
    public readonly message: string,
    public readonly level: TRecordLevel = 'info',
    public readonly stage: TRecordStageLevel
  ) {}
}

export interface IFieldHooks<T> {
  cast: (value: Dirty<T>) => Nullable<T>
  default: Nullable<T>
  compute: (value: T) => T
  validate: (value: T) => void | Message[] // eventually add single message
  egressFormat: ((value: T) => string) | false
}

export type AnyField = Field<any, any>

export const FieldHookDefaults = <T>(): IFieldHooks<T> => ({
  cast: (value: Dirty<T>) => {
    if (value != null) {
      return value as T
    }
    return null
  },
  default: null,
  compute: (value: T) => value,
  validate: () => [],
  egressFormat: false,
})

export interface GenericFieldOptions {
  description: string
  type: BaseFieldTypes
  label: string
  primary: boolean
  required: boolean
  unique: boolean
  annotations?: {
    //cast?: boolean
    default?: boolean
    defaultMessage?: string
    compute?: boolean
    computeMessage: string
  }

  stageVisibility?: {
    mapping?: boolean
    review?: boolean
    export?: boolean
  }
  getSheetCompute: any
}

const GenericDefaults: GenericFieldOptions = {
  description: '',
  label: '',
  type: 'string',
  primary: false,
  required: false,
  unique: false,
  stageVisibility: {
    mapping: true,
    review: true,
    export: true,
  },
  annotations: {
    default: false,
    defaultMessage: 'This field was automatically given a default value of',
    compute: false,
    computeMessage: 'This value was automatically reformatted - original data:',
  },
  getSheetCompute: false,
}

export type BaseFieldOptions<T> = Partial<SchemaILField> &
  Partial<IFieldHooks<T>>

export type FullBaseFieldOptions<T, O> = SchemaILField & IFieldHooks<T> & O

export const verifyEgressCycle = <T>(
  field: Field<T, any>,
  castVal: T
): boolean => {
  //cast / egressFormat cycle must converge to the same value,
  //otherwise throw an error because the user will lose dta
  const egressResult = field.options.egressFormat(castVal)
  const recastResult = field.toCastDefault(egressResult)
  const recast = recastResult[0]

  // We want to be very explicit about date comparison since it is so important
  if (_.isDate(castVal) && _.isDate(recast)) {
    const [castDate, recastDate] = [castVal as Date, recast as Date]
    if (_.isEqual(castDate, recastDate)) {
      //explicitly returning true so we get to the console.log with better debugging info
      return true
    }
  }
  if (_.isEqual(castVal, recast)) {
    return true
  }

  return castVal === recast
}

export class Field<T, O extends Record<string, any>> {
  public constructor(
    public options: FullBaseFieldOptions<T, O> = {} as FullBaseFieldOptions<
      T,
      O
    >
  ) {}

  public addCustomOptionsToField(
    cb: (options: FullBaseFieldOptions<T, O>) => void
  ) {
    cb(this.options)
  }

  // leaving this as a public field and not adding it to the default
  // constructor because this is a very advanced field feature to use,
  // it can be set on an instantiated field

  public extraFieldsToAdd: Record<string, AnyField> = {}

  public toCastDefault(rawValue: any): [Nullable<T>, Message[]] {
    // run field execution until a value or null is provided, run with proper error and type handling
    const extraMessages: Message[] = []
    const possiblyCast = this.options.cast(rawValue)
    if (typeof possiblyCast === 'undefined') {
      throw new Error(
        `casting ${rawValue} returned undefined.  This is an error, fix 'cast' function`
      )
    }
    let actuallyCast: Nullable<T>
    if (!isFullyPresent(possiblyCast) && isFullyPresent(this.options.default)) {
      if (this.options.annotations.default) {
        extraMessages.push(
          new Message(
            `${this.options.annotations.defaultMessage} '${this.options.default}'`,
            'info',
            'other'
          )
        )
      }
      actuallyCast = this.options.default
    } else {
      actuallyCast = possiblyCast
    }
    return [actuallyCast, extraMessages]
  }

  public computeFromValue(
    reallyActuallyCast: T,
    rawValue: any
  ): [Nullable<T>, Message[]] {
    // start with an actual value of correct type, call compute with proper error handling, pull off computed value and messages
    let egressFail: boolean = false
    try {
      egressFail =
        this.options.egressFormat &&
        !verifyEgressCycle(this, reallyActuallyCast)
    } catch (e: any) {
      throw new Error(
        `field threw an error at egressFormat with a value of ${reallyActuallyCast} of type ${typeof reallyActuallyCast}`
      )
    }
    if (this.options.egressFormat && egressFail) {
      const egressVal = this.options.egressFormat(reallyActuallyCast)
      throw new Error(
        `field couldn't reify to same value after egressFormat. Value ${reallyActuallyCast} of type ${typeof reallyActuallyCast} was egressFormatted to to string of '${egressVal}' which couldn't be cast back to ${reallyActuallyCast}. Persisting this would result in data loss. The original value ${rawValue} was not changed.`
      )
    }
    const compMessages: Message[] = []
    const computed: T = this.options.compute(reallyActuallyCast)
    if (typeof computed === 'undefined') {
      throw new Error(
        `Calling compute of ${rawValue} with typed value of ${reallyActuallyCast} returned undefined.  This is an error, fix 'compute' function`
      )
    }
    if (reallyActuallyCast !== computed && this.options.annotations.compute) {
      compMessages.push(
        new Message(
          `${this.options.annotations.computeMessage} '${reallyActuallyCast}'`,
          'info',
          'other'
        )
      )
    }
    return [computed, compMessages]
  }

  public computeToValue(rawValue: any): [Nullable<T>, Message[]] {
    //execute the `toCastDefault` and `computeFromValue` functions with proper execption handling
    try {
      const [actuallyCast, extraMessages] = this.toCastDefault(rawValue)
      if (isFullyPresent(actuallyCast)) {
        try {
          const reallyActuallyCast: T = actuallyCast as T
          const [computed, compMessages] = this.computeFromValue(
            reallyActuallyCast,
            rawValue
          )
          return [computed, _.concat(extraMessages, compMessages)]
        } catch (e: any) {
          return [
            rawValue,
            _.concat(
              extraMessages,
              new Message(e.toString(), 'error', 'compute')
            ),
          ]
        }
      } else {
        if (this.options.required) {
          return [null, extraMessages]
        }
        return [null, []]
      }
    } catch (e: any) {
      return [rawValue, [new Message(e.toString(), 'error', 'cast')]]
    }
  }

  public validate(val: T) {
    try {
      return this.options.validate(val)
    } catch (e: any) {
      return [new Message(e.toString(), 'error', 'validate')]
    }
  }

  public toSchemaILField(fieldName: string): SchemaILField {
    return {
      field: fieldName,
      label: this.options.label || fieldName,
      ...pick(this.options, [
        'type',
        'description',
        'required',
        'primary',
        'unique',
        'matchStrategy',
        'upsert',
        'labelEnum',
        'sheetName',
        'stageVisibility',
        'annotations', // this shouldn't be here
      ]),
    }
  }

  public contributeToSchemaILFBase() {
    //add whatever pieces this field needs to add to the base sheet
    //definition, possible additonal processing at the Sheet level
  }

  public setProp(prop: Partial<FullBaseFieldOptions<T, O>>) {
    this.options = {
      ...this.options,
      ...prop,
    }
    return this
  }
}

type PartialBaseFieldsAndOptions<T, O> = Partial<FullBaseFieldOptions<T, O>>
type FieldOverload<T, O extends Record<string, any>> = {
  (): Field<T, O>
  (label?: string): Field<T, O>
  (options?: PartialBaseFieldsAndOptions<T, O>): Field<T, O>
}

function makeField<T extends any, O extends Record<string, any> = {}>(
  fieldFactory: (
    field: Field<T, O>,
    options: FullBaseFieldOptions<T, O>
  ) => (options: FullBaseFieldOptions<T, O>) => Field<T, O>
) {
  const fieldMaker: FieldOverload<T, O> = (
    options?: string | PartialBaseFieldsAndOptions<T, O>
    // options?: PartialBaseFieldsAndOptions<T, O>
  ): Field<T, O> => {
    // if labelOptions is a string, then it is the label
    const label = typeof options === 'string' ? options : undefined
    // if options is an object, then it is the options
    const passedOptions =
      (typeof options !== 'string' ? options : options) ?? {}

    const passedStageVisibility = (passedOptions as SchemaILField)
      ?.stageVisibility

    const stageVisibility = {
      ...GenericDefaults.stageVisibility,
      ...passedStageVisibility,
    }

    const passedAnnotations = (passedOptions as SchemaILField)?.annotations

    const annotations = {
      ...GenericDefaults.annotations,
      ...passedAnnotations,
    }

    const fullOpts = {
      ...GenericDefaults,
      ...FieldHookDefaults<T>(),
      ...(label ? { label } : { ...passedOptions }),
      stageVisibility,
      annotations,
    }

    const field = new Field<T, O>(fullOpts as FullBaseFieldOptions<T, O>)
    const fieldOptions = fieldFactory(
      field,
      passedOptions as FullBaseFieldOptions<T, O>
    )

    field.addCustomOptionsToField(fieldOptions)
    return field
  }

  return fieldMaker
}

// TextField
export const TextField = makeField<string>((field, passedOptions) => {
  return () => {
    const cast = passedOptions.cast ?? StringCast
    return field.setProp({ type: 'string', cast })
  }
})

// BooleanField
export const BooleanField = makeField<boolean, { superBoolean?: boolean }>(
  (field, passedOptions) => {
    return () => {
      const cast = passedOptions.cast ?? BooleanCast
      return field.setProp({ type: 'boolean', cast })
    }
  }
)

// NumberField
export const NumberField = makeField<number>((field, passedOptions) => {
  return () => {
    const cast = passedOptions.cast ?? NumberCast
    return field.setProp({ type: 'number', cast })
  }
})

// NumberField
export const DateField = makeField<Date>((field, passedOptions) => {
  return () => {
    const cast = passedOptions.cast ?? DateCast
    return field.setProp({ type: 'string', cast })
  }
})

// OptionField
type LabelOptions = string | { label: string }

export const OptionField = makeField<
  string,
  {
    matchStrategy?: 'fuzzy' | 'exact'
    options: Record<string, LabelOptions>
  }
>((field) => {
  const def_ = field.options.default

  if (def_ !== null) {
    //type guard to make typescript happy
    if (isFullyPresent(def_) && field.options.options[def_] === undefined) {
      throw new Error(
        `Invalid default of ${def_}, value doesn't appear as one of the keys in ${keys(
          field.options.options
        )}`
      )
    }
  }
  const labelEnum = mapValues(field.options.options, (value) => {
    const label = typeof value === 'string' ? value : value.label
    return label
  })

  return () => {
    field.setProp({ type: 'enum', labelEnum })
    field.setProp({
      matchStrategy: field.options.matchStrategy || 'fuzzy',
    })
    return field
  }
})

// LinkedField
export const LinkedField = makeField<
  string,
  { sheet: Sheet<FieldConfig>; upsert?: boolean }
>((field) => {
  const { sheet } = field.options
  if (sheet === undefined) {
    throw new Error('sheet is a required option of LinkedField')
  }

  const sheetName = sheet.name
  let upsert = true
  if (field.options.upsert === false) {
    upsert = false
  } else if (field.options.upsert === true) {
    upsert = true
  } else if (field.options.upsert === undefined) {
    upsert = true
  }

  return () => {
    field.setProp({ type: 'schema_ref', sheetName, upsert })
    //field.setProp({ upsert })
    return field
  }
})
