import bcrypt from 'bcrypt'
import crypto from 'crypto'
import { eq } from 'drizzle-orm'

import { db } from '@/db'
import { ConflictError, UnauthorizedError } from '@/lib/errors'
import { validateRecaptcha } from '@/lib/recaptcha'
import { sessions } from '@/models/sessions'
import { users } from '@/models/users'

class AuthService {
    getUser = async (email: string) => {
        const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1)
        return user
    }

    register = async ({
        email,
        password,
        name,
        recaptchaToken,
    }: {
        email: string
        password: string
        name: string
        recaptchaToken?: string
    }) => {
        await validateRecaptcha(recaptchaToken)

        const existingUser = await this.getUser(email)
        if (existingUser) throw new ConflictError('That email is already taken', { field: 'email' })

        const passwordHash = await bcrypt.hash(password, 11)
        await db.insert(users).values({ email, name, passwordHash })
    }

    login = async ({
        email,
        password,
        recaptchaToken,
    }: {
        email: string
        password: string
        recaptchaToken?: string
    }) => {
        await validateRecaptcha(recaptchaToken)

        const user = await this.getUser(email)
        if (!user) throw new UnauthorizedError('Invalid username or password')

        const isCorrectPassword = await bcrypt.compare(password, user.passwordHash)
        if (!isCorrectPassword) throw new UnauthorizedError('Invalid username or password')

        const sessionId = crypto.randomBytes(64).toString('hex')
        await db.insert(sessions).values({ sessionId, userId: user.id })

        return sessionId
    }

    logout = async (sessionId: string) => {
        await db.delete(sessions).where(eq(sessions.sessionId, sessionId))
    }

    authenticateUser = async (sessionId?: string) => {
        if (!sessionId) throw new UnauthorizedError('Session ID missing in request')

        const [user] = await db
            .select({ id: users.id, email: users.email, name: users.name })
            .from(sessions)
            .innerJoin(users, eq(sessions.userId, users.id))
            .where(eq(sessions.sessionId, sessionId))
            .limit(1)

        if (!user) throw new UnauthorizedError('Your session is no longer valid, please sign in again')

        return user
    }
}

export const authService = new AuthService()
