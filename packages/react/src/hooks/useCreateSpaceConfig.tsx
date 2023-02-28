import { useHttpClient } from './useHttpClient'
import { SpacePatternConfig } from '@flatfile/api'

/**
 * @name useCreateSpaceConfig
 * @param accessToken - accessToken to be passed to api
 * @returns createConfig function to be used inside useInitializeSpace hook
 * @description Creates space config
 *
 */

export const useCreateSpaceConfig = ({
  accessToken,
}: {
  accessToken: string
}) => {
  const { httpClient } = useHttpClient({ accessToken })

  const createConfig = async ({
    spaceConfig,
  }: {
    spaceConfig: SpacePatternConfig
  }) => {
    const config = httpClient.addSpaceConfig({
      spacePatternConfig: { ...spaceConfig },
    })
    return config
  }
  return { createConfig }
}
