import { addSpaceInfo } from './addSpaceInfo'
import { authenticate } from './authenticate'
import { ISpace, getErrorMessage } from '@flatfile/embedded-utils'

export const initializeSpace = async (flatfileOptions: ISpace) => {
  let space
  const {
    publishableKey,
    environmentId,
    name = 'Embedded Space',
    spaceBody,
    apiUrl,
    spaceUrl = 'https://spaces.flatfile.com/',
    workbook
  } = flatfileOptions

  try {
    if (!publishableKey) {
      throw new Error('Missing required publishable key')
    }

    if (!environmentId) {
      throw new Error('Missing required environment id')
    }

    const limitedAccessApi = authenticate(publishableKey, apiUrl)
    const spaceRequestBody = {
      name,
      autoConfigure: false,
      ...spaceBody,
    }

    if (!workbook) {
      spaceRequestBody.autoConfigure = true
    }
    try {
      space = await limitedAccessApi.spaces.create({
        environmentId,
        ...spaceRequestBody,
      })
    } catch (error) {
      throw new Error(`Failed to create space: ${getErrorMessage(error)}`)
    }

    if (!space) {
      throw new Error(
        `Failed to create space: Error parsing token: ${publishableKey}`
      )
    }
    if (!space.data.accessToken) {
      throw new Error('Failed to retrieve accessToken')
    }

    if (!space.data.guestLink) {
      const guestLink = `${spaceUrl}space/${space.data.id}?token=${space.data.accessToken}`
      space.data.guestLink = guestLink
    }

    const fullAccessApi = authenticate(space.data.accessToken, apiUrl)
    await addSpaceInfo(flatfileOptions, space.data.id, fullAccessApi)
    return space
  } catch (error) {
    const message = getErrorMessage(error)
    console.error(`Failed to initialize space: ${message}`)
    throw error
  }
}
