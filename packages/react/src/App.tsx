import React, { useState, useEffect, useCallback } from 'react'
import ReactDOM from 'react-dom'
import { basicConfig } from './examples/basicConfig'
import { ISpaceConfig } from './types/ISpaceConfig'
import { useThemeGenerator } from './hooks/useThemeGenerator'
import { useSpace } from './hooks/useSpace'

const spaceProps: ISpaceConfig = {
  // to test locally add your local vars here
  accessToken: '',
  environmentId: '',
  spaceConfig: basicConfig,
}

const ExampleApp = () => {
  const [showSpace, setShowSpace] = useState(false)

  const theme = useThemeGenerator({ primary: '#cbdfbd' })

  const fullSpaceProps = {
    ...spaceProps,
    themeConfig: theme,
  }

  const { error, data } = useSpace(fullSpaceProps)

  return (
    <div style={{ padding: '16px' }}>
      <button
        onClick={() => {
          setShowSpace(!showSpace)
        }}
      >
        {showSpace === true ? 'Close' : 'Open'} space
      </button>
      {error && (
        <div>
          🚫 Oh no! There's an error!
          <div>{`${error}`}</div>
        </div>
      )}
      {showSpace && !error && data?.component}
    </div>
  )
}

ReactDOM.render(<ExampleApp />, document?.getElementById('root') as Element)
