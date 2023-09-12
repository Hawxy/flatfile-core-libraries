import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin: 16px;
`

const Header = styled.h3`
  display: flex;
  margin-bottom: 0;
`

const DefaultError = ({ error }: { error: string | Error }) => {
  const errorMessage = typeof error === 'string' ? error : error.message

  return (
    <Container className="ff_error_container">
      <Header className="ff_error_heading">Something went wrong</Header>
      <p className="ff_error_text">{errorMessage}</p>
    </Container>
  )
}

export default DefaultError
