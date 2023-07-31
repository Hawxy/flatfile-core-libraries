import { vi } from 'vitest'
import { addSpaceInfo } from '../addSpaceInfo'
import { FlatfileClient } from '@flatfile/api'
import { mockDocument, mockWorkbook } from '../../test/mocks'

describe('addSpaceInfo', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterAll(() => {
    vi.resetAllMocks()
  })

  const innerWorkbook = {
    spaceId: 'test=space-id',
    createdAt: new Date('01/01/2000'),
    updatedAt: new Date('01/01/2001')
  }
  const mockSpaceProps = {
    workbook: mockWorkbook,
    document: mockDocument,
    themeConfig: {},
    sidebarConfig: {},
    spaceInfo: {},
    publishableKey: 'test-pub-key'
  }

  const mockSpaceResponse = {
    id: 'test-space-id',
    isCollaborative: true,
    createdAt: new Date('01/01/2000'),
    updatedAt: new Date('01/01/2001')
  }

  const mockSpaceId = 'test-space-id'
  const mockApi = new FlatfileClient()

  it('should add space information successfully', async () => {
    vi.spyOn(mockApi.workbooks, 'create').mockResolvedValueOnce({
      data: {
        id: 'test-workbook-id',
        ...innerWorkbook
      }
    })

    vi.spyOn(mockApi.spaces, 'update').mockResolvedValueOnce({
      data: { ...mockSpaceResponse }
    })

    vi.spyOn(mockApi.documents, 'create').mockResolvedValueOnce({
      data: {
        id: 'test-document-id',
        title: 'doc-title',
        body: 'doc-body'
      }
    })

    await addSpaceInfo(mockSpaceProps, mockSpaceId, mockApi)

    expect(mockApi.workbooks.create).toHaveBeenCalledWith({
      sheets: mockWorkbook.sheets,
      name: mockWorkbook.name,
      actions: mockWorkbook.actions,
      spaceId: mockSpaceId,
    })

    expect(mockApi.spaces.update).toHaveBeenCalledWith(mockSpaceId, {
      metadata: {
        theme: {},
        sidebarConfig: {},
        spaceInfo: {}
      }
    })

    expect(mockApi.documents.create).toHaveBeenCalledWith(mockSpaceId, {
      title: mockDocument.title,
      body: mockDocument.body
    })
  })

  it('should throw an error if creating workbook fails', async () => {
    vi.spyOn(mockApi.workbooks, 'create').mockRejectedValueOnce(
      new Error('Failed to create workbook')
    )

    await expect(
      addSpaceInfo(mockSpaceProps, mockSpaceId, mockApi)
    ).rejects.toThrow(
      'Error adding workbook to space: Failed to create workbook'
    )
  })

  it('should throw an error if creating document fails', async () => {
    vi.spyOn(mockApi.workbooks, 'create').mockResolvedValueOnce({
      data: {
        id: 'test-workbook-id',
        ...innerWorkbook
      }
    })

    vi.spyOn(mockApi.spaces, 'update').mockResolvedValueOnce({
      data: { ...mockSpaceResponse }
    })

    vi.spyOn(mockApi.documents, 'create').mockRejectedValueOnce(
      new Error('Failed to create document')
    )

    await expect(
      addSpaceInfo(mockSpaceProps, mockSpaceId, mockApi)
    ).rejects.toThrow(
      'Error adding workbook to space: Failed to create document'
    )
  })

  it('should throw an error if updating space fails', async () => {
    vi.spyOn(mockApi.workbooks, 'create').mockResolvedValueOnce({
      data: {
        id: 'test-workbook-id',
        ...innerWorkbook
      }
    })

    vi.spyOn(mockApi.spaces, 'update').mockRejectedValueOnce(
      new Error('Failed to update space')
    )

    await expect(
      addSpaceInfo(mockSpaceProps, mockSpaceId, mockApi)
    ).rejects.toThrow('Error adding workbook to space: Failed to update space')
  })
})
