import React from 'react'
import styled from 'styled-components'
import '../index.css'

type SpinnerProps = {
  size?: number
}

const StyledSpinner = styled.div<SpinnerProps>`
  border: 4px solid rgba(255, 255, 255, 0.7);
  border-top: 4px solid var(--ff-primary-color);
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 999;

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`

const Spinner = () => {
  return <StyledSpinner 
    className="spinner"
    data-testid="spinner-icon"
  >
  </StyledSpinner>
}

export default Spinner