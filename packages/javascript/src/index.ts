import { createIframe } from './createIframe'

interface InitializeFlatfileOptions {
  publishableKey?: string
  displayAsModal?: boolean
  mountElement?: string
  space?: {
    id: string
    accessToken: string
  }
  spaceBody?: object
  apiUrl?: string
  baseUrl?: string
  exitTitle?: string
  exitText?: string
  closeSpace?: {
    operation: string
    onClose: (data: any) => void
  }
}

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

export async function initializeFlatfile({
  publishableKey,
  displayAsModal = true,
  mountElement = 'flatfile_iFrameContainer',
  space,
  spaceBody = null,
  apiUrl = 'https://platform.flatfile.com/api',
  baseUrl = 'https://spaces.flatfile.com',
  exitTitle = 'Close Window',
  exitText = 'Are you sure you would like to close this window? This will end your current data import session.',
  closeSpace,
  errorTitle = 'Something went wrong',
}: InitializeFlatfileOptions): Promise<void> {
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
          name: 'Embedded',
          ...spaceBody,
        }),
      })
      if (!response.ok) {
        throw new Error('Failed to create space')
      }
      const result = await response.json()
      if (!result.ok) {
        const errorMessage = result.errors[0].message
        throw new Error(errorMessage)
      }
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
      baseUrl,
      closeSpace
    )
  } catch (error) {
    const wrapper = document.getElementById(mountElement)
    const errorMessage = displayError(errorTitle, error)
    wrapper.appendChild(errorMessage)
  }

}
