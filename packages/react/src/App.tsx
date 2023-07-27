import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import { ISpace } from './types/ISpace'
import { useSpace } from './hooks/useSpace'
import { listener } from './examples/joinFields'

const spaceProps: ISpace = {
  environmentId: 'us_env_123',
  listener,
  space: {
    id: 'us_sp_123',
    accessToken: 'sk_1234',
  },
}

const ExampleApp = () => {
  const [showSpace, setShowSpace] = useState(false)

  const space = useSpace({
    ...spaceProps,
    closeSpace: {
      operation: 'contacts:submit',
      onClose: () => setShowSpace(false),
    },
  })

  return (
    <div style={{ padding: '16px' }}>
      <button
        onClick={() => {
          setShowSpace(!showSpace)
        }}
      >
        {showSpace === true ? 'Close' : 'Open'} space
      </button>
      {showSpace && space}
    </div>
  )
}

const root = document?.getElementById('root')

ReactDOM.render(<ExampleApp />, root)
