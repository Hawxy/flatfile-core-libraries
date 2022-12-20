import _ from 'lodash'
import {
  COUNTRY_CODES,
  US_STATES,
  US_STATES_AND_TERRITORIES,
} from './constants'
import { SynonymCast } from './SynonymCast'

type Format = 'full' | 'iso-2' | 'iso-3'
export const CountryCast = (toFormat: Format) => {
  const colNums: Record<Format, number> = { full: 0, 'iso-2': 1, 'iso-3': 2 }

  const configured = _.map(
    COUNTRY_CODES,
    (codeRow: string[]): [string, string[]] => {
      const toVal = codeRow[colNums[toFormat]]
      return [toVal, codeRow]
    }
  )
  return SynonymCast(
    configured,
    (val: string) => `Couldn't convert '${val}' to a country`
  )
}

export const StateCast = (toFormat: 'full' | 'two-letter') => {
  const colNums = { full: 0, 'two-letter': 1 }
  const configured = _.map(
    US_STATES,
    (codeRow: string[]): [string, string[]] => {
      const toVal = codeRow[colNums[toFormat]]
      return [toVal, codeRow]
    }
  )
  return SynonymCast(
    configured,
    (val: string) => `Couldn't convert '${val}' to a state`
  )
}

export const StateAndTerritoryCast = (toFormat: 'full' | 'two-letter') => {
  const colNums = { full: 0, 'two-letter': 1 }
  const configured = _.map(
    US_STATES_AND_TERRITORIES,
    (codeRow: string[]): [string, string[]] => {
      const toVal = codeRow[colNums[toFormat]]
      return [toVal, codeRow]
    }
  )
  return SynonymCast(
    configured,
    (val: string) => `Couldn't convert '${val}' to a state`
  )
}
