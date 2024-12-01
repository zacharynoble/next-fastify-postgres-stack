'use client'

import { useRouter } from 'next/navigation'
import type { ReactNode } from 'react'
import { createContext } from 'react'

import { useFetch } from '@/hooks/use-fetch'
import { api } from '@/lib/api'
import type { User } from '@/types'

interface LoginBody {
    email: string
    password: string
    recaptchaToken: string | undefined | null
}

export const AuthContext = createContext<{
    isLoading: boolean
    user?: User
    isAuthed: boolean
    login: (body: LoginBody) => Promise<void>
    logout: () => Promise<void>
} | null>(null)

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
    const { data: user, isLoading, mutate } = useFetch<User>('/user', { errorRetryCount: 0 })
    const router = useRouter()

    const login = async (body: LoginBody) => {
        await api.post('/login', body)
        mutate(undefined, { revalidate: true })
        router.replace('/')
    }

    const logout = async () => {
        await api.post('/logout')
        mutate(undefined, { revalidate: false })
        router.refresh()
    }

    return (
        <AuthContext.Provider
            value={{
                isLoading,
                user,
                isAuthed: !!user,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}
