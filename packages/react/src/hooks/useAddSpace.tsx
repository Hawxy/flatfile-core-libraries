import { Action } from '@flatfile/api'
import { useHttpClient } from './useHttpClient'

/**
 * @name useAddSpace
 * @param accessToken - accessToken to be passed to api
 * @returns addSpace function to be used inside useInitializeSpace hook
 * @description adds space and metadata to environment
 *
 */

export const useAddSpace = ({ accessToken }: { accessToken: string }) => {
  const { httpClient } = useHttpClient({ accessToken })

  const createSpace = async ({
    environmentId,
    spaceConfigId,
    metadata,
    actions,
    name
  }: {
    environmentId: string
    spaceConfigId: string
    metadata: {}
    actions?: Action[]
    name?: string
  }) => {
    const space = await httpClient.addSpace({
      spaceConfig: {
        spaceConfigId,
        environmentId,
        metadata,
        actions,
        name,
      },
    })
    return { space }
  }
  return { createSpace }
}
