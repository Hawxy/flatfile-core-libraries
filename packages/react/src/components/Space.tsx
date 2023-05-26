import { Flatfile } from '@flatfile/api'
import { Modal } from '@flatfile/design-system'
import { PubNubProvider } from 'pubnub-react'
import React, { useState } from 'react'
import ConfirmModal from './ConfirmCloseModal'
import { useCreateListener } from '../hooks/useCreateListener'
import { useEventSubscriber } from '../hooks/useEventSubscriber'
import { useLaunchPubNub } from '../hooks/useLaunchPubNub'
import { useLaunchSpace } from '../hooks/useLaunchSpace'
import { ISpace } from '../types/ISpace'
import DefaultError from './Error'
import Spinner from './Spinner'
import {
  CloseIframeButton,
  SpinnerStyles,
  getIframeStyles,
} from './embeddedStyles'

/**
 * @name Space
 * @description Flatfile Embedded Space component
 * @param props
 */

const Space = (props: ISpace): any => {
  const { error: ErrorElement, loading: LoadingElement } = props
  const { spaceUrl, error, loading, spaceId, accessToken } =
    useLaunchSpace(props)

  if (error) {
    if (ErrorElement) {
      return ErrorElement(error)
    }
    return <DefaultError error={error} />
  }

  if (loading) {
    if (LoadingElement) {
      return LoadingElement
    }
    return (
      <SpinnerStyles>
        <Spinner />
      </SpinnerStyles>
    )
  }

  return spaceId && spaceUrl && accessToken ? (
    <SpaceIframeWrap
      accessToken={accessToken}
      spaceSrc={spaceUrl}
      spaceId={spaceId}
      {...props}
    />
  ) : null
}

const SpaceIframeWrap = (
  props: ISpace & {
    spaceId: string
    spaceSrc: string
    accessToken: string
  }
) => {
  const { spaceId, accessToken, spaceSrc } = props

  const { localPubnub, error } = useLaunchPubNub({ spaceId, accessToken })

  if (error) {
    return <div>{`${JSON.stringify(error)}`}</div>
  }

  return localPubnub ? (
    <PubNubProvider client={localPubnub}>
      <SpaceContents spaceUrl={spaceSrc} {...props} />
    </PubNubProvider>
  ) : null
}

const SpaceContents = (
  props: ISpace & {
    spaceId: string
    spaceUrl: string
    accessToken: string
  }
) => {
  const [showExitWarnModal, setShowExitWarnModal] = useState(false)
  const { spaceId, spaceUrl, listener, accessToken, closeSpace, iframeStyles } =
    props

  const { dispatchEvent } = useCreateListener({
    listener,
    accessToken,
  })

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
    <div style={{ display: 'flex' }}>
      {showExitWarnModal && (
        <Modal
          contents={
            <ConfirmModal
              onConfirm={() => closeSpace?.onClose({})}
              onCancel={() => setShowExitWarnModal(false)}
            />
          }
        />
      )}
      <iframe style={getIframeStyles(iframeStyles!)} src={spaceUrl} />
      <CloseIframeButton onClick={() => setShowExitWarnModal(true)}>
        <svg viewBox="0 0 24 24">
          <path d="M18.364 5.636c-0.781-0.781-2.048-0.781-2.828 0l-5.536 5.536 -5.536-5.536c-0.781-0.781-2.048-0.781-2.828 0s-0.781 2.048 0 2.828l5.536 5.536 -5.536 5.536c-0.781 0.781-0.781 2.048 0 2.828s2.048 0.781 2.828 0l5.536-5.536 5.536 5.536c0.781 0.781 2.048 0.781 2.828 0s0.781-2.048 0-2.828l-5.536-5.536 5.536-5.536c0.781-0.781 0.781-2.048 0-2.828z"></path>
        </svg>
      </CloseIframeButton>
    </div>
  )
}

export default Space
