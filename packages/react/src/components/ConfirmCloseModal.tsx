import React from 'react'
import styled from 'styled-components'
import FontStyles from '../fonts/Fonts'

import '../index.css'

const OuterShell = styled.div`
  background-color: rgba(64, 72, 87, 0.2);
  box-sizing: border-box;
  display: block;
  height: 100%;
  left: 0px;
  overflow-y: auto;
  position: fixed;
  right: 0px;
  tab-size: 4;
  width: 100%;
  z-index: 1200;
`

const InnerShell = styled.div`
  align-items: center;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  min-height: 100%;
  padding: 0px;
  tab-size: 4;
  text-align: left;
`

const Modal = styled.div`
  box-sizing: border-box;
  display: block;
  padding: 1.5em;
  tab-size: 4;
  text-align: left;
  background: #fff;
  min-width: 500px;
  max-width: 500px;
`

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;

  > div {
    align-items: center;
    appearance: button;
    border-radius: 2px;
    column-gap: 8px;
    cursor: pointer;
    display: flex;
    font-size: 13.3333px;
    font-weight: 400;
    justify-content: center;
    letter-spacing: normal;
    line-height: normal;
    margin-left: 15px;
    padding: 8px 12px;
    row-gap: 8px;
    tab-size: 4;
    text-align: center;
    transition-delay: 0s;
    transition-duration: 0.2s;
    transition-property: background-color;
    transition-timing-function: ease;
    word-spacing: 0px;
    -webkit-box-align: center;
    -webkit-box-pack: center;
  }
  > div > div {
    cursor: pointer;
    display: block;
    font-family: var(--text-font);
    font-feature-settings: normal;
    font-size: 14px;
    font-weight: 600;
    height: 24px;
    letter-spacing: 0.14px;
    line-height: 24px;
    margin: 0 8px;
    tab-size: 4;
    text-align: center;
  }
`

const ButtonPrimary = styled.div`
  background-color: var(--color-electric-700);
  color: #fff;

  &:hover {
    background-color: var(--color-electric-800);
  }
`

const ButtonSecondary = styled.div`
  border: 1px solid var(--color-pigeon-300);
  color: var(--color-text);

  &:hover {
    background-color: var(--color-pigeon-200);
  }
`

const ModalHeading = styled.div`
  font-size: 1.225em;
  font-weight: 600;
  margin-bottom: 0.4em;
  color: var(--color-text);
`

export const ModalText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.75em;

  font-size: 14px;
  line-height: 1.25em;
  margin-bottom: 2em;
  color: var(--color-pigeon-600);
`

const ConfirmModal = ({
  onConfirm,
  onCancel,
  exitText,
  exitTitle,
  exitPrimaryButtonText,
  exitSecondaryButtonText
}: {
  onConfirm: () => void
  onCancel: () => void
  exitText: string
  exitTitle: string
  exitPrimaryButtonText: string
  exitSecondaryButtonText: string
}) => {
  return (
    <>
      <FontStyles />
      <OuterShell
        data-testid="close-confirm-modal"
        className="flatfile_outer-shell"
      >
        <InnerShell className="close-confirm-modal-inner">
          <Modal className="flatfile_inner-shell">
            <ModalHeading className="flatfile_modal-heading">
              {exitTitle}
            </ModalHeading>
            <ModalText className="flatfile_modal-text">{exitText}</ModalText>
            <ButtonGroup className="flatfile_button-group">
              <ButtonSecondary
                onClick={onCancel}
                className="flatfile_button flatfile_secondary"
              >
                <div>{exitSecondaryButtonText}</div>
              </ButtonSecondary>
              <ButtonPrimary
                onClick={onConfirm}
                className="flatfile_button flatfile_primary"
              >
                <div>{exitPrimaryButtonText}</div>
              </ButtonPrimary>
            </ButtonGroup>
          </Modal>
        </InnerShell>
      </OuterShell>
    </>
  )
}

export default ConfirmModal
