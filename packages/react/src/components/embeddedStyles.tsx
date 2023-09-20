import React from 'react'
import styled from 'styled-components'

export const CloseIframeButton = styled.button`
  svg {
    fill: lightgray;
    width: 10px;
  }
  position: relative;
  top: 20px;
  right: -20px;
  width: 25px;
  height: 25px;
  border-radius: 100%;
  cursor: pointer;
  border: none;
  background: #000;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.5);
  animation: glow 1.5s linear infinite alternate;
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.8);
  }
`

export const getIframeStyles = (styles: React.CSSProperties) => {
  return (
    styles ?? {
      width: '100%',
      height: '750px',
      borderWidth: 0,
      borderRadius: '20px',
      background: '#fff',
      padding: '16px',
    }
  )
}

export const getContainerStyles = (isModal: boolean): React.CSSProperties => {
  if (isModal) {
    return {
      width: 'calc(100% - 100px)',
      height: 'calc(100vh - 40px)',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 1000,
      backgroundColor: 'rgba(0,0,0,0.2)',
      display: 'flex',
      padding: '50px',
    }
  } else {
    return {
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }
  }
}

export const SpinnerStyles = styled.div`
  margin: 16px;
`
