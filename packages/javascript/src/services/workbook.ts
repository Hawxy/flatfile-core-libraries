import { UpdateSpaceInfo } from ".."

export const createWorkbook = async (data: UpdateSpaceInfo) => {
  const { apiUrl, accessToken, workbook, spaceId, environmentId } = data

  const createWorkbookEndpoint = `${apiUrl}/v1/workbooks`
  const response = await fetch(createWorkbookEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      sheets: workbook.sheets,
      name: workbook.name,
      actions: workbook.actions,
      spaceId,
      environmentId,
    }),
  })
  const localWorkbook = await response.json()

  if (!localWorkbook || !localWorkbook.data || !localWorkbook.data.id) {
    throw new Error('Failed to create workbook')
  }

  if (!response.ok) {
    const errorMessage = localWorkbook?.errors[0]?.message || 'Failed to create workbook'
    throw new Error(errorMessage)
  }
}