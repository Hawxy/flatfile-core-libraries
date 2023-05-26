import React from 'react'
import styled from 'styled-components'

export const CloseIframeButton = styled.button`
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

export const getIframeStyles = (styles: React.CSSProperties) => {
  return (
    styles ?? {
      width: '100%',
      height: '750px',
      borderWidth: 0,
      borderRadius: '20px',
      background: '#fff',
      padding: '16px'
    }
  )
}

export const SpinnerStyles = styled.div`
  margin: 16px;
`
