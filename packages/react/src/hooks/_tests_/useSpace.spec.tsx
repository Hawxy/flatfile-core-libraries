import { FlatfileClient } from '@flatfile/api'
import { render } from '@testing-library/react'
import { renderHook } from '@testing-library/react-hooks'
import Pubnub from 'pubnub'
import React from 'react'
import { vi } from 'vitest'
import DefaultError from '../../components/Error'
import Space from '../../components/Space'
import { mockDocument, mockSpace, mockWorkbook } from '../../test/mocks'
import { ISpace } from '../../types/ISpace'
import { EventSubscriber } from '../../utils/EventSubscriber'
import useSpace from '../useSpace'

vi.mock('../utils/EventSubscriber', () => ({
  EventSubscriber: {
    getClient: vi.fn()
  }
}))

vi.mock('@flatfile/api')

const baseSpaceProps = {
  loading: undefined,
  publishableKey: 'your-publishable-key',
  environmentId: 'your-env-id',
  workbook: mockWorkbook,
  name: 'Embedded space'
}

const TestComponent: React.FC<ISpace> = (props) => {
  const result = useSpace(props)
  return <div>{result}</div>
}

const renderUseSpaceHook = (props: ISpace) =>
  render(<TestComponent {...props} />)

const renderUseSpaceHookWithHookResult = (props: ISpace) =>
  renderHook(() => useSpace(props))

describe('useSpace', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterAll(() => {
    vi.resetAllMocks()
  })

  it('renders the loading element when pubNub is not yet available', () => {
    const { getByTestId } = renderUseSpaceHook({
      ...baseSpaceProps
    })

    expect(getByTestId('spinner-icon')).toBeInTheDocument()
  })
  it('renders the error element when there is an error', async () => {
    vi.spyOn(FlatfileClient.prototype.spaces, 'create').mockRejectedValue(
      'There has been an error my friend'
    )
    const { result, waitForNextUpdate } = renderUseSpaceHookWithHookResult({
      ...baseSpaceProps
    })

    await waitForNextUpdate()

    const { current } = result

    const error = current.type === DefaultError ? current : undefined

    expect(error).toBeDefined()
  })
  it('renders the Space component when pubNub is present', async () => {
    vi.spyOn(FlatfileClient.prototype.spaces, 'create').mockResolvedValue({
      data: mockSpace
    })

    vi.spyOn(FlatfileClient.prototype.workbooks, 'create').mockResolvedValue({
      data: mockWorkbook
    })

    vi.spyOn(FlatfileClient.prototype.spaces, 'update').mockResolvedValue({
      data: mockSpace
    })

    vi.spyOn(FlatfileClient.prototype.documents, 'create').mockResolvedValue({
      data: mockDocument
    })

    const pubnub = new Pubnub({
      subscribeKey: 'test-subscribe-key',
      uuid: 'test-uuid'
    })

    const accessToken = 'your-access-token'

    vi.spyOn(EventSubscriber, 'getClient').mockResolvedValueOnce({
      pubnub,
      token: accessToken
    })

    const { result, waitForNextUpdate } = renderUseSpaceHookWithHookResult({
      ...baseSpaceProps
    })

    await waitForNextUpdate()
    await waitForNextUpdate()

    const { current } = result

    const spaceComponent = current.type === Space ? current : undefined

    expect(spaceComponent).toBeDefined()
  })
})
