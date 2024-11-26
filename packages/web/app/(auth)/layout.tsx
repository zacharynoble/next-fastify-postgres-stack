import Link from 'next/link'
import type { ReactNode } from 'react'

interface Props {
    children: ReactNode
}

export default function Layout({ children }: Props) {
    return (
        <div>
            <div className='absolute top-6 left-6'>
                <Link href='/' className='text-theme dark:text-theme-foreground text-2xl italic font-bold'>
                    YourApp
                </Link>
            </div>
            <div className='flex justify-center sm:mt-32 mt-28'>
                <div className='py-0 px-7 sm:p-5 w-[100%] sm:max-w-[450px] border-0 sm:border sm:rounded-lg'>
                    {children}
                </div>
            </div>
        </div>
    )
}
