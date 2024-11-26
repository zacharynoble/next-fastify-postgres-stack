'use client'

import { MoonIcon, SunIcon } from '@radix-ui/react-icons'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export const ThemeButton = () => {
    const [mounted, setMounted] = useState(false)
    const { theme, setTheme } = useTheme()

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    return (
        <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className='rounded-md p-2 hover:bg-gray-100 dark:hover:bg-gray-800'
        >
            {theme === 'light' ? <SunIcon width={19} height={19} /> : <MoonIcon width={19} height={19} />}
        </button>
    )
}
