import {
  COUNTRY_CODES,
  US_STATES,
  US_STATES_AND_TERRITORIES,
} from './constants'
import { StringSubstitutionCast } from './SubstitutionCast'

type Format = 'full' | 'iso-2' | 'iso-3'
export const CountryCast = (toFormat: Format) => {
  const colNums: Record<Format, number> = { full: 0, 'iso-2': 1, 'iso-3': 2 }
  return StringSubstitutionCast(
    COUNTRY_CODES,
    colNums[toFormat],
    (val) => `Couldn't convert '${val}' to a country`
  )
}

export const StateCast = (toFormat: 'full' | 'two-letter') => {
  const colNums = { full: 0, 'two-letter': 1 }
  return StringSubstitutionCast(
    US_STATES,
    colNums[toFormat],
    (val) => `Couldn't convert '${val}' to a state`
  )
}

export const StateAndTerritoryCast = (toFormat: 'full' | 'two-letter') => {
  const colNums = { full: 0, 'two-letter': 1 }
  return StringSubstitutionCast(
    US_STATES_AND_TERRITORIES,
    colNums[toFormat],
    (val) => `Couldn't convert '${val}' to a state`
  )
}
