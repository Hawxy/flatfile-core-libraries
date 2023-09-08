import { Flatfile } from '@flatfile/api'
import { PubNubProvider } from 'pubnub-react'
import React, { JSX, useState } from 'react'
import { useCreateListener } from '../hooks/useCreateListener'
import { useEventSubscriber } from '../hooks/useEventSubscriber'
import { ISpace, SpaceComponent } from '@flatfile/embedded-utils'
import ConfirmModal from './ConfirmCloseModal'
import { CloseIframeButton, getIframeStyles, getContainerStyles } from './embeddedStyles'

/**
 * @name Space
 * @description Flatfile Embedded Space component
 * @param props
 */

const Space = ({
  spaceId,
  spaceUrl,
  accessToken,
  pubNub,
  ...props
}: SpaceComponent & ISpace): JSX.Element | null => {
  return spaceId && spaceUrl && accessToken && pubNub ? (
    <PubNubProvider client={pubNub}>
      <SpaceContents
        spaceId={spaceId}
        spaceUrl={spaceUrl}
        accessToken={accessToken}
        {...props}
      />
    </PubNubProvider>
  ) : null
}

export const SpaceContents = (
  props: ISpace & { spaceId: string; spaceUrl: string; accessToken: string; }
): JSX.Element => {
  const [showExitWarnModal, setShowExitWarnModal] = useState(false)
  const {
    spaceId,
    spaceUrl,
    spaceBody,
    listener,
    accessToken,
    closeSpace,
    iframeStyles,
    mountElement = 'flatfile_iFrameContainer',
    exitText = 'Are you sure you want to exit? Any unsaved changes will be lost.',
    exitTitle = 'Close Window',
    exitPrimaryButtonText = 'Yes, exit',
    exitSecondaryButtonText = 'No, stay',
    apiUrl = 'https://platform.flatfile.com/api',
    displayAsModal = true,
  } = props

  const { dispatchEvent } = useCreateListener({ listener, accessToken, apiUrl })

  useEventSubscriber(
    [
      Flatfile.EventTopic.JobCreated,
      Flatfile.EventTopic.JobUpdated,
      Flatfile.EventTopic.JobOutcomeAcknowledged,
    ],
    (event) => {
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
    spaceId,
  )

  return (
    <div 
      className={`flatfile_iframe-wrapper ${displayAsModal ? 'flatfile_displayAsModal' : ''}`} 
      style={getContainerStyles(displayAsModal)} 
      data-testid="space-contents"
    >
      {showExitWarnModal && (
        <ConfirmModal
          onConfirm={() => closeSpace?.onClose({})}
          onCancel={() => setShowExitWarnModal(false)}
          exitText={exitText}
          exitTitle={exitTitle}
          exitPrimaryButtonText={exitPrimaryButtonText}
          exitSecondaryButtonText={exitSecondaryButtonText}
        />
      )}
      <iframe
        data-testid={mountElement}
        className={mountElement}
        style={getIframeStyles(iframeStyles!)}
        src={spaceUrl}
      />
      <CloseIframeButton
        onClick={() => setShowExitWarnModal(true)}
        data-testid="flatfile-close-button" className="flatfile-close-button"
        style={{ position: 'absolute', margin: '30px' }}
      >
        <svg viewBox="0 0 24 24">
          <path d="M18.364 5.636c-0.781-0.781-2.048-0.781-2.828 0l-5.536 5.536 -5.536-5.536c-0.781-0.781-2.048-0.781-2.828 0s-0.781 2.048 0 2.828l5.536 5.536 -5.536 5.536c-0.781 0.781-0.781 2.048 0 2.828s2.048 0.781 2.828 0l5.536-5.536 5.536 5.536c0.781 0.781 2.048 0.781 2.828 0s0.781-2.048 0-2.828l-5.536-5.536 5.536-5.536c0.781-0.781 0.781-2.048 0-2.828z"></path>
        </svg>
      </CloseIframeButton>
    </div>
  )
}

export default Space
