import type { SWRConfiguration } from 'swr'
import useSWR from 'swr'

import { api } from '@/lib/api'
import { parseError } from '@/lib/errors'

const fetcher = (url: string) => api.get(url).then(res => res.data)

export const useFetch = <T>(key: string, swrConfig?: SWRConfiguration) => {
    const r = useSWR<T>(key, { ...swrConfig, fetcher: swrConfig?.fetcher ?? fetcher })

    return {
        ...r,
        error: r.error ? parseError(r.error) : undefined,
        data: r.data as T,
    }
}
