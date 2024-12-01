'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { AxeIcon } from 'lucide-react'
import Link from 'next/link'
import type { MutableRefObject } from 'react'
import { useRef, useState } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { config } from '@/config'
import { useAuth } from '@/hooks/use-auth'
import { parseError, setFieldErrors } from '@/lib/errors'

const formSchema = z.object({
    email: z.string().email().min(1, 'Enter your email address'),
    password: z.string().min(1, 'Enter your password'),
})

type FormData = z.infer<typeof formSchema>

export const LoginForm = () => {
    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    })
    const { login } = useAuth()
    const reRef: MutableRefObject<ReCAPTCHA | null> = useRef(null)
    const [loading, setLoading] = useState(false)

    const onSubmit = async (data: FormData) => {
        try {
            setLoading(true)
            const recaptchaToken = await reRef.current?.executeAsync()
            reRef.current?.reset()
            await login({ ...data, recaptchaToken })
        } catch (error) {
            const { message, fields } = parseError(error)
            if (fields) {
                setFieldErrors(fields, form.setError)
            } else {
                form.setError('password', { message: message || 'Something went wrong signing in' })
            }
            setLoading(false)
        }
    }

    return (
        <Form {...form}>
            <div className='flex w-full justify-center'>
                <AxeIcon width={40} height={40} className='mb-2 mt-1 text-theme dark:text-theme-foreground' />
            </div>
            <h1 className='py-1 text-center text-3xl'>Welcome back</h1>
            <h1 className='py-1 text-center text-sm text-muted-foreground'>Sign in to your account</h1>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
                <ReCAPTCHA sitekey={config.RECAPTCHA_SITE_KEY} size='invisible' ref={reRef} />
                <div className='space-y-6'>
                    <FormField
                        control={form.control}
                        name='email'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder='email@domain.com' autoComplete='current-email' {...field} />
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
                                        autoComplete='current-password'
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <Button type='submit' className='w-full' variant='theme'>
                    {loading ? <Spinner /> : 'Login'}
                </Button>
            </form>
            <div className='mb-1 mt-5 flex items-center justify-center gap-1.5'>
                <p className='text-sm text-muted-foreground'>Need an account?</p>
                <Link href='/register' className='text-sm underline underline-offset-2 hover:opacity-90'>
                    Sign Up
                </Link>
            </div>
        </Form>
    )
}
