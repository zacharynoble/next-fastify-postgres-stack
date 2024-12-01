import Link from 'next/link'
import type { ReactNode } from 'react'

interface Props {
    children: ReactNode
}

export default function Layout({ children }: Props) {
    return (
        <div>
            <div className='absolute left-6 top-6'>
                <Link href='/' className='text-2xl font-bold italic text-theme dark:text-theme-foreground'>
                    YourApp
                </Link>
            </div>
            <div className='mt-28 flex justify-center sm:mt-32'>
                <div className='w-full border-0 px-7 py-0 sm:max-w-[450px] sm:rounded-lg sm:border sm:p-5'>
                    {children}
                </div>
            </div>
        </div>
    )
}
