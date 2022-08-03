//import { UserInputError } from 'apollo-server-errors'
import * as EmailValidator from 'email-validator'
import parsePhoneNumber from 'libphonenumber-js'

const FLATFILE_ALLOWED_EMAIL_DOMAINS: string = ''

/**
 * Validate an email address and throw a GraphQL error if it's not valid.
 *
 * @param email
 * @param field
 * @throws UserInputError
 */
export function validateEmailOrFail(email: string, field = 'email'): string {
  if (!EmailValidator.validate(email)) {
    throw new Error(`'${email}' is not a valid email address`) // , {invalidArgs: [field],})
  }
  if (FLATFILE_ALLOWED_EMAIL_DOMAINS !== '') {
    const [, domain] = email.split('@')
    if (FLATFILE_ALLOWED_EMAIL_DOMAINS.split(',').indexOf(domain) === -1) {
      throw new Error(`Domain '${domain}' is not allowed`) // , {invalidArgs: [field],})
    }
  }
  return email
}

/**
 * Check if field's value has any emojis and throw a GraphQL error if it does
 *
 * @param value
 * @param field
 * @throws UserInputError
 */
export const validateEmojisOrFail = (value: string, field: string) => {
  if (
    /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/gi.test(
      value
    )
  ) {
    throw new Error(`The value '${value}' is invalid`) // , {invalidArgs: [field],})
  }
}

/**
 * Check if phone number is valid (US + international)
 *
 * @param phone
 */
export const validatePhoneNumber = (phone: string): any => {
  // remove all non-digit characters from string except leading '+'
  const strippedPhoneNumber = phone.replace(/\D/g, (char, pos) =>
    char === '+' && pos === 0 ? char : ''
  )
  // check for phoneNum length w/o formatting characters
  const phoneNumLength = strippedPhoneNumber.length
  const isFormattedInternational = strippedPhoneNumber.startsWith('+')
  const numToValidate = isFormattedInternational
    ? strippedPhoneNumber.slice(1)
    : strippedPhoneNumber
  let phoneNumber

  if (
    (phoneNumLength === 11 && isFormattedInternational) ||
    phoneNumLength === 10
  ) {
    // assume US phone number
    phoneNumber = parsePhoneNumber(numToValidate, 'US')
  } else {
    // assume international number
    phoneNumber = parsePhoneNumber(strippedPhoneNumber)
  }
  return phoneNumber?.isValid()
}

/**
 *
 * Checks if this is a valid UUID
 *
 * @param uuid uuid string
 */
export const isUUID = (uuid: string) =>
  /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i.test(uuid)
