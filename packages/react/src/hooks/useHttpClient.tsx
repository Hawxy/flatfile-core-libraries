import { Configuration, DefaultApi } from '@flatfile/api'

export const ClientConfig = (accessToken: string) => {
  return new Configuration({
    basePath: 'https://platform.flatfile.com/api/v1',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
}

export const useHttpClient = ({ accessToken }: { accessToken: string }) => {
  const httpClient = new DefaultApi(ClientConfig(accessToken))
  return { httpClient }
}
