import dotenv from 'dotenv'
import { Flatfile } from '@flatfile/api'
import { CrossEnvConfig } from '@flatfile/cross-env-config'
import { Browser, FlatfileListener, FlatfileEvent } from '@flatfile/listener'
import Pubnub from 'pubnub'

import { createIframe } from './createIframe'
import {
  ISidebarConfig,
  ISpace,
  IThemeConfig,
  IUserInfo,
  NewSpaceFromPublishableKey,
  initializePubnub,
} from '@flatfile/embedded-utils'
import { createWorkbook } from './services/workbook'
import { updateSpace } from './services/space'
import { createDocument } from './services/document'

const displayError = (errorTitle: string, errorMessage: string) => {
  const display = document.createElement('div')
  display.classList.add('ff_error_container')
  const title = document.createElement('h1')
  title.classList.add('ff_error_heading')
  const error = document.createElement('p')
  error.classList.add('ff_error_text')

  title.innerText = errorTitle
  error.innerText = errorMessage

  display.appendChild(title)
  display.appendChild(error)

  return display
}

async function createlistener(
  spaceId: string,
  accessToken: string,
  apiUrl: string,
  listener: FlatfileListener,
  closeSpace: NewSpaceFromPublishableKey['closeSpace']
): Promise<Pubnub> {
  const pubnub = await initializePubnub({
    spaceId,
    accessToken,
    apiUrl,
  })

  // todo: should we use CrossEnvConfig here?
  // CrossEnvConfig.set('FLATFILE_API_KEY', accessToken)
  ;(window as any).CROSSENV_FLATFILE_API_KEY = accessToken

  const channel = [`space.${spaceId}`]
  pubnub.subscribe({ channels: channel })

  listener.mount(
    new Browser({
      apiUrl,
      accessToken,
      fetchApi: fetch,
    })
  )
  const dispatchEvent = (event: any) => {
    if (!event) return

    const eventPayload = event.src ? event.src : event
    const eventInstance = new FlatfileEvent(eventPayload, accessToken, apiUrl)

    return listener?.dispatchEvent(eventInstance)
  }

  pubnub.addListener({
    message: (event) => {
      const eventResponse = JSON.parse(event.message) ?? {}
      if (
        eventResponse.topic === 'job:outcome-acknowledged' &&
        eventResponse.payload.status === 'complete' &&
        eventResponse.payload.operation === closeSpace?.operation
      ) {
        closeSpace?.onClose({})
      }

      dispatchEvent(eventResponse)
    },
  })

  return pubnub
}

export interface UpdateSpaceInfo {
  apiUrl: string
  publishableKey: string
  workbook: Pick<Flatfile.CreateWorkbookConfig, 'name' | 'sheets' | 'actions'>
  spaceId: string
  environmentId: string
  mountElement: string
  errorTitle: string
  themeConfig: IThemeConfig
  document: Flatfile.DocumentConfig
  sidebarConfig: ISidebarConfig
  userInfo?: Partial<IUserInfo>
  spaceInfo?: Partial<IUserInfo>
  accessToken: string
  spaceBody?: any
}

const updateSpaceInfo = async (data: UpdateSpaceInfo) => {
  const { mountElement, errorTitle, document: documentConfig, workbook } = data

  try {
    if (workbook) {
      await createWorkbook(data)
    }
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

export async function initializeFlatfile(
  flatfileOptions: ISpace
): Promise<void> {
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
    spaceInfo,
    listener,
  } = flatfileOptions
  const spacesUrl = spaceUrl || baseUrl

  dotenv.config()
  CrossEnvConfig.set('FLATFILE_API_KEY', process.env.FLATFILE_API_KEY)

  try {
    const createSpaceEndpoint = `${apiUrl}/v1/spaces`

    const createSpace = async () => {
      const spaceRequestBody = {
        name: name || 'Embedded Space',
        autoConfigure: false,
        labels: ['embedded'],
        ...spaceBody,
      }

      if (!workbook) {
        spaceRequestBody.autoConfigure = true
      }

      const response = await fetch(createSpaceEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${publishableKey}`,
        },
        body: JSON.stringify(spaceRequestBody),
      })

      const result = await response.json()
      if (!response.ok) {
        const errorMessage =
          result?.errors[0]?.message || 'Failed to create space'
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
    
    let pubnubClient: Pubnub | undefined
    if (listener) {
      pubnubClient = await createlistener(
        spaceData.id,
        spaceData.accessToken,
        apiUrl,
        listener,
        closeSpace
      )
    }

    await updateSpaceInfo({
      apiUrl,
      publishableKey,
      workbook,
      spaceId: spaceData.id,
      accessToken: spaceData.accessToken,
      environmentId,
      mountElement,
      errorTitle,
      themeConfig,
      document: documentConfig,
      sidebarConfig,
      userInfo,
      spaceInfo,
    })

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
      closeSpace,
      pubnubClient
    )
  } catch (error) {
    const wrapper = document.getElementById(mountElement)
    const errorMessage = displayError(errorTitle, error)
    wrapper?.appendChild(errorMessage)
  }
}
