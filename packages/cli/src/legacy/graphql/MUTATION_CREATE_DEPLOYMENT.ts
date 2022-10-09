import { gql } from 'graphql-request'

export const MUTATION_CREATE_DEPLOYMENT = gql`
  mutation CreateDeployment(
    $teamId: ID!
    $version: String
    $workbook: String
    $localPackageJSON: JSONObject
    $environment: String
  ) {
    createDeployment(
      teamId: $teamId
      version: $version
      workbook: $workbook
      localPackageJSON: $localPackageJSON
      environment: $environment
    ) {
      id
    }
  }
`
