import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  flex-direction: column;
`

const DefaultError = ({ error }: { error: string | Error }) => {
  return (
    <Container>
      <h3>Error loading space:</h3>
      <p>{JSON.stringify(error)}</p>
    </Container>
  )
}

export default DefaultError
