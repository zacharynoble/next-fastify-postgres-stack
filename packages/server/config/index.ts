import dotenv from 'dotenv'
import { z } from 'zod'

dotenv.config()

const schema = z.object({
    NODE_ENV: z.enum(['development', 'production']),
    PORT: z.coerce.number().default(8080),
    HOST: z.string().default('0.0.0.0'),
    ORIGIN: z.string().url(),
    DATABASE_URL: z.string().url(),
    RECAPTCHA_SITE_KEY: z.string(),
    RECAPTCHA_PRIVATE_KEY: z.string(),
    RECAPTCHA_PROJECT_NAME: z.string(),
})

export const config = schema.parse(process.env)
