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
            className='flex w-full items-center gap-2 rounded-md p-2 text-sm text-muted-foreground hover:bg-secondary'
        >
            {theme === 'light' ? <SunIcon width={15} height={15} /> : <MoonIcon width={15} height={15} />}
            Toggle Theme
        </button>
    )
}
