import { FastifyPluginCallback } from 'fastify'

export const healthCheck: FastifyPluginCallback = (fastify, options, done) => {
    fastify.get('/health', () => 'Service Running.')

    done()
}
