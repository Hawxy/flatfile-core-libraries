import React, { useState } from 'react'
import { ISpace } from '../types/ISpace'
import { useCreateListener } from '../hooks/useCreateListener'
import { useEventSubscriber } from '../hooks/useEventSubscriber'
import { Flatfile } from '@flatfile/api'
import ConfettiExplosion from 'react-confetti-explosion'

import { PubNubProvider } from 'pubnub-react'
import { useLaunchPubNub } from '../hooks/useLaunchPubNub'
import { useLaunchSpace } from '../hooks/useLaunchSpace'
import styled from 'styled-components'
import DefaultLoading from './Loading'

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
    return <div>Error loading space</div>
  }

  if (loading) {
    if (LoadingElement) {
      return LoadingElement
    }
    return <DefaultLoading />
  }

  return (
    spaceId &&
    spaceUrl &&
    accessToken && (
      <SpaceIframeWrap
        accessToken={accessToken}
        spaceSrc={spaceUrl}
        spaceId={spaceId}
        {...props}
      />
    )
  )
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
  const [showConfetti, setShowConfetti] = useState(false)
  const { spaceId, spaceUrl, listener, accessToken, closeSpace, iframeStyles } =
    props

  const { dispatchEvent } = useCreateListener({
    listener,
    accessToken
  })

  const styledIframe = iframeStyles ?? {
    width: '100%',
    height: '750px',
    borderWidth: 0,
    borderRadius: '20px',
    background: '#fff',
    padding: '16px'
  }

  useEventSubscriber(
    [
      Flatfile.EventTopic.JobCreated,
      Flatfile.EventTopic.JobUpdated,
      Flatfile.EventTopic.JobOutcomeAcknowledged
    ],
    (event) => {
      const eventResponse = JSON.parse(event.message) ?? {}
      if (
        eventResponse.topic === 'job:outcome-acknowledged' &&
        eventResponse.payload.operation === closeSpace?.operation
      ) {
        setShowConfetti(true)
        setTimeout(() => closeSpace?.onClose({}), 2000)
      }
      dispatchEvent(eventResponse)
    },
    spaceId
  )

  const Button = styled.button`
    svg {
      fill: lightgray;
    }

    svg:hover {
      fill: gray;
    }
    position: relative;
    top: 10px;
    right: 10px;
    width: 30px;
    height: 30px;
    cursor: pointer;
    border: none;
    background: transparent;
  `

  return (
    <div style={{ display: 'flex' }}>
      {showConfetti && (
        <ConfettiExplosion
          style={{ position: 'absolute', top: '20%', right: '50%' }}
          force={0.6}
          duration={2500}
          particleCount={80}
          width={1000}
          zIndex={100}
        />
      )}
      <iframe style={styledIframe} id="flatfile-iframe" src={spaceUrl} />
      <Button id="close-button" onClick={() => {}}>
        <svg viewBox="0 0 24 24">
          <path d="M18.364 5.636c-0.781-0.781-2.048-0.781-2.828 0l-5.536 5.536 -5.536-5.536c-0.781-0.781-2.048-0.781-2.828 0s-0.781 2.048 0 2.828l5.536 5.536 -5.536 5.536c-0.781 0.781-0.781 2.048 0 2.828s2.048 0.781 2.828 0l5.536-5.536 5.536 5.536c0.781 0.781 2.048 0.781 2.828 0s0.781-2.048 0-2.828l-5.536-5.536 5.536-5.536c0.781-0.781 0.781-2.048 0-2.828z"></path>
        </svg>
      </Button>
    </div>
  )
}

export default Space
