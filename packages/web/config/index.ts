import { z } from 'zod'

const schema = z.object({
    API_URL: z.string().url(),
    RECAPTCHA_SITE_KEY: z.string(),
})

export const config = schema.parse({
    API_URL: process.env.NEXT_PUBLIC_API_URL,
    RECAPTCHA_SITE_KEY: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
})
