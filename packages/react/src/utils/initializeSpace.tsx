import { FlatfileClient } from '@flatfile/api'
import { ISpace } from '../types/ISpace'

const saveTokenToWindow = (token: string) => {
  sessionStorage.setItem('token', token)
}

export const initializeSpace = async (spaceProps: ISpace) => {
  if (!spaceProps.publishableKey) {
    console.warn('Missing required publishable key')
    throw new Error('Missing required publishable key')
  }

  if (!spaceProps.environmentId) {
    console.warn('Missing required environment id')
    throw new Error('Missing required environment id')
  }

  const space = await createSpace(spaceProps)

  if (space?.data.accessToken) {
    await saveTokenToWindow(space?.data.accessToken)
  }

  if (space?.data?.accessToken && space.data.id) {
    await addSpaceInfo({
      spaceProps,
      accessToken: space?.data?.accessToken,
      spaceId: space.data?.id
    })
  } else {
    console.warn(`Error getting spaceId and accessToken`)
    throw new Error(`Error getting spaceId and accessToken`)
  }

  return space
}

const createSpace = async (spaceProps: ISpace) => {
  const { environmentId, name, publishableKey } = spaceProps
  const flatfile = new FlatfileClient({
    token: publishableKey,
    environment: 'https://platform.flatfile.com/api/v1'
  })

  try {
    const space = await flatfile.spaces.create({
      environmentId,
      name
    })

    return space
  } catch (e: any) {
    console.log(
      `${e}: \n\nDouble check your environmentId is tied to your publishable key and themeConfig / sidebarConfigs (if passing in) are in the right format.`
    )
    throw new Error(
      `${e}: \n\nDouble check your environmentId is tied to your publishable key and themeConfig / sidebarConfigs (if passing in) are in the right format.`
    )
  }
}

const addSpaceInfo = async ({
  spaceProps,
  accessToken,
  spaceId
}: {
  spaceProps: ISpace
  accessToken: string
  spaceId: string
}) => {
  const {
    workbook,
    environmentId,
    document,
    themeConfig,
    sidebarConfig,
    spaceInfo
  } = spaceProps

  const flatfile = new FlatfileClient({
    token: accessToken,
    environment: 'https://platform.flatfile.com/api/v1'
  })

  let localWorkbook

  try {
    localWorkbook = await flatfile.workbooks.create({
      sheets: workbook.sheets,
      name: workbook.name,
      actions: workbook.actions,
      spaceId,
      environmentId
    })

    const metadata = {
      theme: themeConfig,
      sidebarConfig,
      spaceInfo
    }

    await flatfile.spaces.update(spaceId, {
      environmentId,
      primaryWorkbookId: localWorkbook.data.id,
      metadata
    })
  } catch (e) {
    console.log(
      `Error adding workbook to space: ${e} \n\nDouble check your workbookConfig is in the right format.`
    )
    throw new Error(
      `Error adding workbook to space: ${e} \n\nDouble check your workbookConfig is in the right format.`
    )
  }

  if (document) {
    try {
      await flatfile.documents.create(spaceId, {
        title: document.title,
        body: document.body
      })
    } catch (e) {
      console.log(
        `Error adding document to space: ${e} \n\nDouble check your document is in the right format {title: string, body: string}.`
      )

      throw new Error(
        `Error adding document to space: ${e} \n\nDouble check your document is in the right format {title: string, body: string}.`
      )
    }
  }
}
