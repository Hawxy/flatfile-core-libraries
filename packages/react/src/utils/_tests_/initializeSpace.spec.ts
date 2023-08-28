import { FlatfileClient } from '@flatfile/api'
import { vi } from 'vitest'
import { ISpace } from '@flatfile/embedded-utils'
import { initializeSpace } from '../initializeSpace'

const authenticateMock = vi.fn()
const addSpaceInfoMock = vi.fn()

vi.mock('./authenticate', () => ({
  authenticate: authenticateMock,
}))
vi.mock('./addSpaceInfo', () => ({
  addSpaceInfo: addSpaceInfoMock,
}))

vi.mock('@flatfile/api')

const mockWorkbook = {
  id: 'wb-id',
  sheets: [],
  name: 'Test Workbook',
  actions: [],
  spaceId: 'test-space-id',
  createdAt: new Date('01/01/2000'),
  updatedAt: new Date('01/01/2001'),
}

const mockSpaceProps: ISpace = {
  publishableKey: 'your-publishable-key',
  environmentId: 'your-environment-id',
  name: 'your-space-name',
  workbook: mockWorkbook,
}

describe('initializeSpace', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterAll(() => {
    vi.resetAllMocks()
  })

  it('should throw an error when publishable key is missing', async () => {
    const invalidSpaceProps: ISpace = {
      ...mockSpaceProps,
      publishableKey: '',
    }

    await expect(initializeSpace(invalidSpaceProps)).rejects.toThrowError(
      'Missing required publishable key'
    )
    expect(authenticateMock).not.toHaveBeenCalled()
    expect(addSpaceInfoMock).not.toHaveBeenCalled()
  })

  it('should throw an error when environment id is missing', async () => {
    const invalidSpaceProps: ISpace = {
      ...mockSpaceProps,
      environmentId: '',
    }

    await expect(initializeSpace(invalidSpaceProps)).rejects.toThrowError(
      'Missing required environment id'
    )
    expect(authenticateMock).not.toHaveBeenCalled()
    expect(addSpaceInfoMock).not.toHaveBeenCalled()
  })

  it('should throw an error when space creation fails', async () => {
    const mockApi = {}
    const error = new Error('Space creation error')

    authenticateMock.mockImplementation(() => {
      return mockApi
    })

    vi.spyOn(FlatfileClient.prototype.spaces, 'create').mockRejectedValue(error)

    await expect(initializeSpace(mockSpaceProps)).rejects.toThrowError(
      'Failed to create space'
    )
    expect(addSpaceInfoMock).not.toHaveBeenCalled()
  })

  it('should initialize a space and return the created space', async () => {
    const mockSpace = {
      id: 'space-id',
      environmentId: 'your-environment-id',
      accessToken: 'access-token',
      createdAt: new Date('01/01/2000'),
      updatedAt: new Date('01/01/2001'),
      isCollaborative: true,
    }

    const mockDocument = {
      id: 'doc-id',
      title: 'Example-title',
      body: 'Example-body',
    }

    vi.spyOn(FlatfileClient.prototype.spaces, 'create').mockResolvedValue({
      data: mockSpace,
    })

    vi.spyOn(FlatfileClient.prototype.workbooks, 'create').mockResolvedValue({
      data: mockWorkbook,
    })

    vi.spyOn(FlatfileClient.prototype.spaces, 'update').mockResolvedValue({
      data: mockSpace,
    })

    vi.spyOn(FlatfileClient.prototype.documents, 'create').mockResolvedValue({
      data: mockDocument,
    })

    const result = await initializeSpace(mockSpaceProps)

    expect(result).toStrictEqual({ data: mockSpace })
  })
})
