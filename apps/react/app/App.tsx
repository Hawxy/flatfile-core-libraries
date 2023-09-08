'use client'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useSpace } from '@flatfile/react'
import { listener } from './listener'
import styles from './page.module.css'

const SPACE_ID = 'us_sp_123456'
const ENVIRONMENT_ID = 'us_env_123456'

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
}

const LoadingComponent = () => <label>Loading data....</label>

const Space = ({
  setShowSpace,
  accessToken,
}: {
  setShowSpace: Dispatch<SetStateAction<boolean>>
  accessToken: string
}) => {
  const space = useSpace({
    ...spaceProps,
    space: {
      // PUT SPACE ID TO REUSE HERE
      id: SPACE_ID,
      accessToken,
    },
    loading: <LoadingComponent />,
    exitPrimaryButtonText: 'CLOSE!',
    exitSecondaryButtonText: 'KEEP IT!',
    closeSpace: {
      operation: 'contacts:submit',
      onClose: () => setShowSpace(false),
    },
  })
  return space
}

function App() {
  const [showSpace, setShowSpace] = useState(false)
  const [data, setData] = useState<any>()
  useEffect(() => {
    const fetchData = async () => {
      const spaceId = SPACE_ID
      const response = await fetch(`api/spaces/${spaceId}`)

      const json = await response.json()
      setData(json)
    }
    fetchData().catch(console.error)
  }, [])

  return (
    <div className={styles.main}>
      <div className={styles.description}>
        <button
          onClick={() => {
            setShowSpace(!showSpace)
          }}
        >
          {showSpace === true ? 'Close' : 'Open'} space
        </button>
      </div>
      {showSpace && (
        <div className={styles.spaceWrapper}>
          <Space
            setShowSpace={setShowSpace}
            accessToken={data.space.data.accessToken}
          />
        </div>
      )}
    </div>
  )
}

export default App
