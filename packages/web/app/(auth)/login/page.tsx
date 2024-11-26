import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { getUser } from '@/lib/dal'

import { LoginForm } from './_components/form'

export const metadata: Metadata = {
    title: 'Sign in',
    description: 'Sign in to start using our app',
}

export default async function Login() {
    const user = await getUser()
    if (user) redirect('/')

    return <LoginForm />
}
