import { ISpace } from '../types/ISpace'
import { getErrorMessage } from './getErrorMessage'
import { addSpaceInfo } from './addSpaceInfo'
import { authenticate } from './authenticate'

export const initializeSpace = async (spaceProps: ISpace) => {
  let space
  const { publishableKey, environmentId, name } = spaceProps

  try {
    if (!publishableKey) {
      throw new Error('Missing required publishable key')
    }

    if (!environmentId) {
      throw new Error('Missing required environment id')
    }

    const limitedAccessApi = authenticate(publishableKey)
    try {
      space = await limitedAccessApi.spaces.create({
        environmentId,
        name
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

    const fullAccessApi = authenticate(space.data.accessToken)
    await addSpaceInfo(spaceProps, space.data.id, fullAccessApi)
    return space
  } catch (error) {
    const message = getErrorMessage(error)
    console.error(`Failed to initialize space: ${message}`)
    throw error
  }
}
