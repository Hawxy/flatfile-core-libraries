import { StringCastCompose } from './CastFunctions'
import { map, filter } from 'remeda'
import { TPrimitive } from '@flatfile/hooks'

export const SubstitutionCast = (
  matchingLists: TPrimitive[][],
  outputColNum: number,
  errorFunc: (wrongVal: string) => string
) => {
  const retFunc = StringCastCompose((val: string) => {
    const candidates = filter(matchingLists, (row: TPrimitive[]) =>
      row.includes(val)
    )
    if (candidates.length == 0) {
      throw new Error(errorFunc(val))
    }
    if (candidates.length == 1) {
      return candidates[0][outputColNum]
    }
  })
  return retFunc
}

export const StringSubstitutionCast = (
  matchingLists: string[][],
  outputColNum: number,
  errorFunc: (wrongVal: string) => string
) => {
  const retFunc = StringCastCompose((val: string) => {
    const candidates = filter(matchingLists, (row) =>
      map(row, (x) => x.toLowerCase()).includes(val.toLowerCase())
    )
    if (candidates.length == 0) {
      throw new Error(errorFunc(val))
    }
    if (candidates.length == 1) {
      return candidates[0][outputColNum]
    }
  })
  return retFunc
}
