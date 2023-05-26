import React from 'react'
import styled from 'styled-components'
import { Button } from '@flatfile/design-system'

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;

  *:first-child {
    margin-right: 8px;
  }
`

const ModalHeading = styled.div`
  font-size: 1.125em;
  font-weight: 600;
  margin-bottom: 0.5em;
  color: var(--color-text);
`

export const ModalText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.75em;

  font-size: 14px;
  line-height: 1.25em;
  margin-bottom: 0.5em;
  color: var(--color-pigeon-700);
`

const ConfirmModal = ({
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void
  onCancel: () => void
}) => {
  return (
    <>
      <ModalHeading>Are you sure you would like to exit?</ModalHeading>
      <ModalText>This will end your current data import session.</ModalText>
      <ButtonGroup>
        <Button onPress={onCancel} variant="secondary" label="No, stay" />
        <Button onPress={onConfirm} variant="primary" label="Yes, exit" />
      </ButtonGroup>
    </>
  )
}

export default ConfirmModal
