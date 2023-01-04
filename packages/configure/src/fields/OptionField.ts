import { keys, mapValues } from 'remeda'
import { Field } from '../ddl/Field'
import { makeField, mergeFieldOptions } from '../ddl/MakeField'
import { isFullyPresent } from '../utils/isFullyPresent'
import { TextField } from './TextField'

type LabelObject = { label: string }
// OptionField
type LabelOptions = string | LabelObject

export const OptionField = makeField<
  string,
  {
    matchStrategy?: 'fuzzy' | 'exact'
    options: Record<string, LabelOptions>
  }
>(TextField(), { type: 'enum' }, (mergedOptions, _newOptions) => {
  const def_ = mergedOptions.default

  if (def_ !== null) {
    //type guard to make typescript happy
    if (isFullyPresent(def_) && mergedOptions.options[def_] === undefined) {
      throw new Error(
        `Invalid default of ${def_}, value doesn't appear as one of the keys in ${keys(
          mergedOptions.options
        )}`
      )
    }
  }
  const labelEnum = mapValues(mergedOptions.options, (value: LabelOptions) => {
    if (typeof value === 'string') {
      return value
    } else {
      return value.label
    }
  })

  const consolidatedOptions = mergeFieldOptions(mergedOptions, {
    //type: 'enum',
    labelEnum,
    matchStrategy: mergedOptions.matchStrategy || 'fuzzy',
  })
  return new Field(consolidatedOptions)
})
