import 'server-only'

import { cookies } from 'next/headers'

import { api } from '@/lib/api'
import type { User } from '@/types'

const options = () => ({
    headers: {
        Cookie: cookies().toString(),
    },
})

export const getUser = async () => {
    if (cookies().has('sessionId')) {
        return api
            .get<User>('/user', options())
            .then(res => res.data)
            .catch(() => undefined)
    }

    return undefined
}
