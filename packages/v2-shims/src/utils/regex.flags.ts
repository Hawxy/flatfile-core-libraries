import { IRegexFlags } from '../types/settings.interface'

const flagMap: { [key in keyof IRegexFlags]: string } = {
  dotAll: 's',
  ignoreCase: 'i',
  multiline: 'm',
  global: 'g',
  unicode: 'u'
}

export const getRegexFlags = (source?: IRegexFlags): string =>
  Object.keys(flagMap)
    .filter((flagKey) => source && source[flagKey as keyof IRegexFlags])
    .map((flagKey) => flagMap[flagKey as keyof IRegexFlags])
    .join('')



/**
 * Compare any value against a regex string
 *
 * @param regexString
 * @param value
 * @param flags
 * @param fallback
 */
export function testRegex(
  regexString: string,
  flags: string,
  // tslint:disable-next-line:no-any
  value: any,
  fallback: boolean = true
): boolean {
  const regex = new RegExp(regexString, flags)
  if (typeof value === 'string') {
    return regex.test(value)
  } else {
    return fallback
  }
}


export const falsyRegex = /^(0|n|no|false|off|disabled|falsch|nein)$/i
export const truthyRegex = /^(1|y|yes|true|on|enabled|wahr|ja)$/i
