'use client'
import React, { useState } from 'react'
import { useSpaceTrigger } from '@flatfile/react'
import { listener } from './listener'
import styles from './page.module.css'
import { config } from './config'

const SPACE_ID = 'us_sp_123456'
const ENVIRONMENT_ID = 'us_env_O60vqdol'

const spaceProps = {
  environmentId: ENVIRONMENT_ID,
  iframeStyles: {
    borderRadius: '12px',
    width: '100%',
    height: '750px',
    borderWidth: ' 0px',
    background: 'rgb(255, 255, 255)',
    padding: '16px',
  },
  listener: listener,
  publishableKey: "pk_3626978e5f52480085a37844166d347a",
  workbook: config
}

const LoadingComponent = () => <label>Loading data....</label>

function App() {
  const [showSpace, setShowSpace] = useState(false)
  
  const { Space, createOrUseSpace } = useSpaceTrigger({
    ...spaceProps,
    loading: <LoadingComponent />,
    exitPrimaryButtonText: 'CLOSE!',
    exitSecondaryButtonText: 'KEEP IT!',
    closeSpace: {
      operation: 'contacts:submit',
      onClose: () => setShowSpace(false),
    },
  })

  return (
    <div className={styles.main}>
      <div className={styles.description}>
        <button
          onClick={async () => {
            setShowSpace(!showSpace)
            await createOrUseSpace()
          }}
        >
          {showSpace === true ? 'Close' : 'Open'} space
        </button>
      </div>
      {showSpace && (
        <div className={styles.spaceWrapper}>
          <Space />
        </div>
      )}
    </div>
  )
}

export default App
