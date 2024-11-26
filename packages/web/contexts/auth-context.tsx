'use client'

import { useRouter } from 'next/navigation'
import type { ReactNode } from 'react'
import { createContext, useEffect, useState } from 'react'

import { api } from '@/lib/api'
import type { User } from '@/types'

interface LoginBody {
    email: string
    password: string
    recaptchaToken: string | undefined | null
}

export const AuthContext = createContext<{
    loadingUser: boolean
    user?: User
    isAuthed: boolean
    login: (body: LoginBody) => Promise<void>
    logout: () => Promise<void>
} | null>(null)

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
    const [loadingUser, setLoadingUser] = useState(true)
    const [user, setUser] = useState<User>()
    const [update, setUpdate] = useState(false)
    const router = useRouter()

    useEffect(() => {
        setLoadingUser(true)
        api.get<User>('/user')
            .then(res => setUser(res.data))
            .catch(() => setUser(undefined))
            .finally(() => setLoadingUser(false))
    }, [update])

    const login = async (body: LoginBody) => {
        await api.post('/login', body)
        setUpdate(!update)
        router.replace('/')
    }

    const logout = async () => {
        await api.post('/logout')
        setUser(undefined)
        router.refresh()
    }

    return (
        <AuthContext.Provider
            value={{
                loadingUser,
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
