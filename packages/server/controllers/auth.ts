import { FastifyPluginCallback } from 'fastify'
import { z } from 'zod'

import { withZod } from '@/lib/zod'
import { authenticate } from '@/plugins/authenticate'
import { authService } from '@/services/auth'

const loginValidation = {
    body: z.object({
        email: z.string().min(1, 'Please enter your email').email(),
        password: z.string().min(1, 'Please enter your password'),
        recaptchaToken: z.string().optional(),
    }),
}

const registerValidation = {
    body: z.object({
        email: z.string().min(1, 'Please enter your email').email(),
        name: z.string().min(1, 'Please enter your name'),
        password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
        recaptchaToken: z.string().optional(),
    }),
}

export const authController: FastifyPluginCallback = (fastify, options, done) => {
    const api = withZod(fastify)

    api.post(
        '/register',
        {
            schema: registerValidation,
        },
        async req => {
            await authService.register(req.body)
        },
    )

    api.post(
        '/login',
        {
            schema: loginValidation,
        },
        async (req, reply) => {
            const sessionId = await authService.login(req.body)
            reply.setCookie('sessionId', sessionId, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                path: '/',
            })
        },
    )

    api.post('/logout', async (req, reply) => {
        const {
            cookies: { sessionId },
        } = req

        if (sessionId) {
            await authService.logout(sessionId)
            reply.clearCookie('sessionId')
        }
    })

    api.get(
        '/user',
        {
            preHandler: [authenticate],
        },
        req => req.user,
    )

    done()
}
