import { FlatfileClient } from '@flatfile/api'

export const authenticate = (key: string) => {
  /**
   * Instantiating this class with an incorrect key will not throw,
   * it will only throw when trying to access internal methods
   */
  return new FlatfileClient({
    token: key,
    environment: `${
      import.meta.env.VITE_API_URL || 'https://platform.flatfile.com/api'
    }/v1`
  })
}
