import cookie from '@fastify/cookie'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import fastify, { FastifyInstance } from 'fastify'
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod'

import { config } from '@/config'
import { authController } from '@/controllers/auth'
import { logger } from '@/lib/logger'
import { errorHandler } from '@/plugins/error-handler'
import { healthCheck } from '@/plugins/health-check'

class App {
    private app: FastifyInstance

    constructor() {
        this.app = fastify({ logger })
    }

    private registerPlugins = async () => {
        await this.app.register(helmet)
        await this.app.register(cookie)
        await this.app.register(cors, {
            origin: config.ORIGIN,
            credentials: true,
        })
        this.app.setErrorHandler(errorHandler)
    }

    private registerRoutes = async () => {
        await this.app.register(
            (fastify, options, done) => {
                fastify.setValidatorCompiler(validatorCompiler)
                fastify.setSerializerCompiler(serializerCompiler)

                fastify.register(authController)

                done()
            },
            {
                prefix: '/api',
            },
        )
    }

    private registerHealthCheck = async () => {
        await this.app.register(healthCheck)
    }

    public listen = async () => {
        await this.registerPlugins()
        await this.registerRoutes()
        await this.registerHealthCheck()

        await this.app.listen({ port: config.PORT, host: config.HOST })
    }
}

export const app = new App()
