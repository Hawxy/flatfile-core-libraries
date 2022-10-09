import chalk from 'chalk'
import path from 'path'
import { info } from '../ui/info'
import { build } from 'tsup'
import { generateAccessToken } from '../utilities/accessToken'
import { deploy } from '../../deploy'
import { summary } from '../ui/summary'

export const publishAction = async (
  file: string,
  options: Partial<{ team: string; env: string; apiUrl: string }>
) => {
  const teamId = options.team || process.env.FLATFILE_TEAM_ID
  const env = options.env || process.env.FLATFILE_ENV || 'test'
  const apiUrl: string =
    options.apiUrl ||
    process.env.FLATFILE_API_URL ||
    'https://api.us.flatfile.io'

  if (!teamId) {
    console.log(
      `You must provide a Team ID. Either set the ${chalk.bold(
        'FLATFILE_TEAM_ID'
      )} environment variable or pass the ID in as an option to this command with ${chalk.bold(
        '--team'
      )}`
    )
    process.exit(1)
  }

  const outDir = path.join(process.cwd(), '.flatfile')

  try {
    info('Build Workbook')

    await build({
      config: false,
      entry: { build: file },
      outDir,
      format: 'cjs',
      noExternal: [/.*/],
    })
  } catch (e) {
    console.log('Build failed')
    console.log(chalk.red(e))

    process.exit(1)
  }

  info('Generate token')
  const token = await generateAccessToken({ apiUrl })

  info('Deploy Workbook to Flatfile')

  try {
    const buildFile = path.join(outDir, 'build.js')
    const { schemaIds, portals } = await deploy(buildFile, {
      apiUrl,
      apiKey: token,
      team: teamId,
      env,
    })

    console.log(`🎉 Deploy successful! 🎉`)

    summary({
      teamId: parseInt(teamId, 10),
      apiURL: apiUrl,
      schemaIds,
      env,
      portals,
    })
  } catch (e) {
    console.log('Deploy failed')
    console.log(chalk.red(e))

    process.exit(1)
  }
}
