import { ISpace } from '../types/ISpace'
import { authenticate } from './authenticate'
import { getErrorMessage } from './getErrorMessage'

export const getSpace = async (spaceProps: ISpace) => {
  const { space, apiUrl, environmentId } = spaceProps
  let spaceResponse
  try {
    if (!space?.id) {
      throw new Error('Missing required ID for Space')
    }
    if (!space?.accessToken) {
      throw new Error('Missing required accessToken for Space')
    }

    if (!environmentId) {
      throw new Error('Missing required environment id')
    }

    const limitedAccessApi = authenticate(space?.accessToken, apiUrl)
    try {
      spaceResponse = await limitedAccessApi.spaces.get(space?.id)
    } catch (error) {
      throw new Error(`Failed to get space: ${getErrorMessage(error)}`)
    }

    if (!spaceResponse.data.accessToken) {
      throw new Error('Failed to retrieve accessToken')
    }

    return spaceResponse
  } catch (error) {
    const message = getErrorMessage(error)
    console.error(`Failed to initialize space: ${message}`)
    throw error
  }
}
