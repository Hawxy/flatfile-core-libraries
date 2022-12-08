import { Configuration, DefaultApi } from '@flatfile/api'
import chalk from 'chalk'
import fetch from 'node-fetch'
import ora from 'ora'

export async function authAction({
  apiUrl,
  clientId,
  secret,
}: {
  apiUrl: string
  clientId: string
  secret: string
}) {
  const authSpinner = ora({
    text: `Creating access token`,
  }).start()
  try {
    const DEFAULT_API_URL = apiUrl ?? 'https://api.flatfile.space/v1'
    const ClientConfig = (accessToken: string) => {
      return new Configuration({
        basePath: DEFAULT_API_URL,
        fetchApi: fetch,
        accessToken,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
    }

    const authClient = new DefaultApi(
      new Configuration({
        fetchApi: fetch,
        basePath: DEFAULT_API_URL,
      })
    )

    const authResponse = await authClient.getAccessToken({
      getAccessTokenRequest: {
        clientId,
        secret,
      },
    })

    if (!authResponse?.data?.accessToken) {
      authSpinner.fail(`${chalk.red(authResponse)}`)
      process.exit(1)
    }
    const { accessToken } = authResponse.data

    const apiClient = new DefaultApi(ClientConfig(String(accessToken)))
    authSpinner.succeed(`Access token created`)
    return apiClient
  } catch (e) {
    console.log(e)
  }
}
