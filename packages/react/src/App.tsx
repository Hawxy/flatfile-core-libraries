import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { basicConfig } from './examples/basicConfig'
import { ISpaceConfig } from './types/ISpaceConfig'
import { makeTheme } from './utils/makeTheme'
import { useSpace } from './hooks/useSpace'

const spaceProps: ISpaceConfig = {
  // to test locally add your local vars here
  accessToken: '',
  environmentId: '',
  spaceConfig: basicConfig,
  themeConfig: makeTheme({ primaryColor: '#546a76', textColor: '#fff' }),
  sidebarConfig: {
    showDataChecklist: false,
  },
  document: {
    title: 'Test doc',
    body:
      '![Shop](https://coconut.show/logo-big.png)\n' +
      '\\\n' +
      '&nbsp;\n' +
      '\n' +
      '---\n' +
      '\n' +
      '# Welcome to the Coconut Shop!\n' +
      '\n' +
      'Please upload your contacts to the Coconut Shop using the Files menu on the left.\n',
  },
}

const ExampleApp = () => {
  const [showSpace, setShowSpace] = useState(false)

  const { error, data } = useSpace(spaceProps)

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

const root = createRoot(document?.getElementById('root') as Element)

root.render(<ExampleApp />)
