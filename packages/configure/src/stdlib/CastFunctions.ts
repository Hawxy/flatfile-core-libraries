import { isValid, toDate } from 'date-fns'
let num: number

export const NumberCast = (
  raw: string | undefined | null | number
): number | null => {
  if (typeof raw === 'undefined') {
    return null
  } else if (raw === null) {
    return null
  } else {
    if (typeof raw === 'number') {
      num = raw
    } else if (typeof raw === 'string') {
      if (raw === '') {
        return null
      }
      // I think I just want the error to propagate here, so no wrapping
      const strippedStr = raw.replace(',', '')
      num = Number(strippedStr)
    }
    if (isFinite(num)) {
      return num
    } else {
      throw new Error(`'${raw}' parsed to '${num}' which is non-finite`)
    }
  }
}

// Some other truthy/falsy values I found lurking around in Mono:
// Mono/core/portal/src/utils/truthy.regex.ts
// export const falsyRegex = /^(0|n|no|false|off|disabled|falsch|nein)$/i
// export const truthyRegex = /^(1|y|yes|true|on|enabled|wahr|ja)$/i

// Mono/core/api/src/modules/DataAbstractionModule/Transformations/AJVValidationTransformation.ts
// Probably best not to inlcude other languages until we actually think through internationaliation
const TRUTHY_VALUES = ['1', 'yes', 'true', 'on', 't', 'y']
const FALSY_VALUES = ['-1', '0', 'no', 'false', 'off', 'f', 'n']

export const BooleanCast = (
  raw: string | undefined | null | boolean
): boolean | null => {
  if (typeof raw === 'undefined') {
    return null
  } else if (raw === null) {
    return null
  } else {
    if (typeof raw === 'boolean') {
      return raw
    } else if (typeof raw === 'string') {
      if (raw === '') {
        return null
      }
      const normString = raw.toLowerCase()
      if (TRUTHY_VALUES.includes(normString)) {
        return true
      }
      if (FALSY_VALUES.includes(normString)) {
        return false
      }
      throw new Error(`'${raw}' can't be converted to boolean`)
    }
    return null
  }
}

export const StringCast = (raw: string | undefined | null): string | null => {
  if (typeof raw === 'undefined') {
    return null
  } else if (raw === null) {
    return null
  } else {
    if (typeof raw === 'string') {
      if (raw === '') {
        return null
      }
    }
    return raw
  }
}

export const DateCast = (
  raw: string | undefined | null | number | Date
): Date | null => {
  if (typeof raw === 'undefined') {
    return null
  } else if (raw === null) {
    return null
  } else if (raw instanceof Date) {
    return raw
  } else if (typeof raw === 'number') {
    const numParsed = toDate(raw)
    if (isValid(numParsed)) {
      return numParsed
    } else {
      throw new Error(`${raw} parsed to '${numParsed}' which is invalid`)
    }
  } else if (typeof raw === 'string') {
    if (raw === '') {
      return null
    }
    const parsedDate = new Date(raw)
    if (isValid(parsedDate)) {
      return parsedDate
    } else {
      throw new Error(`'${raw}' parsed to '${parsedDate}' which is invalid`)
    }
  }
  return null
}
