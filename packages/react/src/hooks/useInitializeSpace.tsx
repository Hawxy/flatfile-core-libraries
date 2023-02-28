import { useCallback } from 'react'
import { ISpaceConfig } from '../types/ISpaceConfig'
import { useAddSpace } from './useAddSpace'
import { useCreateSpaceConfig } from './useCreateSpaceConfig'
import { useUpdateSpace } from './useUpdateSpace'

export const useInitializeSpace = (props: ISpaceConfig) => {
  const {
    accessToken,
    spaceConfig,
    themeConfig,
    environmentId,
    spaceId,
    sidebarConfig,
  } = props
  const { createConfig } = useCreateSpaceConfig({ accessToken })
  const { createSpace } = useAddSpace({ accessToken })
  const { updateSpace } = useUpdateSpace({ accessToken })

  const handleInit = useCallback(async () => {
    let spaceConfigId
    let space

    if (!spaceId && spaceConfig) {
      // create config and space
      try {
        const config = await createConfig({ spaceConfig })
        spaceConfigId = config?.data?.id
      } catch (error: any) {
        throw new Error(`Error creating space config: ${error}`)
      }

      if (spaceConfigId) {
        try {
          const newSpace = await createSpace({
            spaceConfigId,
            metadata: { theme: themeConfig, sidebarConfig },
            environmentId,
          })
          space = newSpace
        } catch (error) {
          throw new Error(`Error creating space: ${error}`)
        }
      }
    }

    if (spaceId && spaceConfig) {
      // update config on existing space
      try {
        const config = await createConfig({ spaceConfig })
        spaceConfigId = config?.data?.id
      } catch (error: any) {
        throw new Error(`Error creating space config: ${error}`)
      }

      try {
        const updatedSpace = await updateSpace({
          spaceId,
          spaceConfigId,
          environmentId,
          metadata: {
            theme: themeConfig,
            sidebarConfig,
          },
        })
        space = updatedSpace
      } catch (error: any) {
        throw new Error(`Error updating space: ${error}`)
      }
    }

    if (spaceId && !spaceConfig) {
      // update metadata on existing space
      try {
        const updatedSpace = await updateSpace({
          spaceId,
          environmentId,
          metadata: {
            theme: themeConfig,
            sidebarConfig,
          },
        })
        space = updatedSpace
      } catch (error: any) {
        throw new Error(`Error updating space: ${error}`)
      }
    }
    return space?.space?.data?.guestLink
  }, [accessToken])
  return { handleInit }
}
