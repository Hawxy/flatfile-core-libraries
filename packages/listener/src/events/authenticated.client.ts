import { Configuration, DefaultApi, FetchAPI } from '@flatfile/api'

const FLATFILE_API_URL =
  process.env.AGENT_INTERNAL_URL || 'http://localhost:3000'

export class AuthenticatedClient {
  private _accessToken?: string
  private _apiUrl?: string

  private _api?: DefaultApi
  public fetchApi: FetchAPI

  get api(): DefaultApi {
    if (this._api) {
      return this._api
    }

    const accessToken = this._accessToken
    const apiUrl = this._apiUrl ?? FLATFILE_API_URL
    const ClientConfig = new Configuration({
      basePath: `${apiUrl}/v1`,
      fetchApi: this.fetchApi,
      accessToken,
      headers: {
        Authorization: `Bearer ${accessToken || '...'}`,
        'x-disable-hooks': 'true',
      },
    })
    return new DefaultApi(ClientConfig)
  }

  fetch(url: string) {
    if (this.fetchApi) {
      return this.fetchApi
    }

    const headers = {
      Authorization:
        `Bearer ${process.env.FLATFILE_BEARER_TOKEN}` ?? `Bearer ...`,
    }
    const fetchUrl = FLATFILE_API_URL + '/' + url

    return this.fetchApi(fetchUrl, {
      headers,
    })
      .then((resp: any) => resp.json())
      .then((resp: any) => resp.data)
  }

  public setVariables({
    accessToken,
    apiUrl,
    fetchApi,
  }: {
    accessToken?: string
    apiUrl?: string
    fetchApi?: any
  }) {
    this._accessToken = accessToken
    this._apiUrl = apiUrl
    this.fetchApi = fetchApi
  }
}
