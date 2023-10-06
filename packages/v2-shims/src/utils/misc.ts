/**
 * Get the average of numbers in any array
 * @param arr
 */
import { IPrimitive, Nullable } from '../types/general.interface'

export function isEmpty(value: Nullable<IPrimitive>): boolean {
  return value === '' || value === undefined || value === null
}
