import { Component, Input, OnInit } from '@angular/core'
import { ISpace } from '@flatfile/embedded-utils'
import { Browser, FlatfileEvent } from '@flatfile/listener'

import addSpaceInfo from '../../../utils/addSpaceInfo'
import authenticate from '../../../utils/authenticate'
import {
  SpaceCloseModal,
  SpaceCloseModalPropsType,
} from '../space-close-modal/spaceCloseModal.component'
import { getContainerStyles, getIframeStyles } from './embeddedStyles'

export type SpaceFramePropsType = ISpace & {
  spaceId: string
  spaceUrl: string
  localAccessToken: string
  pubNub: any
}

@Component({
  selector: 'space-frame',
  templateUrl: './spaceFrame.component.html',
  styleUrls: ['./spaceFrame.component.scss'],
})
export class SpaceFrame implements OnInit {
  title = 'space-frame'
  showExitWarnModal = false
  spaceCloseModalProps: SpaceCloseModalPropsType =
    {} as SpaceCloseModalPropsType
  iframeWrapperStyle = {}
  iframeStyle = {}

  @Input({ required: true }) spaceFrameProps: SpaceFramePropsType =
    {} as SpaceFramePropsType
  @Input({ required: true }) loading: boolean = false

  async created() {
    const { pubNub, spaceId, listener, apiUrl, closeSpace } =
      this.spaceFrameProps
    const accessToken = this.spaceFrameProps.localAccessToken

    if (listener && typeof apiUrl === 'string')
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

    const callback = (event: any) => {
      const eventResponse = JSON.parse(event.message) ?? {}
      if (
        eventResponse.topic === 'job:outcome-acknowledged' &&
        eventResponse.payload.status === 'complete' &&
        eventResponse.payload.operation === closeSpace?.operation
      ) {
        closeSpace?.onClose({})
      }

      dispatchEvent(eventResponse)
    }

    const channel = [`space.${spaceId}`]
    const pubNubListener = { message: callback }
    pubNub.addListener(pubNubListener)
    pubNub.subscribe({
      channels: channel,
    })
  }

  async initializeSpace() {
    await this.created()
    const {
      publishableKey,
      workbook,
      environmentId,
      document,
      themeConfig,
      sidebarConfig,
      userInfo,
      spaceId,
      apiUrl = 'https://platform.flatfile.com/api',
    } = this.spaceFrameProps

    const accessToken = this.spaceFrameProps.localAccessToken

    if (typeof publishableKey !== 'string')
      throw new Error('please enter a valid publishable key')

    const fullAccessApi = authenticate(accessToken, apiUrl)
    await addSpaceInfo(
      {
        publishableKey,
        workbook,
        environmentId,
        document,
        themeConfig,
        sidebarConfig,
        userInfo,
      },
      spaceId,
      fullAccessApi
    )
  }

  async unInitializeSpace(){
    const {pubNub, spaceId} = this.spaceFrameProps;
    const channel = `space.${spaceId}`;
    pubNub?.unsubScripbe?.([channel])
  }

  openCloseModalDialog() {
    this.showExitWarnModal = true
  }

  handleConfirm() {
    const { closeSpace } = this.spaceFrameProps
    closeSpace?.onClose({})
  }

  handleCancel() {
    this.showExitWarnModal = false
  }

  ngOnInit(): void {
    const {
      spaceId,
      exitText,
      exitTitle,
      exitPrimaryButtonText,
      exitSecondaryButtonText,
    } = this.spaceFrameProps

    this.iframeWrapperStyle = getContainerStyles(
      this.spaceFrameProps.displayAsModal || false
    )
    this.iframeStyle = getIframeStyles(this.spaceFrameProps.iframeStyles)

    if (!this.spaceFrameProps.localAccessToken)
      throw new Error('please wait until access token is recieved')
    const accessToken = this.spaceFrameProps.localAccessToken

    window.CROSSENV_FLATFILE_API_KEY = accessToken

    this.initializeSpace()

    this.spaceCloseModalProps = {
      onConfirm: this.handleConfirm.bind(this),
      onCancel: this.handleCancel.bind(this),
      exitText,
      exitTitle,
      exitPrimaryButtonText,
      exitSecondaryButtonText,
    }
  }

  ngOnDestroy(): void {
    this.unInitializeSpace()
  }
}

export {}

declare global {
  interface Window {
    CROSSENV_FLATFILE_API_KEY: string
  }
}
