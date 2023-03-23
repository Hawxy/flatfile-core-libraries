import { useHttpClient } from './useHttpClient'
import { Action } from '@flatfile/api'

/**
 * @name useUpdateSpace
 * @param accessToken - accessToken to be passed to api
 * @returns updateSpace function to be used inside useInitializeSpace hook
 * @description Updates space
 *
 */

export const useUpdateSpace = ({ accessToken }: { accessToken: string }) => {
  const { httpClient } = useHttpClient({ accessToken })

  const updateSpace = async ({
    spaceId,
    spaceConfigId,
    environmentId,
    metadata,
    actions,
    name
  }: {
    spaceId: string
    spaceConfigId?: string
    environmentId: string
    metadata?: {}
    actions?: Action[]
    name?: string 
  }) => {
    const space = await httpClient.updateSpaceById({
      spaceId,
      spaceConfig: {
        // @ts-ignore
        spaceConfigId,
        environmentId,
        metadata,
        actions,
        name
      },
    })

    return { space }
  }
  return { updateSpace }
}
