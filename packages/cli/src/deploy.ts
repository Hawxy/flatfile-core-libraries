import { GraphQLClient } from 'graphql-request'
import { sendSchemasToServer } from './send-schemas'

/**
 * Deploy a compiled file to Flatfile
 *
 * @param buildFile
 * @param options
 */
export const deploy = async (buildFile: string, options: IDeployOptions) => {
  const client = new GraphQLClient(`${options.apiUrl}/graphql`, {
    headers: {
      Authorization: `Bearer ${options.apiKey}`,
    },
  })

  await sendSchemasToServer(client, buildFile, options)
}

interface IDeployOptions {
  apiUrl: string
  apiKey: string
  team: string
}
