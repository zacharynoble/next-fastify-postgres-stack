import { ClientAuthExample } from '@/components/client-auth-example'
import { ThemeButton } from '@/components/ui/theme-button'

export default function Home() {
    return (
        <div className='mt-20 flex flex-col items-center gap-3'>
            <ClientAuthExample />
            <div className='w-auto'>
                <ThemeButton />
            </div>
        </div>
    )
}
