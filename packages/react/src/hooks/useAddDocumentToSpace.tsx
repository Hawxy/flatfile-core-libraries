import { useHttpClient } from './useHttpClient'
import { DocumentConfig } from '@flatfile/api'

/**
 * @name useCreateDocument
 * @param accessToken - accessToken to be passed to api
 * @returns addSpace function to be used inside useInitializeSpace hook
 * @description adds space and metadata to environment
 *
 */

export const useAddDocumentToSpace = ({
  accessToken,
}: {
  accessToken: string
}) => {
  const { httpClient } = useHttpClient({ accessToken })

  const addDocumentToSpace = async ({
    spaceId,
    document,
  }: {
    spaceId: string
    document: DocumentConfig
  }) => {
    const doc = await httpClient.addDocumentToSpace({
      spaceId,
      documentConfig: document,
    })
    return { doc }
  }
  return { addDocumentToSpace }
}
