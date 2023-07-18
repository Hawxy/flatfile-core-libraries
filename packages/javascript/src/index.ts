import './styles.css'
import { createIframe } from './createIframe'

interface InitializeFlatfileOptions {
  publishableKey: string
  environmentId: string
  displayAsModal?: boolean
  mountElement: string
  space?: {
    id: string
    accessToken: string
  }
  apiUrl?: string
  exitTitle?: string
  exitText?: string
}

export async function initializeFlatfile({
  publishableKey,
  environmentId,
  displayAsModal = true,
  mountElement = 'flatfile_iFrameContainer',
  space,
  apiUrl = 'https://platform.flatfile.com/api/v1',
  exitTitle = 'Close Window',
  exitText = 'Are you sure you would like to close this window? This will end your current data import session.',
}: InitializeFlatfileOptions): Promise<void> {
  const createSpace = async () => {
    const createSpaceEndpoint = `${apiUrl}/spaces`

    try {
      const response = await fetch(createSpaceEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${publishableKey}`,
        },
        body: JSON.stringify({
          environmentId,
          autoConfigure: true,
          name: 'Embedded',
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create space')
      }

      const result = await response.json()
      return result.data
    } catch (error) {
      console.error('Error creating new space:', error)
      throw error
    }
  }

  const iFrameContainer = document.createElement('div')
  iFrameContainer.id = mountElement
  document.body.appendChild(iFrameContainer)

  let spaceData = space || { id: '', accessToken: '' } // Provide default values here

  if (!spaceData.id || !spaceData.accessToken) {
    try {
      spaceData = await createSpace()
    } catch (error) {
      console.error('Error creating new space:', error)
      return
    }
  }

  createIframe(
    spaceData.id,
    spaceData.accessToken,
    displayAsModal,
    mountElement,
    exitTitle,
    exitText
  )
}
