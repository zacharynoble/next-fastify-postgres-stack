import { config } from '@/config'

export const logger =
    config.NODE_ENV === 'development'
        ? {
              transport: {
                  target: 'pino-pretty',
                  options: {
                      translateTime: 'HH:MM:ss Z',
                      ignore: 'pid,hostname,reqId,req.remoteAddress,req.remotePort',
                  },
              },
          }
        : true
