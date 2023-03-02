import { useCallback } from 'react'
import { ISpaceConfig } from '../types/ISpaceConfig'
import { useAddSpace } from './useAddSpace'
import { useCreateSpaceConfig } from './useCreateSpaceConfig'
import { useUpdateSpace } from './useUpdateSpace'
import { useAddDocumentToSpace } from './useAddDocumentToSpace'

export const useInitializeSpace = (props: ISpaceConfig) => {
  const {
    accessToken,
    spaceConfig,
    themeConfig,
    environmentId,
    spaceId,
    spaceConfigId,
    sidebarConfig,
    document,
    actions,
  } = props
  const { createConfig } = useCreateSpaceConfig({ accessToken })
  const { createSpace } = useAddSpace({ accessToken })
  const { updateSpace } = useUpdateSpace({ accessToken })
  const { addDocumentToSpace } = useAddDocumentToSpace({ accessToken })
  const metadata = { theme: themeConfig, sidebarConfig }

  const handleInit = useCallback(async () => {
    let spaceToLaunch

    // Update space with either spaceConfigId or new config
    if (spaceId) {
      let localConfigId

      if (spaceConfig && !spaceConfigId) {
        try {
          const config = await createConfig({ spaceConfig })
          localConfigId = config?.data?.id
        } catch (error: any) {
          throw new Error(`Error creating space config: ${error}`)
        }
      }

      if (spaceConfigId && !spaceConfig) {
        // set passed in spaceConfigId to localConfigId
        localConfigId = spaceConfigId
      }

      try {
        const updatedSpace = await updateSpace({
          spaceId,
          spaceConfigId: localConfigId || '',
          environmentId,
          metadata,
          actions,
        })
        spaceToLaunch = updatedSpace
      } catch (error: any) {
        throw new Error(`Error updating space: ${error}`)
      }
    }

    // Creeate new space with either spaceConfigId or new config
    if (!spaceId) {
      let localConfigId

      if (spaceConfig && !spaceConfigId) {
        try {
          const config = await createConfig({ spaceConfig })
          localConfigId = config?.data?.id
        } catch (error: any) {
          throw new Error(`Error creating space config: ${error}`)
        }
      }

      if (!spaceConfig && spaceConfigId) {
        // set passed in spaceConfigId to localConfigId
        localConfigId = spaceConfigId
      }

      if (!localConfigId) {
        throw new Error(
          'Space config Id or raw config is required if no spaceId is provided'
        )
      }

      try {
        const newSpace = await createSpace({
          spaceConfigId: localConfigId,
          metadata,
          environmentId,
          actions,
        })
        spaceToLaunch = newSpace
      } catch (error) {
        throw new Error(`Error creating space: ${error}`)
      }
    }

    if (document && spaceToLaunch?.space.data) {
      await addDocumentToSpace({
        spaceId: spaceToLaunch?.space?.data?.id,
        document,
      })
    }

    return spaceToLaunch?.space?.data?.guestLink
  }, [accessToken])
  return { handleInit }
}
