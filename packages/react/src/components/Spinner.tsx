import React from 'react'
import styled, { keyframes } from 'styled-components'
import '../index.css'

type SpinnerProps = {
  size?: number
}

const rotateAnimation = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

const dashAnimation = keyframes`
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124;
  }
`

const StyledSpinner = styled.svg<SpinnerProps>`
  animation: ${rotateAnimation} 1.5s linear infinite;
  flex-shrink: 0;
  font-size: ${({ size }) => size}px;
  height: 1em;
  width: 1em;

  circle {
    stroke: var(--color-electric-800);
    stroke-linecap: round;
    animation: ${dashAnimation} 1.8s ease-in-out infinite;
  }
`

const Spinner = ({ size = 36 }: SpinnerProps) => {
  return (
    <StyledSpinner
      className="spinner"
      data-testid="spinner-icon"
      fill="none"
      role="img"
      size={size}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="8" fill="none" strokeWidth="2" />
    </StyledSpinner>
  )
}

export default Spinner
