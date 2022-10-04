import { FlatfileRecord, TPrimitive } from '@flatfile/hooks'
import { isFullyPresent } from '../utils/isFullyPresent'
import { Field } from './Field'
export type computeType = (limitedObj: Record<string, TPrimitive>) => unknown

interface ComputedFieldArgs {
  dependsOn: string[]
  // limiteObj will be limited to the fields in string
  // return type the same as the type of the field
  possiblyDependsOn?: string[]
  compute: computeType
  destination: string
}

const recordComputeForComputedField = (
  destinationField: Field<any, any>,
  computeArgs: ComputedFieldArgs
) => {
  const retFunc = (record: FlatfileRecord) => {
    const destinationKey = computeArgs.destination
    const recordObj: Record<string, TPrimitive> = {}
    let anyMissing = false
    if (computeArgs.possiblyDependsOn === undefined) {
      computeArgs.possiblyDependsOn = []
    }
    computeArgs.dependsOn.map((fieldName) => {
      const val = record.get(fieldName)
      if (!isFullyPresent(val)) {
        anyMissing = true
        record.pushInfoMessage(
          destinationKey,
          `required arg of ${fieldName} has value of '${val}' which isn't fully present for computed Field ${computeArgs.destination}`,
          'error',
          'other'
        )
      }
      recordObj[fieldName] = val
    })

    computeArgs.possiblyDependsOn.map((fieldName) => {
      const val = record.get(fieldName)

      if (val === undefined) {
        anyMissing = true
        record.pushInfoMessage(
          destinationKey,
          `possbilyDepends arg of ${fieldName} has value of undefined which can only be the result of an earlier error on the field. halting computed field computation. for computed Field ${computeArgs.destination}`,
          'error',
          'other'
        )
      }
      recordObj[fieldName] = val
    })

    if (anyMissing) {
      // make sure we don't call the computeFunction when the dependsOn requirements aren't met
      return
    }
    try {
      const inputVal = computeArgs.compute(recordObj)
      try {
        const [newVal, messages] = destinationField.computeToValue(inputVal)
        if (newVal !== undefined) {
          record.set(destinationKey, newVal)
        }
        if (messages !== null) {
          messages.map((m) =>
            record.pushInfoMessage(destinationKey, m.message, m.level, m.stage)
          )
        }
      } catch (e: any) {
        // we should never get to this code block, if we do, it is an error in the implmentation of this function
        console.log('catch for computedField internals')
        // not sure if this should be stage: `computedField` instead of `other`
        record.pushInfoMessage(destinationKey, e.toString(), 'error', 'other')
        return
      }
    } catch (e: any) {
      // catch for errors occurring in the computedField compute function
      // we will end up in this code block when a user defined a compute function improperly
      // not sure if this should be stage: `computedField` instead of `other`
      record.pushInfoMessage(destinationKey, e.toString(), 'error', 'other')
      return
    }
  }
  return retFunc
}

export const ComputedField = (
  destinationField: Field<any, any>,
  computeArgs: ComputedFieldArgs
) => {
  //todo: write toSchemaIL for ComputedField
  if (destinationField.options.required) {
    //this will be thrown at sheet config evaluation time
    throw new Error(
      `required can't be set on a computed field, fix ${computeArgs.destination}`
    )
  }
  destinationField.options.contributeToRecordCompute =
    recordComputeForComputedField(destinationField, computeArgs)
  return destinationField
}
