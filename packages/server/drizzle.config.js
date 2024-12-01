import { defineConfig } from 'drizzle-kit'

import { config } from './config'

export default defineConfig({
    schema: './models',
    out: './db/migrations',
    dialect: 'postgresql',
    dbCredentials: {
        url: config.DATABASE_URL,
    },
})
