import { ClientAuthExample } from '@/components/client-auth-example'
import { ThemeButton } from '@/components/theme-button'

export default function Home() {
    return (
        <div className='flex flex-col items-center gap-3 mt-20'>
            <ThemeButton />
            <ClientAuthExample />
        </div>
    )
}
