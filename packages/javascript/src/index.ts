import { createIframe } from './createIframe'
import { ISidebarConfig, ISpace, IThemeConfig, IUserInfo } from '@flatfile/embedded-utils'
import { createWorkbook } from './services/workbook'
import { updateSpace } from './services/space'
import { createDocument } from './services/document'
import { Flatfile } from '@flatfile/api';

const displayError = (errorTitle: string, errorMessage: string) => {
  const display = document.createElement('div')
  const title = document.createElement('h1')
  const error = document.createElement('p')

  title.innerText = errorTitle
  error.innerText = errorMessage

  display.appendChild(title)
  display.appendChild(error)

  return display
}

export interface UpdateSpaceInfo {
  apiUrl: string,
  publishableKey: string, 
  workbook: Pick<Flatfile.CreateWorkbookConfig, "name" | "sheets" | "actions">, 
  spaceId: string, 
  environmentId: string,
  mountElement: string,
  errorTitle: string,
  themeConfig: IThemeConfig,
  document: Flatfile.DocumentConfig,
  sidebarConfig: ISidebarConfig, 
  userInfo?: Partial<IUserInfo>;
  spaceInfo?: Partial<IUserInfo>;
  accessToken: string;
}

const updateSpaceInfo = async (data: UpdateSpaceInfo) => {
  const { mountElement, errorTitle, document: documentConfig } = data
  try {
    await createWorkbook(data)
    await updateSpace(data)

    if (documentConfig) {
      await createDocument(data)
    }

  } catch (error) {
    const wrapper = document.getElementById(mountElement)
    const errorMessage = displayError(errorTitle, error)
    wrapper.appendChild(errorMessage)
  }
}

export async function initializeFlatfile(flatfileOptions: ISpace): Promise<void> {
  const {
    publishableKey,
    displayAsModal = true,
    mountElement = 'flatfile_iFrameContainer',
    space,
    spaceBody = null,
    apiUrl = 'https://platform.flatfile.com/api',
    baseUrl = 'https://spaces.flatfile.com',
    spaceUrl = 'https://spaces.flatfile.com',
    exitTitle = 'Close Window',
    exitText = 'Are you sure you would like to close this window? This will end your current data import session.',
    exitPrimaryButtonText = 'Yes, exit',
    exitSecondaryButtonText = 'No, stay',
    closeSpace,
    errorTitle = 'Something went wrong',
    name,
    environmentId,
    workbook,
    themeConfig,
    document: documentConfig,
    sidebarConfig, 
    userInfo, 
    spaceInfo
  } = flatfileOptions
  const spacesUrl = spaceUrl || baseUrl

  try {
    const createSpaceEndpoint = `${apiUrl}/v1/spaces`

    const createSpace = async () => {
      const response = await fetch(createSpaceEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${publishableKey}`,
        },
        body: JSON.stringify({
          autoConfigure: true,
          name: name || 'Embedded',
          ...spaceBody,
        }),
      })
      const result = await response.json()
      if (!response.ok) {
        const errorMessage = result?.errors[0]?.message || 'Failed to create space'
        throw new Error(errorMessage)
      }

      updateSpaceInfo({
        apiUrl,
        publishableKey, 
        workbook, 
        spaceId: result.data.id, 
        accessToken: result.data.accessToken,
        environmentId,
        mountElement,
        errorTitle,
        themeConfig,
        document: documentConfig,
        sidebarConfig, 
        userInfo, 
        spaceInfo
      })

      return result.data
    }

    const iFrameContainer = document.createElement('div')
    iFrameContainer.id = mountElement
    document.body.appendChild(iFrameContainer)

    const spaceData =
      space?.id && space?.accessToken ? space : await createSpace()
    if (!spaceData?.id || !spaceData?.accessToken) {
      throw new Error('Unable to create space, please try again.')
    }

    createIframe(
      spaceData.id,
      spaceData.accessToken,
      displayAsModal,
      mountElement,
      exitTitle,
      exitText,
      exitPrimaryButtonText,
      exitSecondaryButtonText,
      spacesUrl,
      closeSpace
    )
  } catch (error) {
    const wrapper = document.getElementById(mountElement)
    const errorMessage = displayError(errorTitle, error)
    wrapper.appendChild(errorMessage)
  }
}
