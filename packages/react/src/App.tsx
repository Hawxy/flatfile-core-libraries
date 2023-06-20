import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import { ISpace } from './types/ISpace'
import { makeTheme } from './utils/makeTheme'
import { useSpace } from './hooks/useSpace'
import { listener, config } from './examples/joinFields'

const spaceProps: ISpace = {
  name: 'Embedded Space',
  // to test locally add your local vars here
  publishableKey: '',
  environmentId: '',
  workbook: config,
  themeConfig: makeTheme({ primaryColor: '#546a76', textColor: '#fff' }),
  sidebarConfig: {
    showDataChecklist: false,
    showSidebar: false
  },
  listener
}

const ExampleApp = () => {
  const [showSpace, setShowSpace] = useState(false)

  const space = useSpace({
    ...spaceProps,
    closeSpace: {
      operation: 'contacts:submit',
      onClose: () => setShowSpace(false)
    }
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
