import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
`

const DefaultLoading = ({ message }: { message?: string }) => {
  return (
    <Container>
      <h3>Loading...</h3>
      {message && <p>{message}</p>}
    </Container>
  )
}

export default DefaultLoading
