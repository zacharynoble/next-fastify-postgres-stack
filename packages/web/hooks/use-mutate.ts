import type { TriggerWithArgs } from 'swr/mutation'
import useSWRMutation from 'swr/mutation'

import { api } from '@/lib/api'
import { parseError } from '@/lib/errors'

const sender = <U>(url: string, { arg }: { arg: U }) => api.post(url, arg).then(res => res.data)

export const useMutate = <T, U = any>(key: string) => {
    const r = useSWRMutation<T, U>(key, sender)

    return {
        ...r,
        error: r.error ? parseError(r.error) : undefined,
        data: r.data as T,
        trigger: r.trigger as TriggerWithArgs<T, any, string, U>,
    }
}
