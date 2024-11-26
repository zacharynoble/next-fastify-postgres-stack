import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { getUser } from '@/lib/dal'

import { RegisterForm } from './_components/form'

export const metadata: Metadata = {
    title: 'Register',
    description: 'Create an account to start using our app',
}

export default async function Register() {
    const user = await getUser()
    if (user) redirect('/')

    return <RegisterForm />
}
