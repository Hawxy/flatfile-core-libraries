import api, { Flatfile } from '@flatfile/api'
import { Browser, FlatfileListener, FlatfileEvent } from '@flatfile/listener'
import Pubnub from 'pubnub'

import { createIframe } from './src/createIframe'
import {
  ISidebarConfig,
  IThemeConfig,
  IUserInfo,
  NewSpaceFromPublishableKey,
  initializePubnub,
  SimpleOnboarding,
  JobHandler,
  SheetHandler,
  createWorkbookFromSheet,
  DefaultSubmitSettings,
} from '@flatfile/embedded-utils'
import { createWorkbook } from './src/services/workbook'
import { updateSpace } from './src/services/space'
import { createDocument } from './src/services/document'

import { recordHook } from '@flatfile/plugin-record-hook'
import { FlatfileRecord } from '@flatfile/hooks'

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
    message: (event: { message: string }) => {
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
  publishableKey?: string
  workbook?: Pick<Flatfile.CreateWorkbookConfig, 'name' | 'sheets' | 'actions'>
  spaceId: string
  environmentId: string
  mountElement: string
  errorTitle: string
  themeConfig?: IThemeConfig
  document?: Flatfile.DocumentConfig
  sidebarConfig?: ISidebarConfig
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
    const errorMessage = displayError(errorTitle, error as string)
    wrapper?.appendChild(errorMessage)
  }
}

interface SimpleListenerType
  extends Pick<
    SimpleOnboarding,
    'onRecordHook' | 'onSubmit' | 'submitSettings'
  > {
  slug: string
}

const createSimpleListener = ({
  onRecordHook,
  onSubmit,
  slug,
  submitSettings,
}: SimpleListenerType) =>
  FlatfileListener.create((client: FlatfileListener) => {
    if (onRecordHook) {
      client.use(
        recordHook(
          slug,
          async (record: FlatfileRecord, event: FlatfileEvent | undefined) =>
            // @ts-ignore - something weird with the `data` prop and the types upstream in the packages being declared in different places, but overall this is fine
            onRecordHook(record, event)
        )
      )
    }
    if (onSubmit) {
      const onSubmitSettings = { ...DefaultSubmitSettings, ...submitSettings }
      client.filter({ job: 'workbook:simpleSubmitAction' }, (configure) => {
        configure.on('job:ready', async (event) => {
          const { jobId, spaceId, workbookId } = event.context
          try {
            await api.jobs.ack(jobId, { info: 'Starting job', progress: 10 })

            const job = new JobHandler(jobId)
            const { data: workbookSheets } = await api.sheets.list({
              workbookId,
            })

            // this assumes we are only allowing 1 sheet here (which we've talked about doing initially)
            const sheet = new SheetHandler(workbookSheets[0].id)

            await onSubmit({ job, sheet, event })

            await api.jobs.complete(jobId, {
              outcome: {
                message: 'complete',
              },
            })
            if (onSubmitSettings.deleteSpaceAfterSubmit) {
              await api.spaces.archiveSpace(spaceId)
            }
          } catch (error: any) {
            if (jobId) {
              await api.jobs.cancel(jobId)
            }
            console.error('Error:', error.stack)
          }
        })
      })
    }
  })

export async function startFlatfile(options: SimpleOnboarding) {
  const {
    publishableKey,
    displayAsModal = true,
    mountElement = 'flatfile_iFrameContainer',
    space,
    sheet,
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
    onRecordHook,
    onSubmit,
    onCancel,
  } = options
  const spacesUrl = spaceUrl || baseUrl
  try {
    const createSpaceEndpoint = `${apiUrl}/v1/spaces`
    let createdWorkbook = workbook
    const createSpace = async () => {
      const spaceRequestBody = {
        name: name || 'Embedded Space',
        autoConfigure: false,
        labels: ['embedded'],
        ...spaceBody,
      }

      if (!createdWorkbook && !sheet) {
        spaceRequestBody.autoConfigure = true
      }

      if (!createdWorkbook && sheet) {
        createdWorkbook = createWorkbookFromSheet(sheet, !!onSubmit)
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

    const spaceData = await createSpace()
    if (!spaceData?.id || !spaceData?.accessToken) {
      throw new Error('Unable to create space, please try again.')
    }

    let pubnubClient: Pubnub | undefined

    const simpleListenerSlug: string =
      createdWorkbook?.sheets?.[0].slug || 'slug'

    if (listener) {
      pubnubClient = await createlistener(
        spaceData.id,
        spaceData.accessToken,
        apiUrl,
        listener,
        closeSpace
      )
    } else {
      pubnubClient = await createlistener(
        spaceData.id,
        spaceData.accessToken,
        apiUrl,
        createSimpleListener({
          onRecordHook,
          onSubmit,
          slug: simpleListenerSlug,
        }),
        closeSpace
      )
    }

    await updateSpaceInfo({
      apiUrl,
      publishableKey,
      workbook: createdWorkbook,
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
      pubnubClient,
      onCancel
    )

    return { spaceId: spaceData.id }
  } catch (error) {
    const wrapper = document.getElementById(mountElement)
    const errorMessage = displayError(errorTitle, error as string)
    wrapper?.appendChild(errorMessage)
  }
}

export const initializeFlatfile = startFlatfile
