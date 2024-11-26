import { FastifyRequest } from 'fastify'

import { authService } from '@/services/auth'

export const authenticate = async <T extends FastifyRequest>(req: T) => {
    const {
        cookies: { sessionId },
    } = req

    const user = await authService.authenticateUser(sessionId)

    req.user = user
}
