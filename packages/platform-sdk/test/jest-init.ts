import dotenv from 'dotenv'

dotenv.config()
process.env.FLATFILE_ALLOWED_EMAIL_DOMAINS = 'flatfile.io'
process.env.LAMBDA_ARN = 'local'
