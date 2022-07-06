require('dotenv').config()

import example from './setup'
import { readFileSync } from 'fs'
import { parse } from 'yaml'
import { gql, GraphQLClient } from 'graphql-request'
import webpack from 'webpack'
var webpackConfig = require('../webpack.config.js')
var fs = require('fs')
const client = new GraphQLClient(`${process.env.API_URL}/graphql`, {
  headers: {
    Authorization: `Bearer ${process.env.API_KEY}`,
  },
})

const MUTATION_UPSERT_SCHEMA = gql`
  mutation UpsertSchema(
    $slug: String
    $teamId: ID!
    $archived: Boolean
    $jsonSchema: JsonSchemaDto
    $name: String
    $previewFieldKey: String
  ) {
    upsertSchema(
      slug: $slug
      teamId: $teamId
      archived: $archived
      jsonSchema: $jsonSchema
      name: $name
      previewFieldKey: $previewFieldKey
    ) {
      id
    }
  }
`

const UPSERT_DATAHOOK_SCHEMA = gql`
  mutation UpsertDataHook(
    $name: String
    $schemaId: String
    $description: String
    $code: String
    $packageJSON: String
    $archived: Boolean
  ) {
    upsertDataHook(
      name: $name
      schemaId: $schemaId
      archived: $archived
      description: $description
      code: $code
      packageJSON: $packageJSON
    ) {
      schema {
        id
      }
      dataHook {
        id
        archived
        name
        description
        code
        packageJSON
        deploymentState
        lambdaARN
        createdAt
        updatedAt
        root {
          id
        }
        ancestor {
          id
        }
      }
    }
  }
`

async function sendSchemasToServer() {
  const { sheets, namespace } = example.options
  const schemaSlugs = Object.keys(sheets)

  const newSchemaVersions = await Promise.all(
    schemaSlugs.map(async (slug) => {
      const model = example.options.sheets[slug]
      const name = model.name
      const schema = await client.request(MUTATION_UPSERT_SCHEMA, {
        slug: `${namespace}/${slug}`,
        teamId: '1', // TODO IMPROVE THIS
        name,
        jsonSchema: {
          schema: model.toJSONSchema(example.options.namespace, slug),
        },
      })

      const {
        upsertSchema: { id },
      } = schema

      return id
    })
  )
  console.log({ newSchemaVersions })

  newSchemaVersions.map((schemaId) => {
    buildPayloadForLambda(schemaId)
  })

  // loop through each
  // - publish schema update by key and workbook slug
}

async function runFakeDataHook() {
  const yaml = readFileSync('./fake-hook-payload.yaml').toString()
  const json = parse(yaml)
  const transformed = await example.handleLegacyDataHook(json)
  console.log(JSON.stringify(transformed, null, '  '))
}

async function buildPayloadForLambda(schemaId: number) {
  const compiler = webpack(webpackConfig)

  compiler.run(async (err, stats) => {
    try {
      const data = fs.readFileSync('./dist/hook.js', 'utf8')

      const {
        upsertDataHook: { schema: newSchema },
      } = await client.request(UPSERT_DATAHOOK_SCHEMA, {
        name: 'Datahook From SDK',
        schemaId,
        code: data
      })

      console.log({ newSchemaId: newSchema.id })
    } catch (err) {
      console.log(err)
    }

    //now you can work with the file as you want.
    // console.log({ file });
    compiler.close((closeErr) => {
      // ...
    })
  })
}

// buildPayloadForLambda(39);

// runFakeDataHook();
sendSchemasToServer()
