'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { AxeIcon } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { MutableRefObject } from 'react'
import { useEffect, useRef, useState } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { config } from '@/config'
import { useAuth } from '@/hooks/use-auth'
import { api } from '@/lib/api'
import { parseError, setFieldErrors } from '@/lib/errors'

const formSchema = z.object({
    name: z.string().min(1, 'Please enter your name'),
    email: z.string().email().min(1, 'Enter your email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
})

type FormData = z.infer<typeof formSchema>

export const RegisterForm = () => {
    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
        },
    })
    const { name, email, password } = form.watch()
    const [errorMessage, setErrorMessage] = useState<string>()
    const [loading, setLoading] = useState(false)
    const reRef: MutableRefObject<ReCAPTCHA | null> = useRef(null)
    const router = useRouter()
    const { login } = useAuth()

    useEffect(() => {
        setErrorMessage(undefined)
    }, [name, email, password])

    const onSubmit = async (data: FormData) => {
        try {
            setLoading(true)
            let recaptchaToken = await reRef.current?.executeAsync()
            reRef.current?.reset()
            await api.post('/register', { ...data, recaptchaToken })
            try {
                recaptchaToken = await reRef.current?.executeAsync()
                reRef.current?.reset()
                await login({ ...data, recaptchaToken })
            } catch {
                router.push('/login')
            }
        } catch (error) {
            const { message, fields } = parseError(error)
            if (fields) {
                setFieldErrors(fields, form.setError)
            } else {
                setErrorMessage(message || 'Something went wrong signing up')
            }
            setLoading(false)
        }
    }

    return (
        <Form {...form}>
            <div className='flex w-full justify-center'>
                <AxeIcon width={40} height={40} className='mb-2 mt-1 text-theme dark:text-theme-foreground' />
            </div>
            <h1 className='py-1 text-center text-3xl'>Get Started</h1>
            <h1 className='py-1 text-center text-sm text-muted-foreground'>Create a new account</h1>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
                <ReCAPTCHA sitekey={config.RECAPTCHA_SITE_KEY} size='invisible' ref={reRef} />
                <div className='space-y-6'>
                    <FormField
                        control={form.control}
                        name='name'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder='Your Name' autoComplete='register-name' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='email'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder='email@domain.com' autoComplete='register-email' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='password'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder='Enter your password'
                                        type='password'
                                        autoComplete='register-password'
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                {errorMessage && <p className='text-sm font-semibold text-red-600'>{errorMessage}</p>}
                <Button type='submit' className='w-full' variant='theme'>
                    {loading ? <Spinner /> : 'Sign up'}
                </Button>
            </form>
            <div className='mb-1 mt-5 flex items-center justify-center gap-1.5'>
                <p className='text-sm text-muted-foreground'>Already have an account?</p>
                <Link href='/login' className='text-sm underline underline-offset-2 hover:opacity-80'>
                    Log in
                </Link>
            </div>
        </Form>
    )
}
