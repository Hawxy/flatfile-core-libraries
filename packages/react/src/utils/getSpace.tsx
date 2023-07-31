import { ISpace } from '../types/ISpace'
import { getErrorMessage } from './getErrorMessage'
import { authenticate } from './authenticate'

export const getSpace = async (spaceProps: ISpace) => {
  const { space } = spaceProps
  let spaceResponse
  try {
    if (!space?.id) {
      throw new Error('Missing required ID for Space')
    }
    if (!space?.accessToken) {
      throw new Error('Missing required accessToken for Space')
    }

    const limitedAccessApi = authenticate(space?.accessToken)
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
