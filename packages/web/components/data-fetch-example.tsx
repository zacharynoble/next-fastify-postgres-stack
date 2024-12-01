'use client'

import { useFetch } from '@/hooks/use-fetch'

import { Spinner } from './ui/spinner'

export const DataFetchExample = () => {
    const { data, isLoading, error } = useFetch<string[]>('/example')

    if (isLoading) return <Spinner />

    if (error) return <div>{error.message}</div>

    return (
        <div>
            {data.map((item, i) => (
                <div key={i}>{item}</div>
            ))}
        </div>
    )
}
