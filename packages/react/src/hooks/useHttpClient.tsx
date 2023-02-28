import { Configuration, DefaultApi } from '@flatfile/api'

export const ClientConfig = (accessToken: string) => {
  return new Configuration({
    basePath:
      import.meta.env.VITE_BASE_API_URL ?? 'https://api.x.flatfile.com/v1',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
}

export const useHttpClient = ({ accessToken }: { accessToken: string }) => {
  const httpClient = new DefaultApi(ClientConfig(accessToken))
  return { httpClient }
}
