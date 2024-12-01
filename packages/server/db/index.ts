import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'

import { config } from '@/config'

const pg = postgres(config.DATABASE_URL, {
    onnotice: () => {},
})

export const db = drizzle(pg)

migrate(db, { migrationsFolder: './db/migrations' })
