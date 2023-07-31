export const mockWorkbook = {
  id: 'wb-id',
  sheets: [],
  name: 'Test Workbook',
  actions: [],
  spaceId: 'test-space-id',
  createdAt: new Date('01/01/2000'),
  updatedAt: new Date('01/01/2001')
}

export const mockDocument = {
  id: 'doc-id',
  title: 'Example-title',
  body: 'Example-body'
}

export const mockSpace = {
  id: 'space-id',
  accessToken: 'access-token',
  createdAt: new Date('01/01/2000'),
  updatedAt: new Date('01/01/2001'),
  isCollaborative: true,
  guestLink: 'fake-url'
}
