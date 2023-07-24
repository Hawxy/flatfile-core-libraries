import { Flatfile } from '@flatfile/api'
import Pubnub from 'pubnub'
import { PubNubProvider } from 'pubnub-react'
import React, { JSX, useState } from 'react'
import { useCreateListener } from '../hooks/useCreateListener'
import { useEventSubscriber } from '../hooks/useEventSubscriber'
import { ISpace } from '../types/ISpace'
import ConfirmModal from './ConfirmCloseModal'
import { CloseIframeButton, getIframeStyles } from './embeddedStyles'

/**
 * @name Space
 * @description Flatfile Embedded Space component
 * @param props
 */

interface SpaceComponent {
  spaceId: string
  spaceUrl: string
  accessToken: string
  pubNub: Pubnub
}

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
  props: ISpace & { spaceId: string; spaceUrl: string; accessToken: string }
): JSX.Element => {
  const [showExitWarnModal, setShowExitWarnModal] = useState(false)
  const {
    spaceId,
    spaceUrl,
    listener,
    accessToken,
    closeSpace,
    iframeStyles,
    mountElement = 'flatfile_iFrameContainer',
    exitText = 'Are you sure you want to exit? Any unsaved changes will be lost.',
    exitTitle = 'Close Window',
  } = props

  const { dispatchEvent } = useCreateListener({ listener, accessToken })

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
        eventResponse.payload.operation === closeSpace?.operation
      ) {
        closeSpace?.onClose({})
      }

      dispatchEvent(eventResponse)
    },
    spaceId
  )

  return (
    <div style={{ display: 'flex' }} data-testid="space-contents">
      {showExitWarnModal && (
        <ConfirmModal
          onConfirm={() => closeSpace?.onClose({})}
          onCancel={() => setShowExitWarnModal(false)}
          exitText={exitText}
          exitTitle={exitTitle}
        />
      )}
      <iframe
        data-testid={mountElement}
        style={getIframeStyles(iframeStyles!)}
        src={spaceUrl}
      />
      <CloseIframeButton
        onClick={() => setShowExitWarnModal(true)}
        data-testid="flatfile-close-button"
      >
        <svg viewBox="0 0 24 24">
          <path d="M18.364 5.636c-0.781-0.781-2.048-0.781-2.828 0l-5.536 5.536 -5.536-5.536c-0.781-0.781-2.048-0.781-2.828 0s-0.781 2.048 0 2.828l5.536 5.536 -5.536 5.536c-0.781 0.781-0.781 2.048 0 2.828s2.048 0.781 2.828 0l5.536-5.536 5.536 5.536c0.781 0.781 2.048 0.781 2.828 0s0.781-2.048 0-2.828l-5.536-5.536 5.536-5.536c0.781-0.781 0.781-2.048 0-2.828z"></path>
        </svg>
      </CloseIframeButton>
    </div>
  )
}

export default Space
