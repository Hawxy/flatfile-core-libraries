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
  }: {
    environmentId: string
    spaceConfigId: string
    metadata: {}
  }) => {
    const space = await httpClient.addSpace({
      spaceConfig: {
        spaceConfigId,
        environmentId,
        metadata,
        name: 'Embedded space',
      },
    })
    return { space }
  }
  return { createSpace }
}
